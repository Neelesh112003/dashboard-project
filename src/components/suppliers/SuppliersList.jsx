import { useState } from "react";
import { Eye, Trash2, Package, X, Search, Filter, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const STATUS_META = {
  Active:   { color:"#2d6e2a", bg:"rgba(45,110,42,0.1)",   dot:"#2d6e2a" },
  Inactive: { color:"#6b7280", bg:"rgba(107,114,128,0.1)", dot:"#9ca3af" },
};

const CATEGORY_META = {
  "Electronic components": { color:"#1e40af", bg:"rgba(30,64,175,0.08)"   },
  "PCB & substrates":      { color:"#6b21a8", bg:"rgba(107,33,168,0.08)"  },
  "Packaging material":    { color:"#0f766e", bg:"rgba(15,118,110,0.08)"  },
  "Mechanical parts":      { color:"#c2410c", bg:"rgba(194,65,12,0.08)"   },
  "Consumables":           { color:"#374151", bg:"rgba(55,65,81,0.08)"    },
};

const COLS = ["Code","Supplier / Party","Category","Type","City","Contact","Status","Actions"];

export default function SupplierList({ suppliers = [], onDelete, onAdd }) {
  const [view,           setView]           = useState(null);
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFilter,     setShowFilter]     = useState(false);

  if (!suppliers.length) return (
    <div style={{ textAlign:"center", padding:"48px 0", color:"#9ca3af", fontSize:14 }}>
      No suppliers yet. Click <strong>Add Supplier</strong> to get started.
    </div>
  );

  // ── Filter ──
  const filtered = suppliers.filter(s => {
    const text = search.toLowerCase();
    const matchSearch =
      (s.supplierName  || "").toLowerCase().includes(text) ||
      (s.partyName     || "").toLowerCase().includes(text) ||
      (s.companyName   || "").toLowerCase().includes(text) ||
      (s.code          || "").toLowerCase().includes(text);
    const matchStatus   = statusFilter   ? s.status === statusFilter : true;
    const matchCategory = categoryFilter ? (s.category || "").toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    return matchSearch && matchStatus && matchCategory;
  });

  // ── Export ──────────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    const data = suppliers.map(s => ({
      Code:                    s.code,
      SupplierName:            s.supplierName,
      PartyName:               s.partyName,
      Company:                 s.companyName,
      Category:                s.category,
      Type:                    s.type,
      Industry:                s.industry,
      Sector:                  s.sector,
      GSTIN:                   s.gstin,
      LicenseNumber:           s.licenseNumber,
      Website:                 s.website,
      Status:                  s.status,
      Address:                 s.address,
      City:                    s.city,
      State:                   s.state,
      Country:                 s.country,
      Pincode:                 s.pincode,
      Contact:                 s.contact,
      Email:                   s.email,
      WhatsApp:                s.whatsapp,
      ContactPersonName:       s.contactPersonName,
      ContactPersonDesignation:s.contactPersonDesignation,
      ContactPersonContact:    s.contactPersonContact,
      ContactPersonEmail:      s.contactPersonEmail,
      ContactPersonWhatsApp:   s.contactPersonWhatsapp,
      Details:                 s.details,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    saveAs(new Blob([XLSX.write(wb, { bookType:"xlsx", type:"array" })]), "suppliers.xlsx");
  };

  return (
    <>
      <div style={{ borderRadius:16, border:"1px solid #e2e8f0", backgroundColor:"#fff", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* ── Header ── */}
        <div style={{ padding:"18px 24px", backgroundColor:"#3a3c44" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:9, backgroundColor:"rgba(245,245,245,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Package style={{ width:18, height:18, color:"#f5f5f5" }} />
            </div>
            <div>
              <h2 style={{ fontSize:16, fontWeight:600, color:"#f5f5f5", margin:0 }}>Supplier List</h2>
              <p style={{ fontSize:12, color:"rgba(245,245,245,0.55)", margin:0 }}>{suppliers.length} vendor{suppliers.length !== 1 ? "s":""} registered</p>
            </div>

            {/* Controls */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <Search style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", width:14, height:14, color:"#9ca3af" }} />
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ padding:"8px 12px 8px 28px", borderRadius:8, border:"1px solid #4b5563", background:"#3a3c44", color:"#fff", fontSize:12, outline:"none", width:160 }} />
              </div>
              {/* Filter toggle */}
              <button onClick={() => setShowFilter(p => !p)}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", borderRadius:8, border:"1px solid #4b5563", background: showFilter ? "#4b5563" : "transparent", color:"#fff", fontSize:12, cursor:"pointer" }}>
                <Filter style={{ width:14, height:14 }} /> Filter
              </button>
              {/* Export */}
              <button onClick={exportToExcel}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", borderRadius:8, border:"1px solid #4b5563", background:"transparent", color:"#fff", fontSize:12, cursor:"pointer" }}>
                <Download style={{ width:14, height:14 }} /> Export
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {showFilter && (
            <div style={{ margin:"12px 0 0", padding:"14px 16px", borderRadius:10, background:"rgba(255,255,255,0.07)", border:"1px solid #4b5563", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, color:"rgba(245,245,245,0.7)", fontWeight:500 }}>Category:</span>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                  style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #4b5563", background:"#3a3c44", color:"#fff", fontSize:12, cursor:"pointer", outline:"none" }}>
                  <option value="">All</option>
                  <option>Electronic components</option>
                  <option>PCB &amp; substrates</option>
                  <option>Packaging material</option>
                  <option>Mechanical parts</option>
                  <option>Consumables</option>
                </select>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, color:"rgba(245,245,245,0.7)", fontWeight:500 }}>Status:</span>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #4b5563", background:"#3a3c44", color:"#fff", fontSize:12, cursor:"pointer", outline:"none" }}>
                  <option value="">All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button onClick={() => { setStatusFilter(""); setCategoryFilter(""); }}
                style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:8, border:"1px solid #4b5563", background:"transparent", fontSize:12, cursor:"pointer", color:"rgba(245,245,245,0.7)" }}>
                Reset
              </button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #f1f5f9" }}>
                {COLS.map(h => (
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#9ca3af", whiteSpace:"nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const sm = STATUS_META[s.status]     || STATUS_META["Inactive"];
                const cm = CATEGORY_META[s.category] || { color:"#374151", bg:"rgba(55,65,81,0.08)" };
                return (
                  <tr key={s.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f8fafc" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>

                    {/* Code */}
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:"#3a3c44", backgroundColor:"#f1f5f9", padding:"2px 8px", borderRadius:6 }}>
                        {s.code || "—"}
                      </span>
                    </td>

                    {/* Supplier Name + Party Name */}
                    <td style={{ padding:"12px 16px", minWidth:200 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", backgroundColor:"#3a3c44", display:"flex", alignItems:"center", justifyContent:"center", color:"#f5f5f5", fontSize:13, fontWeight:700, flexShrink:0 }}>
                          {(s.supplierName || s.partyName || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin:0, fontWeight:600, color:"#30333e", whiteSpace:"nowrap" }}>{s.supplierName || s.partyName || "—"}</p>
                          <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{s.partyName !== s.supplierName ? s.partyName : s.companyName || ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding:"12px 16px" }}>
                      {s.category
                        ? <span style={{ display:"inline-block", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:cm.bg, color:cm.color, whiteSpace:"nowrap" }}>{s.category}</span>
                        : <span style={{ color:"#9ca3af" }}>—</span>}
                    </td>

                    {/* Type */}
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#3a3c44", whiteSpace:"nowrap" }}>{s.type || "—"}</td>

                    {/* City */}
                    <td style={{ padding:"12px 16px", fontSize:13, color:"#3a3c44" }}>{s.city || "—"}</td>

                    {/* Contact */}
                    <td style={{ padding:"12px 16px" }}>
                      <p style={{ margin:0, fontSize:12, color:"#3a3c44" }}>{s.contact || "—"}</p>
                      <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{s.email || ""}</p>
                    </td>

                    {/* Status */}
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:sm.bg, color:sm.color, whiteSpace:"nowrap" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:sm.dot, flexShrink:0 }} />
                        {s.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <button onClick={() => setView(s)}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"1px solid #e2e8f0", backgroundColor:"#fff", fontSize:12, fontWeight:500, color:"#3a3c44", cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                          <Eye style={{ width:13, height:13 }} /> View
                        </button>
                        <button onClick={() => onDelete(s.id)}
                          style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, border:"1px solid #fecaca", backgroundColor:"#fff", fontSize:12, fontWeight:500, color:"#ef4444", cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fff5f5"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
                          <Trash2 style={{ width:13, height:13 }} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign:"center", padding:"32px 0", color:"#9ca3af", fontSize:13 }}>
                    No suppliers match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Modal ── */}
      {view && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}
          onClick={() => setView(null)}>
          <div style={{ width:"100%", maxWidth:520, borderRadius:16, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.3)", backgroundColor:"#fff" }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", backgroundColor:"#44a83e" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", backgroundColor:"rgba(245,245,245,0.15)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16, fontWeight:700 }}>
                  {(view.supplierName || view.partyName || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:600, color:"#f5f5f5" }}>{view.supplierName || view.partyName}</h3>
                  <p style={{ margin:0, fontSize:12, color:"rgba(245,245,245,0.6)" }}>Supplier Details</p>
                </div>
              </div>
              <button onClick={() => setView(null)}
                style={{ width:32, height:32, borderRadius:8, border:"none", backgroundColor:"transparent", color:"#f5f5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(245,245,245,0.1)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <X style={{ width:18, height:18 }} />
              </button>
            </div>

            {/* Modal body — grouped */}
            <div style={{ padding:"8px 24px 20px", maxHeight:"75vh", overflowY:"auto" }}>

              {/* Identity */}
              <ModalSection title="Identity" />
              {[
                { label:"Supplier Code",   val:view.code,          mono:true  },
                { label:"Supplier Name",   val:view.supplierName              },
                { label:"Party Name",      val:view.partyName                 },
                { label:"Company Name",    val:view.companyName               },
                { label:"Category",        val:view.category,      cat:true   },
                { label:"Type",            val:view.type                      },
                { label:"Industry",        val:view.industry                  },
                { label:"Sector",          val:view.sector                    },
                { label:"GSTIN",           val:view.gstin,         mono:true  },
                { label:"License Number",  val:view.licenseNumber             },
                { label:"Website",         val:view.website                   },
                { label:"Status",          val:view.status,        status:true},
              ].map(row => <ModalRow key={row.label} {...row} />)}

              {/* Address */}
              <ModalSection title="Address" />
              {[
                { label:"Address",   val:view.address  },
                { label:"City",      val:view.city     },
                { label:"State",     val:view.state    },
                { label:"Country",   val:view.country  },
                { label:"Pincode",   val:view.pincode, mono:true },
              ].map(row => <ModalRow key={row.label} {...row} />)}

              {/* Supplier Contact */}
              <ModalSection title="Supplier Contact" />
              {[
                { label:"Contact", val:view.contact  },
                { label:"Email",   val:view.email    },
                { label:"WhatsApp",val:view.whatsapp },
              ].map(row => <ModalRow key={row.label} {...row} />)}

              {/* Contact Person */}
              <ModalSection title="Contact Person" />
              {[
                { label:"Name",        val:view.contactPersonName        },
                { label:"Designation", val:view.contactPersonDesignation },
                { label:"Contact",     val:view.contactPersonContact     },
                { label:"Email",       val:view.contactPersonEmail       },
                { label:"WhatsApp",    val:view.contactPersonWhatsapp    },
              ].map(row => <ModalRow key={row.label} {...row} />)}

              {/* Details */}
              {view.details && (
                <>
                  <ModalSection title="Supplier Details" />
                  <ModalRow label="Details" val={view.details} />
                </>
              )}

              {/* Timestamps */}
              <ModalSection title="Record Info" />
              {[
                { label:"Created At", val:view.createdAt ? new Date(view.createdAt).toLocaleString("en-IN") : "—" },
                { label:"Updated At", val:view.updatedAt ? new Date(view.updatedAt).toLocaleString("en-IN") : "—" },
              ].map(row => <ModalRow key={row.label} {...row} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Modal sub-components ──────────────────────────────────────────────────────
function ModalSection({ title }) {
  return (
    <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#9ca3af", margin:"16px 0 4px", paddingBottom:6, borderBottom:"1px solid #f1f5f9" }}>
      {title}
    </p>
  );
}


function ModalRow({ label, val, mono, cat, status }) {
  if (!val && val !== 0) return null;
  const sm = status ? (STATUS_META[val] || STATUS_META["Inactive"]) : null;
  const cm = cat    ? (CATEGORY_META[val] || { color:"#374151", bg:"rgba(55,65,81,0.08)" }) : null;
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f8fafc" }}>
      <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", color:"#9ca3af", flexShrink:0, marginRight:16 }}>{label}</span>
      {mono ? (
        <span style={{ fontFamily:"monospace", fontSize:11, backgroundColor:"#f1f5f9", color:"#3a3c44", padding:"2px 8px", borderRadius:6 }}>{val}</span>
      ) : cat ? (
        <span style={{ borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:cm.bg, color:cm.color }}>{val}</span>
      ) : status ? (
        <span style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:600, backgroundColor:sm.bg, color:sm.color }}>
          <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:sm.dot }} />{val}
        </span>
      ) : (
        <span style={{ fontSize:13, fontWeight:500, color:"#30333e", textAlign:"right", maxWidth:280, wordBreak:"break-word" }}>{val}</span>
      )}
    </div>
  );
}