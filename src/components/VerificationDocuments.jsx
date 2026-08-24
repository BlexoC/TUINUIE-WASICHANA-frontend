import React from 'react';

function VerificationDocuments({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  
  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      updateFormData({ [fieldName]: file });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    nextStep();
  };

  return (
    <div className="registration-card-wrapper">
      {/* Top Badge and Step Counter Rows from Figma */}
      <div className="card-top-meta">
        <span className="partner-badge">PARTNER WITH US</span>
        <span className="step-counter">Step 3 of 4</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-heading">
          <h2>Verification Documents</h2>
          <p>Please upload official documents to verify your organization's status. We ensure all submitted data is handled with professional care and dignity.</p>
        </div>

        {/* Document Upload Module 1 */}
        <div className="form-group">
          <label>NGO Registration Certificate *</label>
          <div className="upload-container-box">
            {/* Custom Purple SVG Folder Icon */}
            <svg className="upload-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="upload-label-text">
              {formData.registrationCertificate 
                ? `✅ ${formData.registrationCertificate.name}` 
                : <>Click to upload or <span className="purple-link">drag and drop</span></>}
            </p>
            <span className="upload-constraints-hint">PDF, JPG, PNG (Max. 10MB)</span>
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'registrationCertificate')}
              required={!formData.registrationCertificate}
            />
          </div>
        </div>

        {/* Document Upload Module 2 */}
        <div className="form-group">
          <label>Recent Financial Audit *</label>
          <div className="upload-container-box">
            {/* Custom Purple SVG Bank/Institution Icon */}
            <svg className="upload-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 22h18M6 18V11m5 7V11m5 7V11M12 2L2 7h20L12 2z"></path>
            </svg>
            <p className="upload-label-text">
              {formData.financialAudit 
                ? `✅ ${formData.financialAudit.name}` 
                : <>Click to upload or <span className="purple-link">drag and drop</span></>}
            </p>
            <span className="upload-constraints-hint">PDF (Max. 15MB)</span>
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'financialAudit')}
              required={!formData.financialAudit}
            />
          </div>
        </div>

        {/* Document Upload Module 3 */}
        <div className="form-group">
          <label>Director ID Copy *</label>
          <div className="upload-container-box">
            {/* Custom Purple SVG ID Card Icon */}
            <svg className="upload-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <circle cx="9" cy="10" r="2"></circle>
              <path d="M15 8h4m-4 4h4m-7 4h7"></path>
            </svg>
            <p className="upload-label-text">
              {formData.directorId 
                ? `✅ ${formData.directorId.name}` 
                : <>Click to upload or <span className="purple-link">drag and drop</span></>}
            </p>
            <span className="upload-constraints-hint">PDF, JPG, PNG (Max. 5MB)</span>
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'directorId')}
              required={!formData.directorId}
            />
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={previousStep}>
            ← Previous
          </button>
          <button type="submit" className="primary-button">
            Next Step →
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerificationDocuments;

