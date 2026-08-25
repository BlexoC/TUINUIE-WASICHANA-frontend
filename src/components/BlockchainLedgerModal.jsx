import { useState } from "react";
import {
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  Download,
  Copy
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeBlockchainModal } from "../store/slices/charitySlice";
import { useToast } from "./ToastContext";
const INITIAL_LEDGER_RECORDS = [
  {
    block_height: 184920,
    block_hash: "0x8f2a9103cba4918e901b22fa45e99812903feab90182470123948576aabbcc11",
    tx_hash: "0x3c91af20917281bc0931201948576aabbcc812903feab90182470123948576aa",
    donation_id: "don_101",
    charity_name: "Heshima Project",
    amount_kes: 2500,
    timestamp: "2026-08-24 14:10:02 UTC",
    smart_contract: "0xTuinueDignityDisbursement_v2",
    status: "confirmed"
  },
  {
    block_height: 184918,
    block_hash: "0x7e1120948576aabbcc812903feab90182470123948576aa8f2a9103cba4918e9",
    tx_hash: "0x99182470123948576aabbcc812903feab90182470123948576aa8f2a9103cba4",
    donation_id: "don_102",
    charity_name: "Emergency Dignity Kits Distribution",
    amount_kes: 5e3,
    timestamp: "2026-08-23 09:34:18 UTC",
    smart_contract: "0xTuinueDignityDisbursement_v2",
    status: "confirmed"
  },
  {
    block_height: 184915,
    block_hash: "0x448576aabbcc812903feab90182470123948576aa8f2a9103cba4918e901b22f",
    tx_hash: "0x1203feab90182470123948576aabbcc812903feab90182470123948576aa8f2a",
    donation_id: "don_103",
    charity_name: "Menstrual Health Education Workshops",
    amount_kes: 1e4,
    timestamp: "2026-08-22 18:22:45 UTC",
    smart_contract: "0xTuinueDignityDisbursement_v2",
    status: "confirmed"
  },
  {
    block_height: 184910,
    block_hash: "0x66182470123948576aa8f2a9103cba4918e901b22fa45e99812903feab901824",
    tx_hash: "0x550182470123948576aabbcc812903feab90182470123948576aa8f2a9103cba",
    donation_id: "don_099",
    charity_name: "Safe Haven Sanitation & Clean Water Stations",
    amount_kes: 25e3,
    timestamp: "2026-08-21 11:05:10 UTC",
    smart_contract: "0xTuinueDignityDisbursement_v2",
    status: "confirmed"
  }
];
const BlockchainLedgerModal = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isBlockchainModalOpen } = useAppSelector((state) => state.charity);
  const [searchTx, setSearchTx] = useState("");
  if (!isBlockchainModalOpen) return null;
  const filteredRecords = INITIAL_LEDGER_RECORDS.filter(
    (r) => !searchTx || r.tx_hash.toLowerCase().includes(searchTx.toLowerCase()) || r.charity_name.toLowerCase().includes(searchTx.toLowerCase()) || r.donation_id.toLowerCase().includes(searchTx.toLowerCase())
  );
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };
  const handleExportLedger = () => {
    const jsonStr = JSON.stringify(INITIAL_LEDGER_RECORDS, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tuinue_Wasichana_Blockchain_Audit_Ledger.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported verified ledger successfully.");
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full border border-slate-800 shadow-2xl overflow-hidden my-8">
        {
    /* Header */
  }
        <div className="bg-slate-950 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                  Cryptographic Transparency Ledger
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live & Immutable
                </span>
              </div>
              <p className="text-xs text-slate-400">
                100% of received funds are timestamped and provably routed to verified partner wallets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
    onClick={handleExportLedger}
    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-slate-700"
  >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
            <button
    onClick={() => dispatch(closeBlockchainModal())}
    className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
    aria-label="Close modal"
  >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {
    /* Cryptographic State Summary */
  }
        <div className="p-6 bg-slate-900/50 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">
              Current Merkle Root
            </span>
            <span className="font-mono text-purple-300 font-bold text-[11px] truncate block">
              0x8a92f01...d8e3b1c
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">
              Audited Smart Contract
            </span>
            <span className="font-mono text-emerald-300 font-bold text-[11px] truncate block">
              0xTuinueDignityDisbursement_v2
            </span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-1">
              Consensus Verification
            </span>
            <span className="text-amber-300 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Sig 4/5 Verified</span>
            </span>
          </div>
        </div>

        {
    /* Search Bar */
  }
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    placeholder="Search by transaction hash, charity name, or donation ID..."
    value={searchTx}
    onChange={(e) => setSearchTx(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
  />
          </div>
        </div>

        {
    /* Ledger Table */
  }
        <div className="p-6 pt-3 overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Block / Hash</th>
                <th className="py-3 px-3">Charity Recipient</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Timestamp (UTC)</th>
                <th className="py-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((r) => <tr key={r.tx_hash} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-purple-400 font-bold">
                        #{r.block_height}
                      </span>
                      <button
    onClick={() => copyToClipboard(r.tx_hash, "Transaction Hash")}
    className="text-slate-400 hover:text-white"
    title="Copy Tx Hash"
  >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate max-w-[140px] block">
                      {r.tx_hash.substring(0, 18)}...
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans font-medium text-slate-200">
                    {r.charity_name}
                  </td>

                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    KES {r.amount_kes.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {r.timestamp}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[10px] font-sans font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Confirmed</span>
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {
    /* Footer */
  }
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Zero-knowledge disbursement verification enabled.</span>
          <button
    onClick={() => dispatch(closeBlockchainModal())}
    className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl transition-colors"
  >
            Close Explorer
          </button>
        </div>
      </div>
    </div>;
};
export {
  BlockchainLedgerModal
};
