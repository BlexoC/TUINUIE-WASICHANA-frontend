import React from "react";
import { X, Copy, Check, Share2, MessageCircle, Twitter, Linkedin, Facebook } from "lucide-react";
import { useToast } from "./ToastContext";
const ShareModal = ({ charity, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);
  if (!isOpen || !charity) return null;
  const shareUrl = `https://tuinuewasichana.or.ke/campaign/${charity.id}`;
  const shareText = `Join me in supporting ${charity.name} on Tuinue Wasichana! We are providing adolescent schoolgirls in Kenya with dignity kits and menstrual health support so they never miss school:`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Campaign link copied to clipboard!");
      setTimeout(() => setCopied(false), 3e3);
    } catch {
      showToast("Copied link: " + shareUrl);
    }
  };
  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      "_blank"
    );
  };
  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };
  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };
  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Share This Campaign
            </h3>
          </div>
          <button
    onClick={onClose}
    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
    aria-label="Close"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-sm text-slate-600">
            Inspire your community to end period poverty. Sharing raises 3x more support for{" "}
            <strong className="text-slate-900">{charity.name}</strong>.
          </p>
        </div>

        {
    /* Social Buttons Grid */
  }
        <div className="grid grid-cols-2 gap-3">
          <button
    onClick={handleWhatsApp}
    className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-sm hover:bg-emerald-100 transition-colors"
  >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
    onClick={handleTwitter}
    className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
  >
            <Twitter className="w-4 h-4" />
            <span>X (Twitter)</span>
          </button>

          <button
    onClick={handleFacebook}
    className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-sm hover:bg-blue-100 transition-colors"
  >
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>Facebook</span>
          </button>

          <button
    onClick={handleLinkedIn}
    className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-sky-50 text-sky-800 border border-sky-200 font-semibold text-sm hover:bg-sky-100 transition-colors"
  >
            <Linkedin className="w-4 h-4 text-sky-600" />
            <span>LinkedIn</span>
          </button>
        </div>

        {
    /* Copy Link Input */
  }
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Or copy direct campaign link:
          </label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-3">
            <input
    type="text"
    readOnly
    value={shareUrl}
    className="bg-transparent text-xs text-slate-700 font-mono w-full focus:outline-none truncate"
  />
            <button
    onClick={handleCopyLink}
    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${copied ? "bg-emerald-700 text-white" : "bg-purple-900 text-white hover:bg-purple-800"}`}
  >
              {copied ? <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </> : <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export {
  ShareModal
};
