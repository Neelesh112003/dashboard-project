import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  FileText,
  IndianRupee,
  Trash2,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Pencil,
} from "lucide-react";
import api from "../../api/axios";
import ExportTable from "../ExportTable";
import DeleteConfirmModal from "../DeleteConfirmModal";

/* =========================================================
   CONSTANTS
========================================================= */
const ITEMS_PER_PAGE = 10;

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function CashBook() {
  /* =========================================================
     STATE
  ========================================================= */

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteData, setDeleteData] = useState({
    id: null,
    title: "",
  });
  // Show / hide transaction form
  const [showForm, setShowForm] = useState(false);
  //state od editing
  // Edit mode
  const [editingId, setEditingId] = useState(null);

  // All transactions
  const [transactions, setTransactions] = useState([]);

  // Search text
  const [searchText, setSearchText] = useState("");

  // Current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Filter values
 const [filters, setFilters] = useState({
  type: "",
  fromDate: "",
  toDate: "",
});

  // Form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    particular: "",
    amount: "",
    type: "entry",
  });

  /* =========================================================
     API INTEGRATION
  ========================================================= */
  const fetchCashBook = async () => {
    try {
      const response = await api.get("/v1/cashbook/list");

      console.log("response from the server fetchCashBook", response);

      // adjust according to backend response
      setTransactions(response.data.data.data || []);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     ADD TRANSACTION
  ========================================================= */

  const addTransaction = async (transactionData) => {
    try {
      const payload = {
        date: transactionData.date,
        particular: transactionData.particular,
        amount: transactionData.amount,
        type: transactionData.type,
      };

      const response = await api.post("/v1/cashbook/create", payload);

      console.log(
        "response from the server after creating cash trasaction",
        response.data,
      );

      // reload latest data
      fetchCashBook();

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  /* =========================================================
   UPDATE TRANSACTION
========================================================= */
  const updateTransaction = async (id, transactionData) => {
    try {
      const payload = {
        date: transactionData.date,
        particular: transactionData.particular,
        amount: transactionData.amount,
        type: transactionData.type,
      };
      console.log(id);
      const response = await api.put(`/v1/cashbook/update/${id}`, payload);

      console.log("updated transaction", response.data);

      fetchCashBook();

      resetForm();

      setEditingId(null);

      setShowForm(false);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  /* =========================================================
   EDIT TRANSACTION
========================================================= */
  const editTransaction = (id, transaction) => {
    setFormData({
      date: transaction.date,
      particular: transaction.particular,
      amount: transaction.amount,
      type: transaction.type,
    });

    setEditingId(id);

    setShowForm(true);
  };
  /* =========================================================
     RESET FORM
  ========================================================= */
  const resetForm = () => {
    setFormData({
      date: "",
      particular: "",
      amount: "",
      type: "entry",
    });

    setEditingId(null);
  };

  /* =========================================================
   FORM SUBMIT
========================================================= */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.date || !formData.particular || !formData.amount) {
      alert("Please fill all fields");
      return;
    }

    // EDIT MODE
    if (editingId) {
      updateTransaction(editingId, formData);
    } else {
      addTransaction(formData);
    }
  };

  /* =========================================================
     DELETE TRANSACTION
  ========================================================= */
  const deleteTransaction = async (id) => {
    try {
      const response = await api.delete(`/v1/cashbook/delete/${id}`);
      console.log("cash transaction deleted with id ", id, response);
      fetchCashBook();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  /* =========================================================
     IMPORT CSV
  ========================================================= */
  const handleImport = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const csvText = e.target.result;

      // Convert CSV into rows
      const rows = csvText.split("\n").map((row) => row.split(","));

      // First row = headers
      const headers = rows[0];

      // Remaining rows = data
      const importedTransactions = rows.slice(1).map((row) => {
        const transaction = {};

        headers.forEach((header, index) => {
          transaction[header.trim()] = row[index]?.trim();
        });

        return {
          ...transaction,
          id: Date.now() + Math.random(),
        };
      });

      setTransactions((prev) => [...importedTransactions, ...prev]);
    };

    reader.readAsText(file);
  };

  /* =========================================================
     FILTER TRANSACTIONS
  ========================================================= */
const filteredTransactions = transactions
  .filter((transaction) => {
    // TYPE FILTER
    if (filters.type && transaction.type !== filters.type) {
      return false;
    }

    // FROM DATE FILTER
    if (
      filters.fromDate &&
      new Date(transaction.date) < new Date(filters.fromDate)
    ) {
      return false;
    }

    // TO DATE FILTER
    if (
      filters.toDate &&
      new Date(transaction.date) > new Date(filters.toDate)
    ) {
      return false;
    }

    return true;
  })

  // SEARCH FILTER
  .filter((transaction) => {
    if (!searchText) return true;

    return Object.values(transaction).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase()),
    );
  });

  /* =========================================================
     PAGINATION
  ========================================================= */
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* =========================================================
     GET UNIQUE VALUES FOR FILTERS
  ========================================================= */
  const getUniqueValues = (key) => {
    return [...new Set(transactions.map((item) => item[key]).filter(Boolean))];
  };
  useEffect(() => {
    fetchCashBook();
  }, []);

  /* =========================================================
     UI
  ========================================================= */
  return (
    <>
      {/* =====================================================
          TOP BUTTON
      ====================================================== */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      <div className="space-y-8">
        {/* =====================================================
            FORM SECTION
        ====================================================== */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
            {/* HEADER */}
            <div
              className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{
                backgroundColor: "#3a3c44",
              }}
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cash Transaction
                  </h2>

                  <p className="text-xs text-white/60">Add cash entry</p>
                </div>
              </div>

              {/* IMPORT BUTTON */}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white hover:bg-white/10">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {/* DATE */}
                <InputField
                  label="Date"
                  icon={
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.showPicker()}
                    className={inputClass}
                  />
                </InputField>

                {/* PARTICULAR */}
                <InputField
                  label="Particular"
                  icon={
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="particular"
                    placeholder="Details"
                    value={formData.particular}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* AMOUNT */}
                <InputField
                  label="Amount"
                  icon={
                    <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="number"
                    name="amount"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* TYPE */}
                <InputField
                  label="Type"
                  icon={
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="entry">entry</option>

                    <option value="drawings">drawings</option>
                  </select>
                </InputField>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="px-6 pb-6">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3c9437]"
                >
                  {editingId ? (
                    <>
                      <Pencil className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* =====================================================
            TABLE SECTION
        ====================================================== */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          {/* HEADER */}
          <div
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{
              backgroundColor: "#3a3c44",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Boxes className="h-5 w-5 text-white" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Cash Book
                  </h2>

                  <p className="text-xs text-white/60">
                    {filteredTransactions.length} items
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                {/* SEARCH */}
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);

                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
                />

                {/* EXPORT */}
                <ExportTable
                  title="Cash Book"
                  columns={[
                    {
                      label: "Date",
                      key: "date",
                    },
                    {
                      label: "Particular",
                      key: "particular",
                    },
                    {
                      label: "Amount",
                      key: "amount",
                    },
                    {
                      label: "Type",
                      key: "type",
                    },
                  ]}
                  data={filteredTransactions}
                />
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>
{/* FROM DATE */}
<div className="flex items-center gap-2">
  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
    From
  </label>

  <input
    type="date"
    value={filters.fromDate}
    onChange={(e) => {
      setFilters({
        ...filters,
        fromDate: e.target.value,
      });

      setCurrentPage(1);
    }}
    onClick={(e) => e.target.showPicker()}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
  />
</div>

{/* TO DATE */}
<div className="flex items-center gap-2">
  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
    To
  </label>

  <input
    type="date"
    value={filters.toDate}
    onChange={(e) => {
      setFilters({
        ...filters,
        toDate: e.target.value,
      });

      setCurrentPage(1);
    }}
    onClick={(e) => e.target.showPicker()}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
  />
</div>
            <select
              value={filters.type}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  type: e.target.value,
                });

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All type</option>

              {getUniqueValues("type").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* TABLE HEADER */}
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["Date", "Particular", "Amount", "Type", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {/* NO DATA */}
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.sn}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-6 py-4">{transaction.date}</td>

                      <td className="px-6 py-4">{transaction.particular}</td>

                      <td className="px-6 py-4">{transaction.amount}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${
                            transaction.type === "entry"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                              : "border-rose-200 bg-rose-50 text-rose-600"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* EDIT */}
                          <button
                            onClick={() =>
                              editTransaction(transaction.sn, transaction)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => {
                              setDeleteData({
                                id: transaction.tr_no,
                                title: `${transaction.date} - ${transaction.particular}`,
                              });

                              setShowDeleteModal(true);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
              {/* PREVIOUS */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft />
              </button>

              {/* PAGE INFO */}
              <span>
                {currentPage} / {totalPages}
              </span>

              {/* NEXT */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title={deleteData.title}
        onClose={() => {
          setShowDeleteModal(false);

          setDeleteData({
            id: null,
            title: "",
          });
        }}
        onConfirm={async () => {
          await deleteTransaction(deleteData.id);

          setShowDeleteModal(false);

          setDeleteData({
            id: null,
            title: "",
          });
        }}
      />
    </>
  );
}

/* =========================================================
   REUSABLE INPUT FIELD COMPONENT
========================================================= */
function InputField({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <div className="relative">
        {icon}
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   COMMON INPUT CLASS
========================================================= */
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]";
