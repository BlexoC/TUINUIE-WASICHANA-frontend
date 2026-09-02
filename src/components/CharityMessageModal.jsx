import { useState } from "react";
import { X, MessageSquare, Send, User, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeMessageModal, sendCharityMessage } from "../store/slices/charitySlice";
import { useToast } from "./ToastContext";

// NOTE: there is no backend table for charity-donor messaging yet, so
// sendCharityMessage only stores this in the current browser session
// (see charitySlice.js). It will not survive a refresh or reach the
// charity in real life until a real messages endpoint exists.
const CharityMessageModal = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { isMessageModalOpen, activeMessageCharity } = useAppSelector(
    (state) => state.charity
  );
  const { user } = useAppSelector((state) => state.auth);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  if (!isMessageModalOpen || !activeMessageCharity) return null;
  const charity = activeMessageCharity;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      charity_id: charity.id,
      charity_name: charity.name,
      sender_name: user?.username || "Amina Kimani (Donor)",
      sender_email: user?.email || "amina.kimani@example.org",
      sender_role: user?.role || "donor",
      subject: subject.trim(),
      message: message.trim(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    dispatch(sendCharityMessage(newMsg));
    showToast(`Inquiry saved for this session (no messaging backend yet) — ${charity.name}`);
    setSubject("");
    setMessage("");
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {
    /* Header */
  }
        <div className="bg-purple-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-purple-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif leading-tight">
                Message Project Coordinator
              </h3>
              <p className="text-xs text-purple-200 truncate max-w-65">
                {charity.name}
              </p>
            </div>
          </div>

          <button
    onClick={() => dispatch(closeMessageModal())}
    className="p-2 text-slate-300 hover:text-white rounded-xl transition-colors"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Coordinator Info Pill */
  }
        <div className="p-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-xs text-purple-950">
          <div className="flex items-center gap-2 font-medium">
            <User className="w-3.5 h-3.5 text-purple-700" />
            <span>Lead: <strong>{charity.contact_person}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Avg. reply: ~24 hrs</span>
          </div>
        </div>

        {
    /* Form */
  }
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject / Topic
            </label>
            <input
    type="text"
    required
    placeholder="e.g. Question regarding upcoming term distribution or school visit"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-700 focus:bg-white transition-all font-medium"
  />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Message
            </label>
            <textarea
    required
    rows={4}
    placeholder="Write your note of encouragement, inquiry, or question for the grassroots team..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-700 focus:bg-white transition-all resize-none font-medium"
  />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
    type="button"
    onClick={() => dispatch(closeMessageModal())}
    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
  >
              Cancel
            </button>

            <button
    type="submit"
    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
  >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export {
  CharityMessageModal
};