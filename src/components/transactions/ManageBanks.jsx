import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";

import {
  Plus,
  Building2,
  Hash,
  CreditCard,
  Eye,
  Trash2,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Pencil,
} from "lucide-react";
import ExportTable from "../ExportTable";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { useToast } from "../../context/ToastContext";

/* =========================================================
   CONSTANTS
========================================================= */
const ITEMS_PER_PAGE = 10;

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function ManageBanks() {
  //toast message instance created
  const { showToast } = useToast();
  /* =========================================================
     NAVIGATION
  ========================================================= */
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  // Show / hide form
  const [showForm, setShowForm] = useState(false);

  // Which bank is being edited
  const [editingId, setEditingId] = useState(null);
  // Store all bank records
  const [banks, setBanks] = useState([]);

  // Search input
  const [searchText, setSearchText] = useState("");

  // Current page
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    accountType: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    ifsc: "",
    accountType: "Savings",
    accountNumber: "",
    branch: "",
    branchAddress: "",
  });
  /* =========================================================
     API INTEGRATION
  ========================================================= */

  const fetchBanks = async () => {
    try {
      const response = await api.get("/v1/banks/list");
      showToast(response.data.error_msg);
      console.log("response from the server fetchBanks", response.data);

      setBanks(response.data.data.data || []);
    } catch (error) {
      console.error(error);
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
     RESET FORM
  ========================================================= */
  const resetForm = () => {
    setFormData({
      name: "",
      ifsc: "",
      accountType: "Savings",
      accountNumber: "",
      branch: "",
      branchAddress: "",
    });

    setEditingId(null);
  };

  /* =========================================================
   UPDATE BANK
========================================================= */
  const updateBank = async (id, bankData) => {
    try {
      const payload = {
        bank_name: bankData.name,

        ifsc_code: bankData.ifsc,

        account_type: bankData.accountType,

        account_number: bankData.accountNumber,

        branch: bankData.branch,

        branch_address: bankData.branchAddress,
      };

      console.log("updated data sent to server");
      console.log(payload);

      const response = await api.put(`/v1/banks/update/${id}`, payload);
      showToast(response.data.error_msg);
      console.log("update banks response", response);

      fetchBanks();

      setShowForm(false);

      setEditingId(null);

      resetForm();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  /* =========================================================
   EDIT BANK
========================================================= */
  const editBank = (bank) => {
    setFormData({
      name: bank.bank_name,
      ifsc: bank.ifsc_code,
      accountType: bank.account_type,
      accountNumber: bank.account_number,
      branch: bank.branch,
      branchAddress: bank.branch_address,
    });

    setEditingId(bank.bank_id);

    setShowForm(true);
  };
  /* =========================================================
     ADD BANK
  ========================================================= */
  const addBank = async (bankData) => {
    try {
      const payload = {
        bank_name: bankData.name,

        ifsc_code: bankData.ifsc,

        account_type: bankData.accountType,

        account_number: bankData.accountNumber,

        branch: bankData.branch,

        branch_address: bankData.branchAddress,
      };

      console.log("data sent to server");
      console.log(payload);
      const response = await api.post("/v1/banks/create", payload);
      showToast(response.data.error_msg);
      console.log(response);

      fetchBanks();

      setShowForm(false);

      resetForm();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  /* =========================================================
     FORM SUBMIT
  ========================================================= */
  /* =========================================================
   FORM SUBMIT
========================================================= */
  const handleSubmit = (event) => {
    event.preventDefault();

    // EDIT MODE
    if (editingId) {
      updateBank(editingId, formData);
    } else {
      addBank(formData);
    }
  };

  /* =========================================================
     DELETE BANK
  ========================================================= */
  const deleteBank = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/v1/banks/delete/${id}`);
      showToast(response.data.error_msg);
      console.log("deleted bank with id ", id, response);
      fetchBanks();
    } catch (error) {
      console.error(error);
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

      // Convert CSV text into rows
      const rows = csvText.split("\n").map((row) => row.split(","));

      // First row = headers
      const headers = rows[0];

      // Remaining rows = bank data
      const importedBanks = rows.slice(1).map((row) => {
        const bank = {};

        headers.forEach((header, index) => {
          bank[header.trim()] = row[index]?.trim();
        });

        return {
          ...bank,
          id: Date.now() + Math.random(),
        };
      });

      setBanks((prev) => [...importedBanks, ...prev]);
    };

    reader.readAsText(file);
  };

  /* =========================================================
     FILTER BANKS
  ========================================================= */
  const filteredBanks = banks
    .filter((bank) => {
      // Filter by account type
      if (filters.accountType && bank.account_type !== filters.accountType) {
        return false;
      }

      return true;
    })
    .filter((bank) => {
      // Search filter
      if (!searchText) return true;

      return Object.values(bank).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      );
    });

  /* =========================================================
     PAGINATION
  ========================================================= */
  const totalPages = Math.ceil(filteredBanks.length / ITEMS_PER_PAGE);

  const paginatedBanks = filteredBanks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* =========================================================
     UNIQUE VALUES FOR FILTERS
  ========================================================= */
  const getUniqueValues = (key) => {
    return [...new Set(banks.map((item) => item[key]).filter(Boolean))];
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  /* =========================================================
     UI
  ========================================================= */
  return (
    <>
      {/* =====================================================
          TOP BUTTON
      ====================================================== */}
      <div className="mb-5 flex gap-3 dark:text-white">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Bank
        </button>
      </div>

      <div className="space-y-8 dark:text-white">
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
                  <h2 className="text-lg font-semibold text-white">Add Bank</h2>

                  <p className="text-xs text-white/60">
                    Manage your bank accounts
                  </p>
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
                {/* BANK NAME */}
                <InputField
                  label="Bank Name"
                  icon={
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* IFSC CODE */}
                <InputField
                  label="IFSC Code"
                  icon={
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>

                {/* ACCOUNT TYPE */}
                <InputField
                  label="Account Type"
                  icon={
                    <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="Savings">Savings</option>

                    <option value="Current">Current</option>
                  </select>
                </InputField>

                {/* ACCOUNT NUMBER */}
                <InputField
                  label="Account Number"
                  icon={
                    <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>
                {/*branch name */}
                <InputField
                  label="Branch"
                  icon={
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputField>
                {/*branch address */}
                <InputField
                  label="Branch Address"
                  icon={
                    <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  }
                >
                  <input
                    type="text"
                    name="branchAddress"
                    value={formData.branchAddress}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
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
                    Manage Banks
                  </h2>

                  <p className="text-xs text-white/60">
                    {filteredBanks.length} items
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
                  title="Manage Banks"
                  columns={[
                    {
                      label: "Bank Name",
                      key: "bank_name",
                    },
                    {
                      label: "IFSC",
                      key: "ifsc_code",
                    },
                    {
                      label: "Account Type",
                      key: "account_type",
                    },
                    {
                      label: "Account Number",
                      key: "account_number",
                    },
                    {
                      label: "Branch",
                      key: "branch",
                    },
                    {
                      label: "Branch Address",
                      key: "branch_address",
                    },
                  ]}
                  data={filteredBanks}
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

            <select
              value={filters.accountType}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  accountType: e.target.value,
                });

                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none dark:border-[#1b2740] dark:bg-[#0d1528]"
            >
              <option value="">All account types</option>

              {getUniqueValues("account_type").map((value) => (
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
                  {[
                    "Bank Name",
                    "IFSC",
                    "Type",
                    "Account No.",
                    "Branch",
                    "Branch Address",
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

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {paginatedBanks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-sm text-slate-400"
                    >
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedBanks.map((bank) => (
                    <tr
                      key={bank.bank_id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-6 py-4">{bank.bank_name}</td>

                      <td className="px-6 py-4">{bank.ifsc_code}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                            bank.account_type === "Current"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {bank.account_type}
                        </span>
                      </td>

                      <td className="px-6 py-4">{bank.account_number}</td>
                      <td className="px-6 py-4">{bank.branch}</td>

                      <td className="px-6 py-4">{bank.branch_address}</td>

                      {/* ACTION BUTTONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* VIEW BUTTON */}
                          <button
                            onClick={() =>
                              navigate(
                                `/transactions/bank-book?bank=${bank.bank_name}`,
                              )
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => editBank(bank)}
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: bank.bank_id,
                                name: bank.bank_name,
                              })
                            }
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

              {/* PAGE NUMBER */}
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
        isOpen={deleteModal.open}
        title="Delete Bank"
        message={`Are you sure you want to delete "${deleteModal.name}" ?`}
        onClose={() =>
          setDeleteModal({
            open: false,
            id: null,
            name: "",
          })
        }
        onConfirm={async () => {
          await deleteBank(deleteModal.id);

          setDeleteModal({
            open: false,
            id: null,
            name: "",
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
