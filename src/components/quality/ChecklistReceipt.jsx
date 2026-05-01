import { useLocation } from "react-router-dom";
import { useRef } from "react";
import logo from "../../assets/TektronicsLogo.png";

export default function ChecklistReceipt() {
  const { state } = useLocation();
  const data = state?.checklist;
  const printRef = useRef();

  if (!data)
    return (
      <div className="p-10 text-center text-slate-400">
        No checklist data found.
      </div>
    );

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // ✅ PRINT FUNCTION (CLEAN + STABLE)
  const handlePrint = () => {
    const content = printRef.current.innerHTML;

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>QC Report - ${data.checklistName}</title>
          <style>
            @page { size: A4 landscape; margin: 8mm; }

            body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              color: #000;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }

            td {
              border: 1px solid #000;
              padding: 4px;
              vertical-align: middle;
            }

            .center { text-align: center; }
            .bold { font-weight: bold; }

            img {
              max-height: 40px;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  // reusable cell styles
  const td = (extra = {}) => ({
    border: "1px solid #000",
    padding: "4px",
    fontSize: 11,
    ...extra,
  });

  const tdBold = (extra = {}) =>
    td({ fontWeight: "bold", ...extra });

  return (
    <div className="p-4 bg-slate-100 min-h-screen">

      {/* PRINT BUTTON */}
      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 shadow-lg"
        >
          🖨 Generate Report
        </button>
      </div>

      {/* REPORT */}
      <div className="overflow-x-auto">
        <div
          ref={printRef}
          className="bg-white mx-auto shadow-2xl p-2"
          style={{ minWidth: 900 }}
        >
          <table>
            <tbody>

              {/* HEADER */}
              <tr>
                <td colSpan={2} rowSpan={2} style={td({ textAlign: "center" })}>
                  <img src={logo} alt="logo" />
                </td>

                <td
                  colSpan={5}
                  style={tdBold({
                    textAlign: "center",
                    fontSize: 14,
                  })}
                >
                  TEST REPORT OF{" "}
                  {(data.applicableProduct || "UNKNOWN").toUpperCase()}
                </td>

                <td colSpan={3} style={tdBold()}>
                  DOC No: TKTQA015FR
                  <br />
                  PAGE 1 OF 1
                </td>
              </tr>

              <tr>
                <td colSpan={3} style={tdBold()}>
                  E-WAY BILL NO:
                </td>
                <td colSpan={2} style={tdBold()}>
                  IIR No.
                </td>
                <td colSpan={3}></td>
              </tr>

              {/* META */}
              <tr>
                <td colSpan={2} style={tdBold()}>
                  REC DATE:
                </td>
                <td colSpan={8}></td>
              </tr>

              <tr>
                <td colSpan={2} style={tdBold()}>
                  INV NO:
                </td>
                <td colSpan={8}>
                  ITEM NAME: {data.checklistName}
                </td>
              </tr>

              <tr>
                <td colSpan={2} style={tdBold()}>
                  INV DATE:
                </td>
                <td colSpan={8}>
                  ITEM CODE: {data.checklistCode}
                </td>
              </tr>

              <tr>
                <td colSpan={2} style={tdBold()}>
                  P.O NO:
                </td>
                <td colSpan={8}>
                  TECHNICAL PARAMETER & SAMPLE QTY
                </td>
              </tr>

              <tr>
                <td colSpan={2} style={tdBold()}>
                  LOT QTY:
                </td>
                <td colSpan={8}>
                  SUPPLIER NAME:
                </td>
              </tr>

              {/* SECTION */}
              <tr>
                <td
                  colSpan={10}
                  style={tdBold({ background: "#f2f2f2" })}
                >
                  DIMENSIONAL CHARACTERISTICS
                </td>
              </tr>

              {/* TABLE HEADER */}
              <tr>
                <td style={tdBold({ textAlign: "center" })}>S.No</td>
                <td style={tdBold({ textAlign: "center" })}>Name</td>
                <td style={tdBold({ textAlign: "center" })}>Sub Name</td>
                <td style={tdBold({ textAlign: "center" })}>Type</td>
                <td style={tdBold({ textAlign: "center" })}>Min</td>
                <td style={tdBold({ textAlign: "center" })}>Max</td>
                <td style={tdBold({ textAlign: "center" })}>Same</td>
                <td style={tdBold({ textAlign: "center" })}>Tool</td>
                <td colSpan={2}></td>
              </tr>

              {/* ITEMS */}
              {data.items.map((item, i) => {
                const isFirst =
                  i === 0 || data.items[i - 1].name !== item.name;

                const groupSize = data.items.filter(
                  (x) => x.name === item.name
                ).length;

                return (
                  <tr key={i}>
                    <td style={td({ textAlign: "center" })}>
                      {i + 1}
                    </td>

                    {isFirst && (
                      <td
                        rowSpan={groupSize}
                        style={tdBold({
                          textAlign: "center",
                          verticalAlign: "middle",
                        })}
                      >
                        {item.name}
                      </td>
                    )}

                    <td style={td()}>{item.subName}</td>
                    <td style={td({ textAlign: "center" })}>
                      {item.valueType}
                    </td>
                    <td style={td({ textAlign: "center" })}>
                      {item.min}
                    </td>
                    <td style={td({ textAlign: "center" })}>
                      {item.max}
                    </td>
                    <td style={td({ textAlign: "center" })}>
                      {item.same}
                    </td>
                    <td style={td({ textAlign: "center" })}>
                      {item.tool}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                );
              })}

              {/* FOOTER */}
              <tr>
                <td colSpan={3} style={tdBold()}>
                  Prepared By:
                </td>
                <td colSpan={3} style={tdBold()}>
                  Reviewed By:
                </td>
                <td colSpan={2} style={tdBold()}>
                  Approved By:
                </td>
                <td colSpan={2} style={tdBold()}>
                  Date: {today}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}