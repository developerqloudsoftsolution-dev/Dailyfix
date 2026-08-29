import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  IndianRupee,
  Eye,
  Pencil,
  Trash2,
  X,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Truck,
  Layers,
  Sparkles,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productAPI } from "../../services/api";
import toast from "react-hot-toast";
import { getProductImageSrc } from "../../utils/productImages";
import Modal from "../../components/Modal";

const initialProductForm = {
  name: "",
  brand: "DailyFix",
  category: "Beard Care",
  price: "",
  stock: "50",
  sku: "",
  image: "",
  description: "",
  weight: "500",
  length: "15",
  width: "10",
  height: "5",
  isActive: true,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState(initialProductForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, AVIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be under 10MB");
      return;
    }

    try {
      setUploadingImage(true);
      toast.loading("Uploading image to server...", { id: "img-upload" });
      const res = await productAPI.uploadProductImage(file);
      if (res.ok && res.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
        toast.success("Image uploaded successfully! 🖼️", { id: "img-upload" });
      } else {
        toast.error(res.data?.message || "Failed to upload image", { id: "img-upload" });
      }
    } catch (err) {
      toast.error("Error uploading image file", { id: "img-upload" });
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, category, stockFilter, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAllProducts({ includeInactive: true });
      if (res.ok) {
        const list = res.data?.products || (Array.isArray(res.data) ? res.data : []) || [];
        setProducts(list);
        setFilteredProducts(list);
      } else {
        toast.error(res.data?.message || "Failed to load products");
      }
    } catch (err) {
      toast.error("Unable to load products. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let data = [...products];

    if (search) {
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.brand?.toLowerCase().includes(search.toLowerCase()) ||
          item.sku?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter((item) => item.category === category);
    }

    if (stockFilter === "In Stock") {
      data = data.filter((item) => Number(item.stock) > 0);
    }

    if (stockFilter === "Out of Stock") {
      data = data.filter((item) => Number(item.stock) <= 0);
    }

    setFilteredProducts(data);
  };

  // Open Handlers
  const handleOpenAdd = () => {
    setFormData(initialProductForm);
    setShowAddModal(true);
  };

  const handleOpenView = (product) => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };

  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "DailyFix",
      category: product.category || "Beard Care",
      price: product.price || "",
      stock: product.stock !== undefined ? String(product.stock) : "0",
      sku: product.sku || "",
      image: product.image || "",
      description: product.description || "",
      weight: product.weight ? String(product.weight) : "500",
      length: product.length ? String(product.length) : "15",
      width: product.width ? String(product.width) : "10",
      height: product.height ? String(product.height) : "5",
      isActive: product.isActive !== false,
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Submit Handlers
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast.error("Please provide product name and price");
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Creating product...", { id: "product-save" });
      const res = await productAPI.createProduct(formData);
      if (res.ok) {
        toast.success("Product created successfully! 🚀", { id: "product-save" });
        setShowAddModal(false);
        fetchProducts();
      } else {
        toast.error(res.data?.message || "Failed to create product", { id: "product-save" });
      }
    } catch (err) {
      toast.error("Error creating product", { id: "product-save" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
    if (!formData.name.trim() || !formData.price) {
      toast.error("Please provide product name and price");
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Updating product...", { id: "product-save" });
      const res = await productAPI.updateProduct(currentProduct._id || currentProduct.id, formData);
      if (res.ok) {
        toast.success("Product updated successfully!", { id: "product-save" });
        setShowEditModal(false);
        fetchProducts();
      } else {
        toast.error(res.data?.message || "Failed to update product", { id: "product-save" });
      }
    } catch (err) {
      toast.error("Error updating product", { id: "product-save" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    try {
      setSubmitting(true);
      toast.loading("Deleting product...", { id: "product-del" });
      const res = await productAPI.deleteProduct(currentProduct._id || currentProduct.id);
      if (res.ok) {
        toast.success("Product removed from catalog", { id: "product-del" });
        setShowDeleteModal(false);
        fetchProducts();
      } else {
        toast.error(res.data?.message || "Failed to delete product", { id: "product-del" });
      }
    } catch (err) {
      toast.error("Error deleting product", { id: "product-del" });
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const totalProducts = products.length;
  const totalStock = useMemo(() => {
    return products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  }, [products]);

  const outOfStock = products.filter((item) => Number(item.stock) <= 0).length;

  const inventoryValue = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.stock || 0),
      0
    );
  }, [products]);

  const categories = [
    "All",
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Package className="text-emerald-600" size={32} />
            Products
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage your catalog, stock levels, and shipping package dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition text-sm font-medium"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-md shadow-emerald-600/20 text-sm font-semibold transition"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Products</p>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">{totalProducts}</h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package size={22} />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Stock Units</p>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">{totalStock}</h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes size={22} />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Out of Stock</p>
              <h2 className="text-3xl font-bold mt-2 text-rose-600">{outOfStock}</h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inventory Value</p>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">₹{inventoryValue.toLocaleString()}</h2>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee size={22} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, brand, SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 transition"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 bg-white"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                Category: {item}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500 bg-white"
          >
            <option value="All">Stock: All</option>
            <option value="In Stock">In Stock ({">"} 0)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Product</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Shipping Weight</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="p-5">
                      <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Package size={40} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No products found</p>
                    <p className="text-xs mt-1">Try adjusting your search or click "+ Add Product"</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id || product.id}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className="transition"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={getProductImageSrc(product)}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>{product.brand || "DailyFix"}</span>
                            {product.sku && (
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                                SKU: {product.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {product.category || "Beard Care"}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      ₹{product.price}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 font-semibold text-xs text-slate-700">
                      {product.stock} units
                    </td>

                    {/* Shipping Weight */}
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <span className="font-mono">{product.weight || 500}g</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {product.length || 15}x{product.width || 10}x{product.height || 5} cm
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          Number(product.stock) > 0
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            Number(product.stock) > 0 ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {Number(product.stock) > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(product)}
                          title="View Product Details"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(product)}
                          title="Edit Product"
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(product)}
                          title="Delete Product"
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD PRODUCT                                     */}
      {/* ======================================================== */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        maxWidth="max-w-2xl"
      >
        <div className="p-6 space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Add New Product</h3>
                <p className="text-xs text-slate-400">Add a new item to your store catalog</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DailyFix Natural Black Beard Colour"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Price, Stock & SKU */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">SKU / Code</label>
                    <input
                      type="text"
                      placeholder="e.g. DFX-BLK-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Image Upload or URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">Product Image</label>
                    <button
                      type="button"
                      onClick={() => setUseUrlMode(!useUrlMode)}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                    >
                      {useUrlMode ? "← Upload image file instead" : "Or enter direct Image URL →"}
                    </button>
                  </div>

                  {useUrlMode ? (
                    <input
                      type="text"
                      placeholder="e.g. https://... or /assets/001 Natural black1.png"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition">
                      {formData.image ? (
                        <div className="relative group flex-shrink-0">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition"
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-200/60 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <ImageIcon size={26} />
                        </div>
                      )}

                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition">
                          <Upload size={14} className={uploadingImage ? "animate-bounce text-emerald-600" : "text-emerald-600"} />
                          {uploadingImage ? "Uploading to Server..." : formData.image ? "Change Image File" : "Choose Image from Computer"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-slate-400">
                          PNG, JPG, WEBP, AVIF (Max 10MB). Automatically saved to hostinger uploads.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Specs */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck size={14} className="text-emerald-600" /> Shipping Dimensions & Weight
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500 block">Weight (grams)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Length (cm)</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Width (cm)</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Product details, shade specifications, benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 2: EDIT PRODUCT                                    */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(showEditModal && currentProduct)}
        onClose={() => setShowEditModal(false)}
        maxWidth="max-w-2xl"
      >
        {currentProduct && (
          <div className="p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Edit Product</h3>
                  <p className="text-xs text-slate-400">Modify product pricing, details & stock</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* Price, Stock & SKU */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Image Upload or URL */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">Product Image</label>
                    <button
                      type="button"
                      onClick={() => setUseUrlMode(!useUrlMode)}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                    >
                      {useUrlMode ? "← Upload image file instead" : "Or enter direct Image URL →"}
                    </button>
                  </div>

                  {useUrlMode ? (
                    <input
                      type="text"
                      placeholder="e.g. https://... or /assets/001 Natural black1.png"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/70 hover:bg-slate-50 transition">
                      {formData.image ? (
                        <div className="relative group flex-shrink-0">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: "" })}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition"
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-200/60 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <ImageIcon size={26} />
                        </div>
                      )}

                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition">
                          <Upload size={14} className={uploadingImage ? "animate-bounce text-emerald-600" : "text-emerald-600"} />
                          {uploadingImage ? "Uploading to Server..." : formData.image ? "Change Image File" : "Choose Image from Computer"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-slate-400">
                          PNG, JPG, WEBP, AVIF (Max 10MB). Automatically saved to hostinger uploads.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Specs */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck size={14} className="text-emerald-600" /> Shipping Dimensions & Weight
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500 block">Weight (grams)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Length (cm)</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Width (cm)</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/20 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Update Product"}
                  </button>
                </div>
              </form>
            </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 3: VIEW PRODUCT DETAILS                            */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(showViewModal && currentProduct)}
        onClose={() => setShowViewModal(false)}
        maxWidth="max-w-lg"
      >
        {currentProduct && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Product Overview</h3>
                  <p className="text-xs text-slate-400">ID: {currentProduct._id || currentProduct.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-4 items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={getProductImageSrc(currentProduct)}
                  alt={currentProduct.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white"
                />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {currentProduct.category || "Beard Care"}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{currentProduct.name}</h4>
                  <p className="text-xs font-bold text-slate-800">
                    ₹{currentProduct.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Stock Available</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {currentProduct.stock} units
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">SKU Code</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                    {currentProduct.sku || "N/A"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Shipping Weight</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                    {currentProduct.weight || 500} grams
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Package Box Size</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                    {currentProduct.length || 15}x{currentProduct.width || 10}x{currentProduct.height || 5} cm
                  </span>
                </div>
              </div>

              {currentProduct.description && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-bold mb-1">Description</span>
                  <p className="text-slate-600 leading-relaxed">{currentProduct.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleOpenEdit(currentProduct);
                }}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs"
              >
                Edit Product
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ======================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION                             */}
      {/* ======================================================== */}
      <Modal
        isOpen={Boolean(showDeleteModal && currentProduct)}
        onClose={() => setShowDeleteModal(false)}
        maxWidth="max-w-md"
      >
        {currentProduct && (
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Delete Product?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <strong className="text-slate-800">"{currentProduct.name}"</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}