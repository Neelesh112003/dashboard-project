import { useState } from "react";
import { Eye, Trash2, Users, Star, X, Search, Filter, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const STATUS_META = {
  Active:   { color:"#2d6e2a", bg:"rgba(45,110,42,0.1)",  dot:"#2d6e2a" },
  Inactive: { color:"#6b7280", bg:"rgba(107,114,128,0.1)", dot:"#9ca3af" },
};

const CATEGORY_META = {
  "Electronics Retail": { color:"#1e40af", bg:"rgba(30,64,175,0.1)"  },
  "Electronics Distribution":      { color:"#6b21a8", bg:"rgba(107,33,168,0.1)" },
  "Wholesale":    { color:"#0f766e", bg:"rgba(15,118,110,0.1)" },
  "E-commerce":      { color:"#c2410c", bg:"rgba(194,65,12,0.1)"  },
  "Corporate":           { color:"#374151", bg:"rgba(55,65,81,0.1)"   },
};


const COLS = ["Code","Party Name","Category","Type","City","Contact","Status","Actions"];

export default function CustomerList({ customers, onDelete, onAdd }) {
  const [view, setView] = useState(null);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [showFilter, setShowFilter] = useState(false);

  if (!customers.length) return (
    <div style={{ textAlign:"center", padding:"48px 0", color:"#9ca3af", fontSize:14 }}>
      No customers yet. Click <strong>Add Customer</strong> to get started.
    </div>
  );

  const filteredCustomers = customers.filter((c) => {
  const text = search.toLowerCase();

  const matchSearch =
    (c.partyName || "").toLowerCase().includes(text) ||
    (c.companyName || "").toLowerCase().includes(text) ||
    (c.code || "").toLowerCase().includes(text);

  const matchStatus = statusFilter ? c.status === statusFilter : true;

  const matchCategory = categoryFilter
    ? (c.category || "").toLowerCase().includes(categoryFilter.toLowerCase())
    : true;

  return matchSearch && matchStatus && matchCategory;
});

const exportToExcel = () => {
  const data = customers.map(c => ({
    Code: c.code,
    PartyName: c.partyName,
    Company: c.companyName,
    Category: c.category,
    Type: c.type,
    City: c.city,
    Contact: c.contact,
    Email: c.email,
    Status: c.status,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Customers");

  const file = XLSX.write(wb, { bookType:"xlsx", type:"array" });
  saveAs(new Blob([file]), "customers.xlsx");
};

  return (
    <>
      <div style={{ borderRadius:16, border:"1px solid #e2e8f0", backgroundColor:"#fff", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ padding:"18px 24px", backgroundColor:"#3a3c44", alignItems:"center", gap:12 }}>
   <div className="flex justify-between gap-2">
          <div style={{ width:36, height:36, borderRadius:9, backgroundColor:"rgba(245,245,245,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Users style={{ width:18, height:18, color:"#f5f5f5" }} />
          </div>
          <div>
            <h2 style={{ fontSize:16, fontWeight:600, color:"#f5f5f5", margin:0 }}>Customer List</h2>
            <p  style={{ fontSize:12, color:"rgba(245,245,245,0.55)", margin:0 }}>{customers.length} customer{customers.length !== 1 ? "s":""} registered</p>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>

  <div style={{ position:"relative" }}>
  <Search
    style={{
      position:"absolute",
      left:8,
      top:"50%",
      transform:"translateY(-50%)",
      width:14,
      height:14,
      color:"#9ca3af"
    }}
  />
  <input
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      padding:"8px 12px 8px 28px",
      borderRadius:8,
      border:"1px solid #4b5563",
      background:"#3a3c44",
      color:"#fff",
      fontSize:12,
      outline:"none",
      width:160
    }}
  />
</div>

  <button
  onClick={() => setShowFilter(prev => !prev)}
  style={{
    display:"flex",
    alignItems:"center",
    gap:6,
    padding:"8px 12px",
    borderRadius:8,
    border:"1px solid #4b5563",
    background: showFilter ? "#4b5563" : "transparent",
    color:"#fff",
    fontSize:12,
    cursor:"pointer"
  }}
>
  <Filter style={{ width:14, height:14 }} />
  Filter
</button>

 <button
  onClick={exportToExcel}
  style={{
    display:"flex",
    alignItems:"center",
    gap:6,
    padding:"8px 12px",
    borderRadius:8,
    border:"1px solid #4b5563",
    background:"transparent",
    color:"#fff",
    fontSize:12,
    cursor:"pointer"
  }}
>
  <Download style={{ width:14, height:14 }} />
  Export File
</button>

</div>
</div>
<div className="">
  {showFilter && (
  <div
    style={{
      margin:"10px 16px",
      padding:"14px 16px",
      borderRadius:10,
      background:"#f8fafc",
      border:"1px solid #e2e8f0",
      display:"flex",
      gap:16,
    }}
  >
    <div style={{ flex:1 }}>
      <label style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", color:"#9ca3af", display:"block", marginBottom:6 }}>Status</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          width:"100%",
          padding:"8px 12px",
          borderRadius:8,
          border:"1px solid #e2e8f0",
          fontSize:12,
          background:"#fff"
        }}
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
    <div style={{ flex:1 }}>
      <label style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", color:"#9ca3af", display:"block", marginBottom:6 }}>Category</label>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={{
          width:"100%",
          padding:"8px 12px",
          borderRadius:8,
          border:"1px solid #e2e8f0",
          fontSize:12,
          background:"#fff"
        }}
      >
        <option value="">All Categories</option>
        <option value="Electronics Retail">Electronics Retail</option>
        <option value="Electronics Distribution">Electronics Distribution</option>
        <option value="Wholesale">Wholesale</option>
        <option value="E-commerce">E-commerce</option>
        <option value="Corporate">Corporate</option>
      </select>
    </div>
  </div>
)}
</div>

        </div>

        {/* Table */}
        <div style={{ overflowX:"auto", scrollBehavior:"smooth" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ backgroundColor:"#f1f5f9", borderBottom:"1px solid #e2e8f0" }}>
                {COLS.map(c => (
                  <th key={c} style={{ padding:"12px 16px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:"#9ca3af", textAlign:"left", whiteSpace:"nowrap" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => {
                const sm = STATUS_META[c.status] || STATUS_META["Inactive"];
                const cm = CATEGORY_META[c.category] || { color:"#374151", bg:"rgba(55,65,81,0.1)" };
                return (
                  <tr key={c.id}
                    style={{
                      borderBottom:"1px solid #f1f5f9",
                      backgroundColor:"#fff"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor="#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor="transparent"}
                  >
                    {/* Code */}
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:"#64748b", backgroundColor:"#f1f5f9", padding:"2px 8px", borderRadius:6 }}>
                        {c.code || "—"}
                      </span>
                    </td>

                    {/* Party Name + company */}
                    <td style={{ padding:"12px 16px", minWidth:180 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", backgroundColor:"#3a3c44", display:"flex", alignItems:"center", justifyContent:"center", color:"#f5f5f5", fontSize:13, fontWeight:700, flexShrink:0 }}>
                          {(c.partyName || c.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin:0, fontWeight:600, color:"#1e293b", whiteSpace:"nowrap" }}>{c.partyName || c.name}</p>
                          <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{c.companyName || c.contactPerson || ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding:"12px 16px" }}>
                      {c.category
                        ? <span style={{ display:"inline-block", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:cm.bg, color:cm.color, whiteSpace:"nowrap" }}>{c.category}</span>
                        : <span style={{ color:"#9ca3af" }}>—</span>}
                    </td>

                    {/* Type */}
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#475569", whiteSpace:"nowrap" }}>
                      {c.type || "—"}
                    </td>

                    {/* City */}
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#475569" }}>
                      {c.city || "—"}
                    </td>

                    {/* Contact */}
                    <td style={{ padding:"12px 16px" }}>
                      <p style={{ margin:0, fontSize:12, color:"#475569" }}>{c.contact || c.phone || "—"}</p>
                      <p style={{ margin:0, fontSize:11, color:"#94a3b8" }}>{c.email || ""}</p>
                    </td>

                    {/* Status */}
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:sm.bg, color:sm.color, whiteSpace:"nowrap" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:sm.dot, flexShrink:0 }} />
                        {c.status}
                      </span>
                    </td>


                    {/* Actions */}
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <button onClick={() => setView(c)}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"1px solid #e2e8f0", backgroundColor:"#fff", fontSize:12, fontWeight:500, color:"#475569", cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor="#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor="#fff"}
                        >
                          <Eye style={{ width:13, height:13 }} /> View
                        </button>
                        <button onClick={() => onDelete(c.id)}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"1px solid #fecaca", backgroundColor:"#fff", fontSize:12, fontWeight:500, color:"#ef4444", cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor="#fff5f5"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor="#fff"}
                        >
                          <Trash2 style={{ width:13, height:13 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Modal ── */}
      {view && (
        <div
          style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
          onClick={() => setView(null)}
        >
          <div style={{ width:"100%", maxWidth:480, borderRadius:16, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.3)", backgroundColor:"#fff" }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", backgroundColor:"#44a83e" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", backgroundColor:"rgba(245,245,245,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:700 }}>
                  {(view.partyName || view.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:"#f5f5f5" }}>{view.partyName || view.name}</h3>
                  <p  style={{ margin:0, fontSize:12, color:"rgba(245,245,245,0.6)" }}>Customer Details</p>
                </div>
              </div>
              <button onClick={() => setView(null)}
                style={{ width:32, height:32, borderRadius:8, border:"none", backgroundColor:"transparent", color:"#f5f5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor="rgba(245,245,245,0.1)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor="transparent"}
              >
                <X style={{ width:18, height:18 }} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding:"8px 24px 20px", maxHeight:"70vh", overflowY:"auto" }}>
              {[
                { label:"Customer Code",     val: view.code,              mono:true  },
                { label:"Party Name",        val: view.partyName||view.name          },
                { label:"Company Name",      val: view.companyName                   },
                { label:"Category",          val: view.category,          cat:true   },
                { label:"Type",              val: view.type                          },
                { label:"GSTIN",             val: view.gstin,             mono:true  },
                { label:"License Number",    val: view.licenseNumber                 },
                { label:"Address",           val: view.address                       },
                { label:"City",              val: view.city                          },
                { label:"State",             val: view.state                         },
                { label:"Pincode",           val: view.pincode,           mono:true  },
                { label:"Country",           val: view.country                       },
                { label:"Contact Person",    val: view.contactPersonName             },
                { label:"Contact",           val: view.contact||view.phone           },
                { label:"Email",             val: view.email                         },
                { label:"WhatsApp",          val: view.whatsapp                      },
                { label:"Website",           val: view.website                       },
                { label:"Industry",          val: view.industry                      },
                { label:"Sector",            val: view.sector                        },
                { label:"Status",            val: view.status,            status:true},
                { label:"Details",           val: view.details                       },
                { label:"Remarks",           val: view.remarks                       },
                { label:"Created At",        val: view.createdAt ? new Date(view.createdAt).toLocaleString("en-IN") : view.addedOn },
                { label:"Updated At",        val: view.updatedAt ? new Date(view.updatedAt).toLocaleString("en-IN") : "—"         },
              ].map(({ label, val, mono, cat, status}) => {
                if (!val && val !== 0) return null;
                const sm = status ? (STATUS_META[val] || STATUS_META["Inactive"]) : null;
                const cm = cat    ? (CATEGORY_META[val] || { color:"#374151", bg:"rgba(55,65,81,0.1)" }) : null;
                return (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f8fafc" }}>
                    <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#9ca3af", flexShrink:0, marginRight:16 }}>{label}</span>
                    {mono ? (
                      <span style={{ fontFamily:"monospace", fontSize:11, backgroundColor:"#f1f5f9", color:"#475569", padding:"2px 8px", borderRadius:6 }}>{val}</span>
                    ) : cat ? (
                      <span style={{ borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:cm.bg, color:cm.color }}>{val}</span>
                    ) : status ? (
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:sm.bg, color:sm.color }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:sm.dot }} />{val}
                      </span>
                  ) : (
                      <span style={{ fontSize:13, fontWeight:500, color:"#334155", textAlign:"right", maxWidth:260, wordBreak:"break-word" }}>{val}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}