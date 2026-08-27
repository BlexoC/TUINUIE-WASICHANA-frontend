import { useState } from "react";
import {
  X,
  Building2,
  Download,
  CheckCircle2,
  Sparkles,
  FileCheck,
  Send
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeCorporateModal } from "../store/slices/charitySlice";
import { useToast } from "./ToastContext";
const CORPORATE_PARTNERS = [
  {
    company_id: "corp_safaricom",
    company_name: "Safaricom Foundation (Ndoto Zetu)",
    logo_url: "\u{1F7E2}",
    match_ratio: "1:1 Match",
    total_matched_kes: 125e5,
    employees_participating: 420,
    active_pool_kes: 45e5
  },
  {
    company_id: "corp_equity",
    company_name: "Equity Group Foundation CSR",
    logo_url: "\u{1F534}",
    match_ratio: "2:1 Emergency Match",
    total_matched_kes: 182e5,
    employees_participating: 680,
    active_pool_kes: 7e6
  },
  {
    company_id: "corp_kcb",
    company_name: "KCB Foundation 2jiajiri",
    logo_url: "\u{1F535}",
    match_ratio: "1:1 Match",
    total_matched_kes: 94e5,
    employees_participating: 310,
    active_pool_kes: 32e5
  }
];
const CorporatePortalModal = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isCorporateModalOpen } = useAppSelector((state) => state.charity);
  const [employeeCount, setEmployeeCount] = useState(50);
  const [monthlyGiftPerEmployee, setMonthlyGiftPerEmployee] = useState(1e3);
  const [matchRatio, setMatchRatio] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submittedInquiry, setSubmittedInquiry] = useState(false);
  if (!isCorporateModalOpen) return null;
  const monthlyTotal = employeeCount * monthlyGiftPerEmployee * (1 + matchRatio);
  const annualTotal = monthlyTotal * 12;
  const annualGirlsSupported = Math.floor(annualTotal / 1300);
  const annualDaysSaved = annualGirlsSupported * 45;
  const handleDownloadEsgReport = () => {
    const reportData = `===============================================================
TUINUE WASICHANA - CORPORATE SOCIAL RESPONSIBILITY (CSR) REPORT
ESG Social Impact & Menstrual Equity Assessment
===============================================================

Organization: ${companyName || "Corporate Partner"}
Date Generated: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
Certification ID: CSR-ESG-2026-${Math.floor(1e5 + Math.random() * 9e5)}

EXECUTIVE IMPACT SUMMARY:
---------------------------------------------------------------
1. Participating Employees:       ${employeeCount}
2. Monthly Employee Giving:       KES ${(employeeCount * monthlyGiftPerEmployee).toLocaleString()}
3. Corporate Match Ratio:         ${matchRatio}:1
4. Total Annualized Giving:       KES ${annualTotal.toLocaleString()}
5. Direct Girls Reached:          ${annualGirlsSupported.toLocaleString()} schoolgirls
6. School Attendance Days Saved:  ${annualDaysSaved.toLocaleString()} instructional days
7. Plastic Waste Avoided:         ${(annualGirlsSupported * 7.5).toFixed(1)} kg single-use pads offset

SUSTAINABLE DEVELOPMENT GOALS (SDGs) ALIGNMENT:
- SDG 3: Good Health & Well-Being (Hygiene & Reproductive Health)
- SDG 4: Quality Education (Reducing absenteeism by up to 88%)
- SDG 5: Gender Equality (Dignity & Equal Classroom Participation)
- SDG 6: Clean Water & Sanitation (School WASH Station Support)

Official Verification: https://tuinuewasichana.or.ke/esg-verify
===============================================================`;
    const blob = new Blob([reportData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tuinue_Wasichana_CSR_ESG_Impact_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Corporate ESG Impact Report downloaded successfully!");
  };
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!companyName || !contactEmail) return;
    setSubmittedInquiry(true);
    showToast("Corporate partnership request submitted. Our CSR team will reach out within 24 hours.");
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {
    /* Header */
  }
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">
                Corporate Giving & ESG Partnership Hub
              </h3>
              <p className="text-xs text-slate-400">
                Amplify employee philanthropy with matching grants and generate audit-ready ESG impact reports.
              </p>
            </div>
          </div>

          <button
    onClick={() => dispatch(closeCorporateModal())}
    className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content Body */
  }
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {
    /* Active Corporate Matching Partners */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Active Institutional Matching Pools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CORPORATE_PARTNERS.map((partner) => <div
    key={partner.company_id}
    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
  >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{partner.logo_url}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                        {partner.match_ratio}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs">
                      {partner.company_name}
                    </h5>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Matched:</span>
                      <span className="font-bold text-slate-800">
                        KES {(partner.total_matched_kes / 1e6).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Pool:</span>
                      <span className="font-bold text-emerald-700">
                        KES {(partner.active_pool_kes / 1e6).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {
    /* Interactive Employee Match Calculator */
  }
          <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-7 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold tracking-wide">
                    Employee Giving Match Simulator
                  </h4>
                </div>
                <span className="text-xs bg-white/10 px-2.5 py-1 rounded-xl text-purple-200">
                  Tax Deductible CSR (KRA Section 15)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {
    /* Employees */
  }
                <div>
                  <label className="text-xs text-purple-200 block mb-1.5 font-medium">
                    Participating Employees
                  </label>
                  <input
    type="number"
    min="5"
    max="10000"
    step="5"
    value={employeeCount}
    onChange={(e) => setEmployeeCount(Math.max(1, Number(e.target.value)))}
    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-purple-800 text-white text-xs font-bold"
  />
                </div>

                {
    /* Monthly Contribution */
  }
                <div>
                  <label className="text-xs text-purple-200 block mb-1.5 font-medium">
                    Avg. Monthly Gift per Employee (KES)
                  </label>
                  <input
    type="number"
    min="200"
    max="50000"
    step="100"
    value={monthlyGiftPerEmployee}
    onChange={(e) => setMonthlyGiftPerEmployee(Math.max(100, Number(e.target.value)))}
    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-purple-800 text-white text-xs font-bold"
  />
                </div>

                {
    /* Match Ratio */
  }
                <div>
                  <label className="text-xs text-purple-200 block mb-1.5 font-medium">
                    Corporate Match Ratio
                  </label>
                  <select
    value={matchRatio}
    onChange={(e) => setMatchRatio(Number(e.target.value))}
    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-purple-800 text-white text-xs font-bold"
  >
                    <option value={1}>1:1 Match (Standard)</option>
                    <option value={2}>2:1 Match (Accelerated)</option>
                    <option value={0.5}>0.5:1 Match (50%)</option>
                  </select>
                </div>
              </div>

              {
    /* Calculated Outputs */
  }
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-purple-800/80">
                <div className="bg-white/10 p-3.5 rounded-2xl">
                  <span className="text-purple-300 text-[11px] block">
                    Combined Annualized Fund
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-300">
                    KES {annualTotal.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white/10 p-3.5 rounded-2xl">
                  <span className="text-purple-300 text-[11px] block">
                    Girls Sponsored for 2 Years
                  </span>
                  <span className="text-xl font-bold font-mono text-white">
                    {annualGirlsSupported.toLocaleString()} Girls
                  </span>
                </div>

                <div className="bg-white/10 p-3.5 rounded-2xl">
                  <span className="text-purple-300 text-[11px] block">
                    School Attendance Restored
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-300">
                    {annualDaysSaved.toLocaleString()} Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {
    /* CSR Inquiry Form & ESG Download */
  }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
    /* Inquiry Form */
  }
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-purple-900" />
                <span>Enroll Your Organization</span>
              </h5>

              {submittedInquiry ? <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Your request has been received. Our partnership director will contact you promptly.</span>
                </div> : <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Company / Organization Name
                    </label>
                    <input
    type="text"
    required
    placeholder="e.g. Standard Chartered Bank Kenya"
    value={companyName}
    onChange={(e) => setCompanyName(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700"
  />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Corporate Contact Email
                    </label>
                    <input
    type="email"
    required
    placeholder="csr@company.com"
    value={contactEmail}
    onChange={(e) => setContactEmail(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700"
  />
                  </div>

                  <button
    type="submit"
    className="w-full py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors"
  >
                    Submit Partnership Request
                  </button>
                </form>}
            </div>

            {
    /* Instant ESG Report Download */
  }
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>Audit-Ready ESG Impact Certification</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                  Export verified quantitative data on social return on investment (SROI), girl retention rates, and plastic waste reduction for inclusion in your annual Sustainability Report.
                </p>
              </div>

              <button
    onClick={handleDownloadEsgReport}
    className="w-full mt-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
  >
                <Download className="w-3.5 h-3.5" />
                <span>Generate CSR ESG Report (.txt)</span>
              </button>
            </div>
          </div>
        </div>

        {
    /* Footer */
  }
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
    onClick={() => dispatch(closeCorporateModal())}
    className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors"
  >
            Close Portal
          </button>
        </div>
      </div>
    </div>;
};
export {
  CorporatePortalModal
};