import { useState } from "react";
// Import Link and useLocation for seamless routing
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation(); // Gets the current URL path

  const menuItems = [
    { name: "Home", icon: <LayoutDashboard size={20} />, link: "/dashboard" },
    { name: "Products", icon: <Package size={20} />, link: "/products" },
    { name: "Orders", icon: <ShoppingCart size={20} />, link: "#" }, // Add paths as you build them
    { name: "Users", icon: <Users size={20} />, link: "#" },
    { name: "chat", icon: <Package size={20} />, link: "/chat" },
  ];

  const stats = [
    { label: "Total Products", value: "120", growth: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "75", growth: "+5%", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Users", value: "45", growth: "+18%", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              V
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Vortex UI</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              // Logic to check if the link is active
              const isActive = location.pathname === item.link;

              return (
                <Link
                  key={item.name}
                  to={item.link}
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button className="flex items-center gap-3 text-slate-500 hover:text-red-600 font-semibold transition-colors w-full group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96 hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search analytics..." 
              className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">Alex Rivera</p>
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Administrator</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl border border-slate-200 object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Here is a summary of your business activity.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <ArrowUpRight size={20} />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${stat.bg} ${stat.color}`}>
                    {stat.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Visual Area */}
          <div className="bg-white border border-slate-200 rounded-3xl p-12 min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
               <LayoutDashboard size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analytics coming soon</h3>
            <p className="text-slate-500 max-w-xs mt-2 font-medium">
              We are currently processing your data to generate real-time insights. Check back shortly!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;