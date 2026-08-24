import React from 'react';

function ContactInformation({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    updateFormData({
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Partner with Us</h2>
        <p>Provide the official contact details for your organization.</p>
      </div>

      {/* Physical Address Row (Full Width) */}
      <div className="form-group">
        <label htmlFor="address">Physical Address</label>
        <div className="input-with-icon">
          <span className="input-icon-anchor">📍</span>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="e.g., 123 Main St, Suite 400, City"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Split Row for Primary Email and Phone Number */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Primary Email</label>
          <div className="input-with-icon">
            <span className="input-icon-anchor">✉️</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="org@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-with-icon">
            <span className="input-icon-anchor">📞</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Website URL Row (Full Width) */}
      <div className="form-group">
        <label htmlFor="website">Website URL</label>
        <div className="input-with-icon">
          <span className="input-icon-anchor">🌐</span>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.yourorganization.org"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Primary Contact Person Row (Full Width) */}
      <div className="form-group">
        <label htmlFor="contactPerson">Primary Contact Person</label>
        <div className="input-with-icon">
          <span className="input-icon-anchor">👤</span>
          <input
            id="contactPerson"
            name="contactPerson"
            type="text"
            placeholder="Full Name of Contact"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Navigation Buttons Row */}
      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={previousStep}
        >
          ← Previous
        </button>
        
        <button
          type="submit"
          className="primary-button"
        >
          Next Step →
        </button>
      </div>
    </form>
  );
}

export default ContactInformation;
