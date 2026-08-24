import React, { useState } from 'react';

function ReviewSubmit({ formData, previousStep, jumpToStep }) {
  const [agreed, setAgreed] = useState(false);

  const handleFinalSubmit = (event) => {
    event.preventDefault();
    if (!agreed) return;
    
    alert("🎉 Application Submitted Successfully! Thank you for partnering with Tuinue Wasichana.");
    console.log("Final Registration Data Package Payload:", formData);
  };

  return (
    <div className="registration-card-wrapper review-page-container">
      <form onSubmit={handleFinalSubmit}>
        
        {/* Page Title & Subtitle Context */}
        <div className="review-title-section">
          <h2>Partner with Us</h2>
          <p>Review and submit your application.</p>
        </div>

        {/* Main Review Section Header */}
        <div className="review-main-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="purple-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h3>Application Review</h3>
        </div>

        {/* 1. ORGANIZATION DETAILS SECTION */}
        <div className="review-data-section">
          <div className="review-section-header">
            <h3>Organization Details</h3>
            <button type="button" className="review-edit-trigger" onClick={() => jumpToStep(1)}>
              <span>✏️</span> Edit
            </button>
          </div>
          <div className="review-grid-data">
            <div>
              <div className="review-item-label">Organization Name</div>
              <div className="review-item-value">{formData.organizationName || "Not Provided"}</div>
            </div>
            <div>
              <div className="review-item-label">Year Established</div>
              <div className="review-item-value">{formData.yearEstablished || "Not Provided"}</div>
            </div>
            <div>
              <div className="review-item-label">Organization Type</div>
              <div className="review-item-value" style={{ textTransform: 'uppercase' }}>{formData.organizationType || "Not Provided"}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="review-item-label">Mission Statement</div>
              <div className="review-item-value" style={{ fontWeight: '400', lineHeight: '1.5' }}>{formData.mission || "Not Provided"}</div>
            </div>
          </div>
        </div>

        {/* 2. CONTACT INFORMATION SECTION */}
        <div className="review-data-section">
          <div className="review-section-header">
            <h3>Contact Information</h3>
            <button type="button" className="review-edit-trigger" onClick={() => jumpToStep(2)}>
              <span>✏️</span> Edit
            </button>
          </div>
          <div className="review-grid-data">
            <div>
              <div className="review-item-label">Primary Contact Name</div>
              <div className="review-item-value">{formData.contactPerson || "Not Provided"}</div>
            </div>
            <div>
              <div className="review-item-label">Primary Email</div>
              <div className="review-item-value">{formData.email || "Not Provided"}</div>
            </div>
            <div>
              <div className="review-item-label">Phone Number</div>
              <div className="review-item-value">{formData.phone || "Not Provided"}</div>
            </div>
            <div>
              <div className="review-item-label">Website URL</div>
              <div className="review-item-value">{formData.website || "None Provided"}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="review-item-label">Physical Address</div>
              <div className="review-item-value">{formData.address || "Not Provided"}</div>
            </div>
          </div>
        </div>

        {/* 3. UPLOADED DOCUMENTS SECTION */}
        <div className="review-data-section" style={{ border: 'none', paddingBottom: '0', marginBottom: '10px' }}>
          <div className="review-section-header">
            <h3>Uploaded Documents</h3>
            <button type="button" className="review-edit-trigger" onClick={() => jumpToStep(3)}>
              <span>✏️</span> Edit
            </button>
          </div>
          
          <div className="review-documents-list">
            {formData.registrationCertificate && (
              <div className="review-doc-row">
                <div className="doc-info">
                  <span className="doc-icon">📄</span>
                  <span className="doc-name">{formData.registrationCertificate.name}</span>
                </div>
                <span className="doc-size">1.2 MB</span>
              </div>
            )}

            {formData.financialAudit && (
              <div className="review-doc-row">
                <div className="doc-info">
                  <span className="doc-icon">🏛️</span>
                  <span className="doc-name">{formData.financialAudit.name}</span>
                </div>
                <span className="doc-size">850 KB</span>
              </div>
            )}

            {formData.directorId && (
              <div className="review-doc-row">
                <div className="doc-info">
                  <span className="doc-icon">🪪</span>
                  <span className="doc-name">{formData.directorId.name}</span>
                </div>
                <span className="doc-size">500 KB</span>
              </div>
            )}
          </div>
        </div>

        {/* Declaration Checkbox Row Layout */}
        <div className="terms-checkbox-container">
          <input 
            type="checkbox" 
            id="terms-agreed" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)} 
            required
          />
          <label htmlFor="terms-agreed">
            I confirm that the information provided is accurate and true to the best of my knowledge. I agree to the <span className="purple-link-text">Terms and Conditions</span> and <span className="purple-link-text">Privacy Policy</span> of Tuinue Wasichana.
          </label>
        </div>

        {/* Lower Navigation Footer Options */}
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={previousStep}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Previous
          </button>
          
          <button 
            type="submit" 
            className="primary-button submit-app-btn" 
            disabled={!agreed}
            style={{ opacity: agreed ? 1 : 0.6 }}
          >
            Submit Application
            <span className="play-arrow-icon">▷</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewSubmit;
