import { useState } from "react";
import {
  X,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closePartnerWizard,
  addCharityApplication
} from "../store/slices/charitySlice";
import { addNotification } from "../store/slices/notificationSlice";
const PartnerWithUsWizard = () => {
  const dispatch = useAppDispatch();
  const { partnerWizardOpen } = useAppSelector((state) => state.charity);
  const { user } = useAppSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [yearEstablished, setYearEstablished] = useState("2022");
  const [orgType, setOrgType] = useState("Non-Governmental Organization (NGO)");
  const [missionStatement, setMissionStatement] = useState("");
  const [category, setCategory] = useState("Sanitary Distribution");
  const [targetAmount, setTargetAmount] = useState("500000");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+254 700 000 000");
  const [website, setWebsite] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [ngoCert, setNgoCert] = useState("ngo_certificate_registration.pdf");
  const [auditDoc, setAuditDoc] = useState("annual_financial_audit_2023.pdf");
  const [directorId, setDirectorId] = useState("national_id_director.pdf");
  const [isSubmitted, setIsSubmitted] = useState(false);
  if (!partnerWizardOpen) return null;
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
      image_url: "/src/assets/images/dignity_kits_1787607033508.jpg",
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
  const handleClose = () => {
    setIsSubmitted(false);
    setStep(1);
    dispatch(closePartnerWizard());
  };
  return <div
    id="partner-wizard-overlay"
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
  >
      <div
    id="partner-wizard-card"
    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
  >
        {
    /* Header matching Figma */
  }
        <div className="p-6 sm:p-8 bg-purple-950 text-white relative">
          <button
    onClick={handleClose}
    className="absolute top-6 right-6 p-2 text-purple-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Partner With Us
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">
            Register your charity to fundraise, manage beneficiaries, and deliver
            impact.
          </p>

          {
    /* Stepper tabs */
  }
          {!isSubmitted && <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-900/60 text-xs">
              <div
    className={`flex items-center gap-1.5 ${step >= 1 ? "text-white font-semibold" : "text-purple-300"}`}
  >
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Basic Info</span>
              </div>
              <div
    className={`flex items-center gap-1.5 ${step >= 2 ? "text-white font-semibold" : "text-purple-300"}`}
  >
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Contact</span>
              </div>
              <div
    className={`flex items-center gap-1.5 ${step >= 3 ? "text-white font-semibold" : "text-purple-300"}`}
  >
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Documents</span>
              </div>
              <div
    className={`flex items-center gap-1.5 ${step >= 4 ? "text-white font-semibold" : "text-purple-300"}`}
  >
                <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[10px]">
                  4
                </span>
                <span>Review</span>
              </div>
            </div>}
        </div>

        {
    /* Wizard Steps */
  }
        <div className="p-6 sm:p-8">
          {isSubmitted ? <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-purple-100 text-purple-900 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">
                Application Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to partner with Tuinue Wasichana. Your
                application has been queued for verification by platform
                administrators. You will be notified once approved.
              </p>
              <button
    onClick={handleClose}
    className="px-8 py-3 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-full shadow-xs transition-colors"
  >
                Done
              </button>
            </div> : <>
              {
    /* STEP 1: Basic Information */
  }
              {step === 1 && <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 1: Organization Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Organization Name *
                    </label>
                    <input
    type="text"
    placeholder="e.g. Samburu Girls Literacy & Pad Bank"
    value={name ?? ""}
    onChange={(e) => setName(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Year Established *
                      </label>
                      <input
    type="text"
    placeholder="2022"
    value={yearEstablished ?? ""}
    onChange={(e) => setYearEstablished(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Organization Type *
                      </label>
                      <select
    value={orgType ?? "Non-Governmental Organization (NGO)"}
    onChange={(e) => setOrgType(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  >
                        <option>Non-Governmental Organization (NGO)</option>
                        <option>Community Based Organization (CBO)</option>
                        <option>Educational Trust</option>
                        <option>Faith-Based Organization</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Focus Category *
                      </label>
                      <select
    value={category ?? "Sanitary Distribution"}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  >
                        <option>Sanitary Distribution</option>
                        <option>Urgent Need</option>
                        <option>Education</option>
                        <option>Sanitation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Target Goal (KES) *
                      </label>
                      <input
    type="number"
    placeholder="500000"
    value={targetAmount ?? ""}
    onChange={(e) => setTargetAmount(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mission Statement *
                    </label>
                    <textarea
    rows={3}
    placeholder="Describe your goals, communities served, and program scope..."
    value={missionStatement ?? ""}
    onChange={(e) => setMissionStatement(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
    onClick={() => setStep(2)}
    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium rounded-full text-sm flex items-center gap-2"
  >
                      <span>Next: Contact Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>}

              {
    /* STEP 2: Contact Information */
  }
              {step === 2 && <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 2: Contact Information
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Physical Address / Operating County *
                    </label>
                    <input
    type="text"
    placeholder="e.g. Kilifi South County, Coast Region, Kenya"
    value={address ?? ""}
    onChange={(e) => setAddress(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Primary Email *
                      </label>
                      <input
    type="email"
    placeholder="info@yourcharity.org"
    value={email ?? ""}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
    type="text"
    placeholder="+254 712 345 678"
    value={phone ?? ""}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Website URL
                      </label>
                      <input
    type="url"
    placeholder="https://yourcharity.org"
    value={website ?? ""}
    onChange={(e) => setWebsite(e.target.value)}
    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Primary Contact Person *
                      </label>
                      <input
    type="text"
    placeholder="e.g. Grace Muthoni (Director)"
    value={contactPerson ?? ""}
    onChange={(e) => setContactPerson(e.target.value)}
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
    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium rounded-full text-sm flex items-center gap-2"
  >
                      <span>Next: Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>}

              {
    /* STEP 3: Verification Documents */
  }
              {step === 3 && <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 3: Verification Documents
                  </h3>
                  <p className="text-xs text-slate-500">
                    To prevent fraud, all charities must upload government
                    registration documents before accepting donations.
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/40 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-purple-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            NGO Registration Certificate *
                          </p>
                          <p className="text-[11px] text-purple-900 font-medium">
                            {ngoCert} (Attached)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/40 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-purple-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Recent Financial Audit / Bank Statement *
                          </p>
                          <p className="text-[11px] text-purple-900 font-medium">
                            {auditDoc} (Attached)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/40 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-purple-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Director's National ID / Passport *
                          </p>
                          <p className="text-[11px] text-purple-900 font-medium">
                            {directorId} (Attached)
                          </p>
                        </div>
                      </div>
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
    onClick={() => setStep(4)}
    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-medium rounded-full text-sm flex items-center gap-2"
  >
                      <span>Next: Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>}

              {
    /* STEP 4: Review & Submit */
  }
              {step === 4 && <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Step 4: Review Application
                  </h3>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Organization:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {name || "New Charity Project"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block">Type:</span>
                        <span className="font-semibold text-slate-800">
                          {orgType}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Category:</span>
                        <span className="font-semibold text-slate-800">
                          {category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Mission:</span>
                      <span className="text-slate-700">
                        {missionStatement || "Providing essential menstrual hygiene support."}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-purple-900 font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>3 Verification documents validated & attached</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
    onClick={() => setStep(3)}
    className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-full text-sm flex items-center gap-2"
  >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
    id="btn-submit-charity-application"
    onClick={handleSubmitApplication}
    className="px-8 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full text-sm shadow-md flex items-center gap-2"
  >
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>}
            </>}
        </div>
      </div>
    </div>;
};
export {
  PartnerWithUsWizard
};
