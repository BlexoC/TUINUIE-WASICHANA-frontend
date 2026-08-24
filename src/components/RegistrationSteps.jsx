
import React from 'react';

function RegistrationSteps({ currentStep }) {
  const steps = [
    {
      number: 1,
      title: "Basic Info", 
    },
    {
      number: 2,
      title: "Contact",
    },
    {
      number: 3,
      title: "Verification",
    },
    {
      number: 4,
      title: "Submit",
    },
  ];

  const calculateProgressBarWidth = () => {
    if (currentStep === 1) return '0%';
    if (currentStep === 2) return '33.33%';
    if (currentStep === 3) return '66.66%';
    return '100%';
  };

  return (
    <div className="registration-steps">
      <div className="steps-progress-track">
        <div 
          className="steps-progress-bar" 
          style={{ width: calculateProgressBarWidth() }}
        ></div>
      </div>

      {/* Dynamic looping of individual step items */}
      {steps.map((step) => (
        <div
          key={step.number}
          className={`registration-step ${
            currentStep === step.number ? "active" : ""
          } ${
            currentStep > step.number ? "completed" : ""
          }`}
        >
          <div className="step-circle">
            {currentStep > step.number ? "✓" : step.number}
          </div>

          <span>{step.title}</span>
        </div>
      ))}
    </div>
  );
}

export default RegistrationSteps;
