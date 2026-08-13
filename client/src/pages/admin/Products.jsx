import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Package,
  Boxes,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import { getProductImageSrc } from "../../utils/productImages";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [stockFilter, setStockFilter] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, category, stockFilter, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const list =
        (res.data && res.data.products) ||
        (Array.isArray(res.data) ? res.data : []) ||
        [];

      setProducts(list);
      setFilteredProducts(list);

      if (list.length === 0) {
        toast("No products found in catalog.", {
          icon: "📦",
          duration: 4000,
        });
      }
    } catch (err) {
      console.log(err);
      const status = err?.response?.status;
      if (status === 401) {
        toast.error("Login session expired. Please sign in again to manage products.");
      } else {
        toast.error(
          "Unable to load products. Verify Dailyfix API server is running on port 5000.",
          { duration: 5000 }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let data = [...products];

    if (search) {
      data = data.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.brand
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter(
        (item) => item.category === category
      );
    }

    if (stockFilter === "In Stock") {
      data = data.filter((item) => item.stock > 0);
    }

    if (stockFilter === "Out of Stock") {
      data = data.filter((item) => item.stock <= 0);
    }

    setFilteredProducts(data);
  };

  const totalProducts = products.length;

  const totalStock = useMemo(() => {
    return products.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0
    );
  }, [products]);

  const outOfStock = products.filter(
    (item) => item.stock <= 0
  ).length;

  const inventoryValue = useMemo(() => {
    return products.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.stock || 0),
      0
    );
  }, [products]);

  const categories = [
    "All",
    ...new Set(
      products
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your inventory
          </p>

        </div>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-3 flex items-center gap-2 shadow-lg">

          <Plus size={18} />

          Add Product

        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Products
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalProducts}
              </h2>

            </div>

            <Package className="text-emerald-600" />

          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Total Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalStock}
              </h2>

            </div>

            <Boxes className="text-blue-600" />

          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Out of Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {outOfStock}
              </h2>

            </div>

            <AlertTriangle className="text-red-600" />

          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <div className="flex justify-between">

            <div>

              <p className="text-slate-500">
                Inventory Value
              </p>

              <h2 className="text-3xl font-bold mt-2">
                ₹{inventoryValue.toLocaleString()}
              </h2>

            </div>

            <IndianRupee className="text-orange-600" />

          </div>
        </motion.div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl border shadow-sm p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border outline-none focus:border-emerald-500"
            />

          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="border rounded-xl px-4"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value)
            }
            className="border rounded-xl px-4"
          >
            <option>All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>

        </div>

      </div>
            {/* Products Table */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Stock
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                [...Array(6)].map((_, i) => (

                  <tr key={i} className="border-b">

                    <td colSpan={6} className="p-5">

                      <div className="h-14 rounded-lg bg-slate-100 animate-pulse" />

                    </td>

                  </tr>

                ))

              ) : filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-16 text-center text-slate-500"
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map((product) => (

                  <motion.tr
                    key={product._id}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className="border-b"
                  >

                    {/* Product */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-4">

                        <img
                          src={getProductImageSrc(product)}
                          alt={product.name}
                          className="w-14 h-14 rounded-xl object-cover border"
                        />

                        <div>

                          <h3 className="font-semibold">
                            {product.name}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {product.brand}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}

                    <td className="px-6 py-4">
                      {product.category || "-"}
                    </td>

                    {/* Price */}

                    <td className="px-6 py-4 font-semibold">
                      ₹
                      {product.discount_price ||
                        product.price}
                    </td>

                    {/* Stock */}

                    <td className="px-6 py-4">
                      {product.stock}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition">
                          👁
                        </button>

                        <button className="px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition">
                          ✏
                        </button>

                        <button className="px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition">
                          🗑
                        </button>

                      </div>

                    </td>

                  </motion.tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Footer */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-sm text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 rounded-lg border hover:bg-slate-100">
            Previous
          </button>

          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white">
            1
          </button>

          <button className="px-4 py-2 rounded-lg border hover:bg-slate-100">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}