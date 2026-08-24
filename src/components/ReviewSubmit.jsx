import React, { useState } from 'react';

function ReviewSubmit({ formData, previousStep }) {
  const [agreed, setAgreed] = useState(false);

  const handleFinalSubmit = (event) => {
    event.preventDefault();
    if (!agreed) return;
    
    alert("🎉 Application Submitted Successfully! Thank you for partnering with Tuinue Wasichana.");
    console.log("Final Registration Data Package Payload:", formData);
  };

  return (
    <form onSubmit={handleFinalSubmit}>
      <div className="form-heading">
        <h2>Partner with Us</h2>
        <p>Review and submit your application.</p>
      </div>

      <div className="review-summary-card">
        <h2 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📋 Application Review
        </h2>

        {/* Section: Org details */}
        <div className="review-data-section">
          <div className="review-section-header">
            <h3>Organization Details</h3>
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

        {/* Section: Contact info */}
        <div className="review-data-section">
          <div className="review-section-header">
            <h3>Contact Information</h3>
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

        {/* Section: Files summary */}
        <div className="review-data-section" style={{ border: 'none', padding: '0', marginBottom: '30px' }}>
          <div className="review-section-header">
            <h3>Uploaded Documents</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {formData.registrationCertificate && (
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
                📄 {formData.registrationCertificate.name}
              </div>
            )}
            {formData.financialAudit && (
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
                🏛️ {formData.financialAudit.name}
              </div>
            )}
            {formData.directorId && (
              <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
                🪪 {formData.directorId.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Declaration Checkbox Row layout */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', alignItems: 'flex-start' }}>
        <input 
          type="checkbox" 
          id="terms-agreed" 
          checked={agreed} 
          onChange={(e) => setAgreed(e.target.checked)} 
          style={{ width: 'auto', marginTop: '4px', cursor: 'pointer' }}
          required
        />
        <label htmlFor="terms-agreed" style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.4', fontWeight: '400', cursor: 'pointer' }}>
          I confirm that the information provided is accurate and true to the best of my knowledge. I agree to the <strong>Terms and Conditions</strong> and <strong>Privacy Policy</strong> of Tuinue Wasichana.
        </label>
      </div>

      {/* Lower Navigation Footer Options */}
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={previousStep}>
          Previous
        </button>
        <button 
          type="submit" 
          className="primary-button" 
          disabled={!agreed}
          style={{ opacity: agreed ? 1 : 0.6 }}
        >
          Submit Application 🚀
        </button>
      </div>
    </form>
  );
}

export default ReviewSubmit;
