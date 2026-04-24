const tableData = [
  { id: 1, name: 'MacBook Pro 13"', variants: "2 Variants", category: "Laptop", price: "$2399.00", status: "Delivered" },
  { id: 2, name: "Apple Watch Ultra", variants: "1 Variant", category: "Watch", price: "$879.00", status: "Pending" },
  { id: 3, name: "iPhone 15 Pro Max", variants: "2 Variants", category: "SmartPhone", price: "$1869.00", status: "Delivered" },
  { id: 4, name: "iPad Pro 3rd Gen", variants: "2 Variants", category: "Electronics", price: "$1699.00", status: "Canceled" },
  { id: 5, name: "AirPods Pro 2nd Gen", variants: "1 Variant", category: "Accessories", price: "$240.00", status: "Delivered" },
  { id: 6, name: "Mac Mini M2", variants: "1 Variant", category: "Desktop", price: "$1299.00", status: "Pending" },
  { id: 7, name: "Apple Pencil 2nd Gen", variants: "1 Variant", category: "Accessories", price: "$129.00", status: "Delivered" },
  { id: 8, name: "iPhone 14", variants: "3 Variants", category: "SmartPhone", price: "$999.00", status: "Pending" },
  { id: 9, name: "iMac 24\"", variants: "2 Variants", category: "Desktop", price: "$1899.00", status: "Delivered" },
  { id: 10, name: "AirTag Pack", variants: "1 Variant", category: "Accessories", price: "$99.00", status: "Canceled" }
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Canceled: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </h3>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/10 sm:px-4 sm:py-2">
            <svg className="stroke-current fill-white dark:fill-gray-800" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" strokeWidth="1.5" />
              <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" strokeWidth="1.5" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/10 sm:px-4 sm:py-2">
            See all
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block max-w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-gray-100 dark:border-gray-800">
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Products</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
              <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <tr key={product.id}>
                <td className="py-3">
                  <p className="font-medium text-sm text-gray-800 dark:text-white/90">{product.name}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{product.variants}</span>
                </td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{product.price}</td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 sm:hidden">
        {tableData.map((product) => (
          <div key={product.id} className="py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 dark:text-white/90 truncate">{product.name}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400">{product.variants}</span>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-400">{product.category}</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.price}</span>
              </div>
            </div>
            <span className={`mt-0.5 shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[product.status]}`}>
              {product.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}