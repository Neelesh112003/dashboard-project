import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ExportTable from "../ExportTable";
import api from "../../api/axios";
import {
  Plus,
  Calendar,
  FileText,
  IndianRupee,
  Building2,
  Trash2,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Pencil,
} from "lucide-react";
import DeleteConfirmModal from "../DeleteConfirmModal";
// How many rows to show per page
const ROWS_PER_PAGE = 10;

export default function BankBook() {
  // Date filters
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteData, setDeleteData] = useState({
    id: null,
    title: "",
  });
  // Is the "Add Transaction" form open or closed?
  const [showForm, setShowForm] = useState(false);
  // Which transaction is being edited
  const [editingId, setEditingId] = useState(null);
  // All saved transactions
  const [transactionList, setTransactionList] = useState([]);

  //loading and error state

  // List of available banks
  const [bankOptions, setBankOptions] = useState([]);

  // What the user is typing in the form right now
  const [formValues, setFormValues] = useState({
    date: "",
    particular: "",
    amount: "",
    bank_id: bankOptions[0]?.bank_id || "",
    bank_name: bankOptions[0]?.bank_name || "",
    type: "entry",
  });

  // Which bank is selected in the filter dropdown
  const [filterBank, setFilterBank] = useState("");

  // Which type is selected in the filter dropdown
  const [filterType, setFilterType] = useState("");

  // Text the user types in the search box
  const [searchText, setSearchText] = useState("");

  // Which page the user is on (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Read the "?bank=SBI" value from the URL (if any)
  // This lets other pages link directly to a specific bank's transactions
  const [searchParams, setSearchParams] = useSearchParams();
  const bankFromUrl = searchParams.get("bank");

  // ── FORM HANDLERS ──────────────────────────────────────────────────────────
  /* =========================================================
   UPDATE TRANSACTION
========================================================= */
  async function updateTransaction(id) {
    try {
      const response = await api.put(`/v1/bankbook/update/${id}`, formValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("updated transaction", response.data);

      await fetchBankBook();

      setShowForm(false);

      setEditingId(null);

      setFormValues({
        date: "",
        particular: "",
        amount: "",
        bank_id: bankOptions[0]?.bank_id || "",
        bank_name: bankOptions[0]?.bank_name || "",
        type: "entry",
      });
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to update transaction");
    }
  }
  /* =========================================================
   EDIT TRANSACTION
========================================================= */
  function handleEdit(row) {
    setFormValues({
      date: row.date,
      particular: row.particular,
      amount: row.amount,
      bank_id: row.bank_id,
      bank_name: row.bank_name,
      type: row.type,
    });

    setEditingId(row.tr_no);

    setShowForm(true);
  }
  //fetching banks name from the backend
  const fetchBanks = async () => {
    try {
      const response = await api.get("/v1/banks/list");
      //
      console.log("banks data fetchBanks", response.data);

      setBankOptions(response.data.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  //calling api and handling response and errors

  async function fetchBankBook() {
    try {
      const response = await api.get("/v1/bankbook/list");
      console.log("response from the server fetchBankBook ", response.data);
      // assuming backend sends:
      // { data: [...] }

      setTransactionList(response.data.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  // When the user types in any input, update the matching field in formValues
  function handleFormChange(e) {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // When the user clicks "Create", add the new transaction to the list
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formValues.date || !formValues.particular || !formValues.amount) {
      alert("Please fill all fields");
      return;
    }

    // EDIT MODE
    if (editingId) {
      await updateTransaction(editingId);
      return;
    }

    // CREATE MODE
    try {
      const response = await api.post("/v1/bankbook/create", formValues, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("data sent to server", response);

      await fetchBankBook();

      setShowForm(false);

      setFormValues({
        date: "",
        particular: "",
        amount: "",
        bank_id: bankOptions[0]?.bank_id || "",
        bank_name: bankOptions[0]?.bank_name || "",
        type: "entry",
      });
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to create transaction");
    }
  }

  // When the user clicks "Delete", remove that transaction from the list
  async function handleDelete(id) {
    try {
      const response = await api.delete(`/v1/bankbook/delete/${id}`);
      console.log(`row deleted with id : ${id}`);
      console.log(response);
      await fetchBankBook();
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  }

  // ── CSV IMPORT ─────────────────────────────────────────────────────────────

  // When the user uploads a CSV file, read it and add all rows to the list
  function handleImport(e) {
    const file = e.target.files[0];

    if (!file) return; // do nothing if no file was picked

    const reader = new FileReader();

    // This runs after the file is read
    reader.onload = (event) => {
      const csvText = event.target.result;

      // Split the CSV into rows, then split each row by comma
      const allRows = csvText.split("\n").map((row) => row.split(","));

      // The first row is the headers (column names)
      const headers = allRows[0];

      // Every row after the first is a data row
      const dataRows = allRows.slice(1);

      // Turn each data row into an object using the headers as keys
      const importedTransactions = dataRows.map((row) => {
        const transaction = {};

        headers.forEach((header, index) => {
          transaction[header.trim()] = row[index]?.trim();
        });

        // Give each imported row a unique id
        transaction.id = Date.now() + Math.random();

        return transaction;
      });

      // Add all imported rows to the top of the list
      setTransactionList((prev) => [...importedTransactions, ...prev]);
    };

    reader.readAsText(file);
  }

// ── FILTERING & SEARCHING ──────────────────────────────────────────────────

// Start with full list
let visibleTransactions = transactionList;

// Filter by bank
if (filterBank !== "") {
  visibleTransactions = visibleTransactions.filter(
    (t) => t.bank_name === filterBank,
  );
}

// Filter by type
if (filterType !== "") {
  visibleTransactions = visibleTransactions.filter(
    (t) => t.type === filterType,
  );
}

// Filter by FROM date
if (fromDate !== "") {
  visibleTransactions = visibleTransactions.filter(
    (t) => new Date(t.date) >= new Date(fromDate),
  );
}

// Filter by TO date
if (toDate !== "") {
  visibleTransactions = visibleTransactions.filter(
    (t) => new Date(t.date) <= new Date(toDate),
  );
}

// Search filter
if (searchText !== "") {
  visibleTransactions = visibleTransactions.filter((t) => {
    return Object.values(t).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase()),
    );
  });
}

  // ── PAGINATION ─────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(visibleTransactions.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;

  const rowsOnThisPage = visibleTransactions.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  // Get all unique values for a field (used to build filter dropdowns)
  function getUniqueValues(fieldName) {
    return [
      ...new Set(transactionList.map((t) => t[fieldName]).filter(Boolean)),
    ];
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  //caling the api function to retrieve data
  useEffect(() => {
    fetchBankBook();
    fetchBanks();
  }, []);

  useEffect(() => {
    if (bankFromUrl) {
      setFilterBank(bankFromUrl);
    }
  }, [bankFromUrl]);

  return (
    <>
      {/* Add Transaction button */}
      <div className="mb-5 flex gap-3">
        <button
          onClick={() => {
            setShowForm(true);

            setFormValues((prev) => ({
              ...prev,
              date: new Date().toISOString().split("T")[0],
              bank_id: bankOptions[0]?.bank_id || "",
              bank_name: bankOptions[0]?.bank_name || "",
            }));
          }}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Bank Transaction
        </button>
      </div>

      <div className="space-y-8">
        {/* ── ADD TRANSACTION FORM (only shown when showForm is true) ── */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
            {/* Form header */}
            <div
              className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
              style={{ backgroundColor: "#3a3c44" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Bank Transaction
                  </h2>
                  <p className="text-xs text-white/60">Add bank entry</p>
                </div>
              </div>

              {/* CSV Import button — clicking it opens a hidden file input */}
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

            {/* Form fields */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      value={formValues.date}
                      onChange={handleFormChange}
                      onClick={(e) => e.target.showPicker()}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Particular (description of the transaction) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Particular
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="particular"
                      value={formValues.particular}
                      onChange={handleFormChange}
                      placeholder="Details"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="amount"
                      value={formValues.amount}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    />
                  </div>
                </div>

                {/* Bank */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Bank
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="bank_id"
                      value={formValues.bank_id}
                      onChange={(e) => {
                        const selectedBank = bankOptions.find(
                          (bank) => bank.bank_id === Number(e.target.value),
                        );

                        setFormValues((prev) => ({
                          ...prev,
                          bank_id: selectedBank.bank_id,
                          bank_name: selectedBank.bank_name,
                        }));
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      {bankOptions.map((bank) => (
                        <option key={bank.bank_id} value={bank.bank_id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Type
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="type"
                      value={formValues.type}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#44a83e] dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      <option value="entry">entry</option>
                      <option value="drawings">drawings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit button */}
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

        {/* ── TRANSACTIONS TABLE ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          {/* Table header */}
          <div
            className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
            style={{ backgroundColor: "#3a3c44" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Boxes className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Bank Book
                  </h2>
                  <p className="text-xs text-white/60">
                    {visibleTransactions.length} items
                  </p>
                </div>
              </div>

              {/* Search box + Export button */}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1); // reset to page 1 on new search
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
                />

                <ExportTable
                  title="Bank Book"
                  columns={[
                    { label: "Date", key: "date" },
                    { label: "Particular", key: "particular" },
                    { label: "Amount", key: "amount" },
                    { label: "Bank", key: "bank_name" },
                    { label: "Type", key: "type" },
                  ]}
                  data={visibleTransactions}
                />
              </div>
            </div>
          </div>

          {/* Filter bar — two separate dropdowns instead of a loop */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </div>
{/* From Date */}
<div className="flex items-center gap-2">
  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
    From
  </label>

  <input
    type="date"
    value={fromDate}
    onChange={(e) => {
      setFromDate(e.target.value);
      setCurrentPage(1);
    }}
    onClick={(e) => e.target.showPicker()}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
  />
</div>

{/* To Date */}
<div className="flex items-center gap-2">
  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
    To
  </label>

  <input
    type="date"
    value={toDate}
    onChange={(e) => {
      setToDate(e.target.value);
      setCurrentPage(1);
    }}
    onClick={(e) => e.target.showPicker()}
    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
  />
</div>
            {/* Filter by bank */}
            <select
              value={filterBank}
              onChange={(e) => {
                const value = e.target.value;

                setFilterBank(value);

                if (value) {
                  setSearchParams({ bank: value });
                } else {
                  setSearchParams({});
                }

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All bank</option>
              {getUniqueValues("bank_name").map((bank) => (
                <option key={bank}>{bank}</option>
              ))}
            </select>

            {/* Filter by type */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1); // reset to page 1 when filter changes
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All type</option>
              {getUniqueValues("type").map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "Date",
                    "Particular",
                    "Amount",
                    "Bank",
                    "Type",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {/* If no rows match, show an empty state message */}
                {rowsOnThisPage.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  // Otherwise render one row per transaction
                  rowsOnThisPage.map((row) => (
                    <tr
                      key={row.sn}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-6 py-4">{row.date}</td>
                      <td className="px-6 py-4">{row.particular}</td>
                      <td className="px-6 py-4">{row.amount}</td>
                      <td className="px-6 py-4">{row.bank_name}</td>
                <td className="px-6 py-4">
  <span
    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${
      row.type === "entry"
        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
        : "border-rose-200 bg-rose-50 text-rose-600"
    }`}
  >
    {row.type}
  </span>
</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* EDIT */}
                          <button
                            onClick={() => handleEdit(row)}
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => {
                              setDeleteData({
                                id: row.tr_no,
                                title: `${row.date} - ${row.particular}`,
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

          {/* Pagination (only shown when there is more than one page) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                <ChevronLeft />
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
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
          await handleDelete(deleteData.id);

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
