import { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Package,
  IndianRupee,
} from "lucide-react";
import ProductViewModal from "./ProductViewModal";

export default function ProductPreview({
  products,
  onDelete,
}) {
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* Header */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Package className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Product List
              </h2>
              <p className="text-xs text-white/60">
                {products.length} Product
                {products.length !== 1 ? "s" : ""} Available
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {[
                  "Product",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-[#44a83e] dark:bg-green-900/20 dark:text-green-400">
                        <Package className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      $ {product.price.toLocaleString()}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {product.stock} Units
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          product.stock > 0
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setSelectedProduct(product)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>

                      <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/20">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDelete(product.id)
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductViewModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}