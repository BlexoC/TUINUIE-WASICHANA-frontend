import { useState } from "react";
// Fixed imports: Removed the non-existent subfolder path
import RegistrationHeader from "../components/RegistrationHeader";
import RegistrationSteps from "../components/RegistrationSteps";
import BasicInformation from "../components/BasicInformation";
import ContactInformation from "../components/ContactInformation";
import VerificationDocuments from "../components/VerificationDocuments";
import ReviewSubmit from "../components/ReviewSubmit";
import "../styles/charity-registration.css";

function CharityRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    organizationName: "",
    yearEstablished: "",
    organizationType: "",
    mission: "",

    address: "",
    email: "",
    phone: "",
    website: "",
    contactPerson: "",

    registrationCertificate: null,
    financialAudit: null,
    directorId: null,
  });

  const updateFormData = (data) => {
    setFormData((previous) => ({
      ...previous,
      ...data,
    }));
  };

  const nextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, 4));
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  return (
    <div className="registration-page">
      <RegistrationHeader />

      <main className="registration-container">
        <div className="registration-intro">
          <h1>Partner With Us</h1>
          <p>
            Join Tuinue Wasichana in creating a brighter future for girls
            through meaningful partnerships and community impact.
          </p>
        </div>

        <RegistrationSteps currentStep={currentStep} />

        <div className="registration-form">
          {currentStep === 1 && (
            <BasicInformation
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <ContactInformation
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              previousStep={previousStep}
            />
          )}

          {currentStep === 3 && (
            <VerificationDocuments
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              previousStep={previousStep}
            />
          )}

          {currentStep === 4 && (
            <ReviewSubmit
              formData={formData}
              previousStep={previousStep}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default CharityRegistration;
