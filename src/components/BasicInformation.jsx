import React from 'react';

function BasicInformation({
  formData,
  updateFormData,
  nextStep,
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
        <h2>Basic Information</h2>

        <p>
          Tell us about your organization and its core mission.
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="organizationName">
          Organization Name
        </label>
        {/* Wrapped input layout with inline graphic support wrapper */}
        <div className="input-with-icon">
          <span className="input-icon-anchor">🏢</span>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            placeholder="e.g., Global Education Trust"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="yearEstablished">
            Year Established
          </label>
          {/* Wrapped input layout with inline graphic support wrapper */}
          <div className="input-with-icon">
            <span className="input-icon-anchor">📅</span>
            <input
              id="yearEstablished"
              name="yearEstablished"
              type="text" // Kept as text to display YYYY hint values clearly
              placeholder="YYYY"
              value={formData.yearEstablished}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizationType">
            Organization Type
          </label>

          <select
            id="organizationType"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            required
          >
            <option value="">
              Select type...
            </option>

            <option value="ngo">
              Non-Profit Organization (NGO)
            </option>

            <option value="trust">
              Charitable Trust
            </option>

            <option value="foundation">
              Foundation
            </option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="mission">
          Mission Statement
        </label>

        <textarea
          id="mission"
          name="mission"
          rows="4"
          placeholder="Briefly describe your organization's primary goals and who you serve..."
          value={formData.mission}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
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

export default BasicInformation;
