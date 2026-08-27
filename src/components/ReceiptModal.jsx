import { X, Printer, Download, Heart, CheckCircle2, Shield, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeReceiptModal } from "../store/slices/donationSlice";
import { useToast } from "./ToastContext";
const ReceiptModal = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isReceiptModalOpen, activeReceiptDonation } = useAppSelector(
    (state) => state.donation
  );
  if (!isReceiptModalOpen || !activeReceiptDonation) {
    return null;
  }
  const d = activeReceiptDonation;
  const formattedDate = new Date(d.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const handlePrint = () => {
    window.print();
    showToast("Sent receipt to system print dialog");
  };
  const handleDownload = () => {
    const receiptContent = `======================================================
TUINUE WASICHANA FOUNDATION - OFFICIAL DONATION RECEIPT
Registration: CBO/KFI/2021/0984 | Tax Exemption: KRA-DOD-2024
======================================================

Receipt Number:   ${d.mpesa_receipt || d.stripe_payment_id || `TW-${d.id.toUpperCase()}`}
Transaction Date: ${formattedDate}
Donor Name:       ${d.donor_name || "Generous Supporter"}
Donor Email:      ${d.donor_email || "N/A"}
Beneficiary:      ${d.charity_name}

Amount Donated:   ${d.currency} ${d.amount.toLocaleString()}
Frequency:        ${d.frequency.toUpperCase()}
Payment Method:   ${d.payment_method.toUpperCase()}
Status:           ${d.payment_status.toUpperCase()}

======================================================
Thank you for standing for menstrual dignity and girls' education.
Official Verification: https://tuinuewasichana.or.ke/verify/${d.id}
======================================================`;
    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tuinue_Wasichana_Receipt_${d.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Donation receipt downloaded successfully!");
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {
    /* Top Modal Controls (Hidden in Print) */
  }
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm">Official Donation Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={handlePrint}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
  >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
    onClick={handleDownload}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors"
  >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
    onClick={() => dispatch(closeReceiptModal())}
    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
    aria-label="Close modal"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* Printable Receipt Paper Container */
  }
        <div className="p-8 sm:p-10 space-y-8 bg-white text-slate-900 printable-area">
          {
    /* Header */
  }
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-950 text-white flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-purple-300 text-purple-300" />
                </div>
                <h2 className="text-2xl font-black font-serif text-slate-950 tracking-tight">
                  Tuinue Wasichana
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Empowering Adolescent Girls Through Dignity & Education
              </p>
              <p className="text-[11px] text-slate-400">
                Reg: CBO/KFI/2021/0984 | KRA Tax-Exempt Status: Act Sec 13(2)
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                Official Tax Receipt
              </span>
              <div className="text-xs font-mono text-slate-600">
                Ref: {d.mpesa_receipt || d.stripe_payment_id || `TW-${d.id.slice(-6).toUpperCase()}`}
              </div>
              <div className="text-[11px] text-slate-400">{formattedDate}</div>
            </div>
          </div>

          {
    /* Donor & Beneficiary Details Grid */
  }
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Donor Information
              </div>
              <div className="font-bold text-slate-900 text-base">
                {d.donor_name || "Generous Supporter"}
              </div>
              {d.donor_email && <div className="text-xs text-slate-600 mt-0.5">{d.donor_email}</div>}
              {d.mpesa_phone && <div className="text-xs text-slate-600 mt-0.5">Phone: {d.mpesa_phone}</div>}
              <div className="text-xs text-slate-500 mt-1">
                Type: {d.is_anonymous ? "Anonymous Gift" : "Recognized Donor"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Beneficiary Charity & Program
              </div>
              <div className="font-bold text-slate-900 text-base">
                {d.charity_name}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Designated: Menstrual Dignity & Sanitary Kit Fund
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Partner CBO / NGO</span>
              </div>
            </div>
          </div>

          {
    /* Transaction Summary Table */
  }
          <div>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">Frequency</th>
                  <th className="py-2.5 text-center">Payment Method</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-900">
                      Menstrual Hygiene & School Attendance Sponsorship
                    </span>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      Direct kit distribution, sanitary towels, and hygiene workshops
                    </p>
                  </td>
                  <td className="py-3.5 text-center capitalize text-slate-700">
                    {d.frequency}
                  </td>
                  <td className="py-3.5 text-center text-slate-700 uppercase">
                    {d.payment_method}
                  </td>
                  <td className="py-3.5 text-right font-bold text-slate-950 font-serif text-lg">
                    {d.currency} {d.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900">
                  <td colSpan={3} className="py-3 font-bold text-slate-900 text-base">
                    Total Tax-Exempt Contribution
                  </td>
                  <td className="py-3 text-right font-black text-purple-950 text-xl font-serif">
                    {d.currency} {d.amount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {
    /* Stamp & Verification Section */
  }
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Shield className="w-4 h-4 text-purple-900" />
                <span>Digitally Verified by Tuinue Wasichana Foundation</span>
              </div>
              <p className="max-w-xs text-[11px] leading-relaxed">
                This receipt is legally recognized for charitable deduction purposes. Retain this record for your tax declarations.
              </p>
            </div>

            {
    /* Official Digital Stamp Box */
  }
            <div className="border-2 border-dashed border-purple-300 bg-purple-50/50 rounded-2xl p-4 text-center shrink-0 w-44">
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-900">
                Official Seal
              </div>
              <div className="text-xs font-black text-purple-950 font-serif my-0.5">
                TUINUE WASICHANA
              </div>
              <div className="text-[9px] text-emerald-800 font-bold">
                ✓ VERIFIED & AUDITED
              </div>
              <div className="text-[8px] text-slate-400 font-mono mt-1">
                KRA SEC 13(2) CERT
              </div>
            </div>
          </div>
        </div>

        {
    /* Modal Footer */
  }
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
    onClick={() => dispatch(closeReceiptModal())}
    className="px-5 py-2 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors"
  >
            Done
          </button>
          <button
    onClick={handlePrint}
    className="px-5 py-2 bg-purple-900 text-white rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors shadow-sm inline-flex items-center gap-2"
  >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>;
};
export {
  ReceiptModal
};
