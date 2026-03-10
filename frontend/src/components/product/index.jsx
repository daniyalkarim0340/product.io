import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Package, 
  Layers, 
  LayoutDashboard, 
  ChevronLeft,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ArrowRight,
  X // Added the X icon for the drawer close button
} from "lucide-react"; 
import productApi from "../../Api/product.js";
import { productSchema } from "../../schema/product.schema.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State to control the slide-over menu
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", price: 0, stock: 0, category: "" }
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getproduct();
      setProducts(res.data.data || res.data.products || []);
    } catch (error) {
      setErrorMsg("Failed to fetch products");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const onSubmit = async (data) => {
    try {
      setErrorMsg("");
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key !== 'images') formData.append(key, data[key]);
      });
      if (data.images) Array.from(data.images).forEach(file => formData.append("images", file));

      await productApi.addproduct(formData);
      reset();
      setPreviewImages([]);
      fetchProducts();
      setIsAddMenuOpen(false); // Close the drawer on success
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productApi.deleteproduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      setErrorMsg("Failed to delete product");
    }
  };

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* GLOSSY NAV BAR */}
      <nav className="sticky top-0 z-40 mb-12 -mx-4 md:-mx-10 px-4 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-3">
               <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors md:hidden">
                  <ChevronLeft size={24} />
               </Link>
               <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                 <Sparkles className="text-blue-600 fill-blue-600" size={24} />
                 Inventory Pro
               </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium ml-1">Manage your storefront assets with precision.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center gap-3 bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all active:scale-95"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <button 
              onClick={() => setIsAddMenuOpen(true)}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 group"
            >
              <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Product</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* FULL WIDTH PRODUCT GRID */}
      <div className="max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-300">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-bold tracking-widest uppercase text-xs">Synchronizing Vault...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            <AnimatePresence mode='popLayout'>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute top-5 right-5 z-20">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter flex items-center gap-1.5 border border-white/20">
                        <Layers size={12} className="text-blue-400" /> {product.stock} IN STOCK
                      </span>
                    </div>
                    <img 
                      src={product.images?.[0]?.secureUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                       <h3 className="text-white text-xl font-black truncate drop-shadow-lg">{product.name}</h3>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {product.category || "General"}
                      </span>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">${product.price}</p>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 italic">
                      "{product.description}"
                    </p>

                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest group/btn"
                      >
                        <Trash2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        Discard
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200 shadow-inner"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Your vault is empty</h3>
            <p className="text-slate-400 mt-2 font-medium">Ready to showcase something new?</p>
          </motion.div>
        )}
      </div>

      {/* SLIDE-OVER ADD PRODUCT MENU */}
      <AnimatePresence>
        {isAddMenuOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">New Product</h2>
                </div>
                <button 
                  onClick={() => setIsAddMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Body / Form */}
              <div className="p-6 overflow-y-auto flex-1">
                <form id="addProductForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {[
                    { label: "Product Name", id: "name", type: "text" },
                    { label: "Category", id: "category", type: "text" }
                  ].map((field) => (
                    <div key={field.id} className="group relative">
                      <input 
                        {...register(field.id)} 
                        placeholder=" "
                        className="w-full bg-slate-50 border-2 border-transparent ring-1 ring-slate-100 rounded-2xl px-4 py-4 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all peer"
                      />
                      <label className="absolute left-4 top-4 text-slate-400 transition-all pointer-events-none peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
                        {field.label}
                      </label>
                      {errors[field.id] && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase tracking-wide">{errors[field.id].message}</p>}
                    </div>
                  ))}

                  <div className="relative">
                    <textarea 
                      {...register("description")} 
                      rows="4" 
                      placeholder=" "
                      className="w-full bg-slate-50 border-2 border-transparent ring-1 ring-slate-100 rounded-2xl px-4 py-4 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all peer resize-none"
                    />
                    <label className="absolute left-4 top-4 text-slate-400 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:font-bold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white">
                      Description
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                       <input type="number" {...register("price", { valueAsNumber: true })} className="w-full bg-slate-50 ring-1 ring-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Price ($)"/>
                    </div>
                    <div className="relative">
                       <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full bg-slate-50 ring-1 ring-slate-100 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Stock Qty"/>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer relative text-center">
                      <input type="file" multiple {...register("images")} onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                      <ImageIcon size={36} className="mx-auto text-slate-300 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-3" />
                      <p className="text-sm font-bold text-slate-400 group-hover:text-blue-500">Drop images or click to browse</p>
                    </div>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {previewImages.map((img, i) => (
                        <motion.img 
                          key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                          src={img} className="w-16 h-16 object-cover rounded-xl ring-2 ring-slate-100 shadow-md flex-shrink-0" alt="preview" 
                        />
                      ))}
                    </div>
                  )}

                  {errorMsg && <p className="text-red-500 text-center text-xs font-bold bg-red-50 py-3 rounded-xl">{errorMsg}</p>}
                </form>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button 
                  form="addProductForm"
                  type="submit" 
                  disabled={isSubmitting} 
                  className="group relative w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-slate-300 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <span>CREATE PRODUCT</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Products;