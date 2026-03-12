import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useAuthHook from "../../hooks/useUser";


function Chat() {
  const { user, loading } = useAuthHook();

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const scrollRef = useRef(null);

  const [myId, setMyId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:8080", {
      withCredentials: true
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // join room
  useEffect(() => {
    if (loading || !user || !socketRef.current) return;

    const id = user._id || user.id;

    if (!id) return;

    setMyId(id);

    socketRef.current.emit("join", id);

    socketRef.current.on("joined", () => {
      setJoined(true);
    });

  }, [loading, user]);

  // receive messages
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("receivePrivateMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          own: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]);
    });

    socketRef.current.on("userTyping", () => setIsTyping(true));
    socketRef.current.on("userStoppedTyping", () => setIsTyping(false));

    return () => {
      socketRef.current.off("receivePrivateMessage");
      socketRef.current.off("userTyping");
      socketRef.current.off("userStoppedTyping");
    };
  }, []);

  // auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!recipientId) return;

    socketRef.current.emit("typing", { to: recipientId });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { to: recipientId });
    }, 1500);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim() || !recipientId) return;

    const msgData = {
      to: recipientId,
      from: myId,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    socketRef.current.emit("privateMessage", msgData);

    setMessages((prev) => [...prev, { ...msgData, own: true }]);

    setMessage("");

    socketRef.current.emit("stopTyping", { to: recipientId });
  };

  if (loading) return <p className="p-4">Loading user...</p>;

  if (!joined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 shadow-lg rounded">
          <h2 className="text-xl font-semibold">Connecting to chat...</h2>
          {!myId && (
            <p className="text-red-500 text-sm">
              User id missing. Please login again.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">

      {/* header */}
      <div className="p-4 bg-white shadow flex justify-between">
        <input
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="border p-2 rounded"
        />
        <span className="text-sm text-gray-500">My ID: {myId}</span>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.own ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded shadow ${
                msg.own ? "bg-green-200" : "bg-white"
              }`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <p className="text-sm text-gray-500 italic">typing...</p>
        )}

        <div ref={scrollRef} />
      </div>

      {/* input */}
      <form onSubmit={sendMessage} className="p-3 bg-white flex gap-2">
        <input
          value={message}
          onChange={handleTyping}
          placeholder="Type message..."
          className="flex-1 border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;