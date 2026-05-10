import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/TektronicsLogo.png";

export default function QCReceipt() {
  const { state } = useLocation();
  const data = state?.qc;

  const navigate = useNavigate();
  const printRef = useRef();

  if (!data) {
    return (
      <div className="p-10 text-center text-slate-400">
        No QC data found
      </div>
    );
  }

  const handlePrint = () => {
    const content = printRef.current.innerHTML;

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>QC Report</title>

          <style>
            body{
              font-family: Arial;
              padding:20px;
            }

            table{
              width:100%;
              border-collapse:collapse;
            }

            th,td{
              border:1px solid #000;
              padding:8px;
              text-align:left;
              font-size:12px;
            }

            th{
              background:#f3f4f6;
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

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      {/* TOPBAR */}
      <div className="mx-auto mb-6 flex max-w-[1200px] items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-800">
          QC Inspection Receipt
        </h2>

        <div className="flex gap-3">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl bg-slate-700 px-6 py-2.5 font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* PRINT */}
          <button
            onClick={handlePrint}
            className="rounded-xl bg-[#44a83e] px-6 py-2.5 font-semibold text-white"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* RECEIPT */}
      <div className="overflow-x-auto">

        <div
          ref={printRef}
          className="mx-auto max-w-[1200px] bg-white p-6 shadow-sm"
        >

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between border-b pb-4">

            <div>
              <img
                src={logo}
                alt="logo"
                className="h-14"
              />
            </div>

            <div className="text-right">
              <h2 className="text-xl font-bold">
                QC Inspection Report
              </h2>

              <p className="text-sm text-slate-500">
                GRN: {data.grn}
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">

            <div>
              <span className="font-semibold">
                Date:
              </span>{" "}
              {data.date}
            </div>

            <div>
              <span className="font-semibold">
                Product:
              </span>{" "}
              {data.product}
            </div>

            <div>
              <span className="font-semibold">
                Checklist:
              </span>{" "}
              {data.checklistName}
            </div>

            <div>
              <span className="font-semibold">
                Final Status:
              </span>{" "}
              {data.status}
            </div>

            <div>
              <span className="font-semibold">
                Pass Percentage:
              </span>{" "}
              {data.percentage}
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border-collapse">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Parameter</th>
                <th>Sub Name</th>
                <th>Expected</th>
                <th>Observed</th>
                <th>Tool</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {data.checklistItems.map(
                (item, index) => (
                  <tr key={index}>

                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>{item.subName}</td>

                    <td>
                      {item.valueType ===
                      "Numeric"
                        ? `${item.min} - ${item.max}`
                        : item.same}
                    </td>

                    <td>{item.value}</td>

                    <td>{item.tool}</td>

                    <td>
                      {item.result}
                    </td>

                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}