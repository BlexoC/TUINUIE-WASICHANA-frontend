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
    <form onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Verification Documents</h2>
        <p>Please upload official documents to verify your organization's status. We ensure all submitted data is handled with professional care and dignity.</p>
      </div>

      {/* Document Upload Module 1 */}
      <div className="form-group">
        <label>NGO Registration Certificate *</label>
        <div className="upload-container-box">
          <span className="upload-graphic-icon">📁</span>
          <p className="upload-label-text">
            {formData.registrationCertificate 
              ? `✅ ${formData.registrationCertificate.name}` 
              : <>Click to upload or <span>drag and drop</span></>}
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
          <span className="upload-graphic-icon">🏛️</span>
          <p className="upload-label-text">
            {formData.financialAudit 
              ? `✅ ${formData.financialAudit.name}` 
              : <>Click to upload or <span>drag and drop</span></>}
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
          <span className="upload-graphic-icon">🪪</span>
          <p className="upload-label-text">
            {formData.directorId 
              ? `✅ ${formData.directorId.name}` 
              : <>Click to upload or <span>drag and drop</span></>}
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
  );
}

export default VerificationDocuments;
