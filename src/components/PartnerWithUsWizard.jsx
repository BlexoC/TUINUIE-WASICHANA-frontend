import { useState } from "react";
import { X, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closePartnerWizard, applyForCharity } from "../store/slices/charitySlice";

// NOTE: fields here map exactly to CharityApplication on the backend
// (organization_name, description, mission_statement, registration_number,
// contact_email, contact_phone, address). Year established, org type,
// focus category, and a fundraising target aren't columns on that model —
// they've been dropped rather than collected and silently discarded.
// Document upload also isn't wired to any storage backend yet, so that
// step has been removed until a real upload endpoint exists.
const PartnerWithUsWizard = () => {
  const dispatch = useAppDispatch();
  const { partnerWizardOpen, applyStatus, applyError } = useAppSelector((state) => state.charity);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [missionStatement, setMissionStatement] = useState("");
  const [description, setDescription] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState("");

  if (!partnerWizardOpen) return null;
<<<<<<< HEAD

=======
  const handleSubmitApplication = () => {
    const newCharity = {
      id: `ch_app_${Date.now()}`,
      user_id: user?.id,
      name: name || "New Hope Girls Initiative",
      year_established: yearEstablished,
      org_type: orgType,
      mission_statement: missionStatement || "Empowering adolescent schoolgirls with essential hygiene kits and menstrual health counseling.",
      address: address || "Nairobi County, Kenya",
      email: email || "contact@newhope.org",
      phone: phone || "+254 712 000 111",
      website,
      contact_person: contactPerson || "Program Director",
      status: "pending",
      // Requires admin approval workflow
      category,
      tag: category,
      target_amount: Number(targetAmount) || 5e5,
      raised_amount: 0,
      currency: "KES",
      image_url: "/images/dignity_kits_1787607033508.jpg",
      what_they_do: missionStatement,
      how_it_started: `Established in ${yearEstablished} as a ${orgType} dedicated to eradicating school absenteeism due to period poverty.`,
      impact_summary: "Pending administrative verification & accreditation.",
      ngo_cert_name: ngoCert,
      audit_doc_name: auditDoc,
      director_id_name: directorId,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      beneficiaries_count: 0
    };
    dispatch(addCharityApplication(newCharity));
    dispatch(
      addNotification({
        title: "Charity Application Submitted",
        message: `Your application for "${newCharity.name}" has been received. Our compliance team will review your submitted documents.`,
        type: "account"
      })
    );
    setIsSubmitted(true);
  };
>>>>>>> a05ea03eacad7504cf83e5bd46e441dc47b10aef
  const handleClose = () => {
    setStep(1);
    dispatch(closePartnerWizard());
  };

  const handleSubmitApplication = () => {
    dispatch(
      applyForCharity({
        organization_name: organizationName,
        description,
        mission_statement: missionStatement,
        registration_number: registrationNumber || undefined,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        address: address || undefined,
      })
    );
  };

  const notEligible = !isAuthenticated || user?.role !== "charity";

  return (
    <div
      id="partner-wizard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="partner-wizard-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
      >
        <div className="p-6 sm:p-8 bg-purple-950 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-purple-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">Partner With Us</h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">
            Register your charity to fundraise, manage beneficiaries, and deliver impact.
          </p>

          {!notEligible && applyStatus !== "succeeded" && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-900/60 text-xs">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-white font-semibold" : "text-purple-300"}`}>
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">1</span>
                <span>Organization</span>
              </div>
              <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-white font-semibold" : "text-purple-300"}`}>
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">2</span>
                <span>Contact</span>
              </div>
              <div className={`flex items-center gap-1.5 ${step >= 3 ? "text-white font-semibold" : "text-purple-300"}`}>
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">3</span>
                <span>Review</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {notEligible ? (
            <div className="text-center py-8 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Charity account required</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {!isAuthenticated
                  ? "Register a charity account first, then come back here to submit your application."
                  : "This account isn't registered with the charity role, so it can't submit an application."}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-full text-sm"
              >
                Got it
              </button>
            </div>
          ) : applyStatus === "succeeded" ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-purple-100 text-purple-900 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Application Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to partner with Tuinue Wasichana. Your application has
                been queued for verification by platform administrators. You'll get a
                notification once it's reviewed.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-full shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {applyError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {applyError}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 1: Organization Details</h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Samburu Girls Literacy & Pad Bank"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NGO/2022/00123"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mission Statement *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="A short statement of your organization's mission..."
                      value={missionStatement}
                      onChange={(e) => setMissionStatement(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your goals, communities served, and program scope..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!organizationName.trim()}
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium rounded-full text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>Next: Contact Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 2: Contact Information</h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Physical Address / Operating County
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kilifi South County, Coast Region, Kenya"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        placeholder="info@yourcharity.org"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+254 712 345 678"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-full text-sm flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!contactEmail.trim()}
                      className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium rounded-full text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>Next: Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Step 3: Review Application</h3>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Organization:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {organizationName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Mission:</span>
                      <span className="text-slate-700">{missionStatement || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contact:</span>
                      <span className="text-slate-700">
                        {contactEmail} {contactPhone && `· ${contactPhone}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-full text-sm flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      id="btn-submit-charity-application"
                      onClick={handleSubmitApplication}
                      disabled={applyStatus === "loading"}
                      className="px-8 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full text-sm shadow-md flex items-center gap-2 disabled:opacity-60"
                    >
                      <span>{applyStatus === "loading" ? "Submitting…" : "Submit Application"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { PartnerWithUsWizard };
