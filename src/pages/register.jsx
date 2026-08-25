import React, { useState } from 'react';
import '../styles/login.css';

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Register({ onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Account registration:', {
      email,
      password,
    });
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* BACK BUTTON */}
        <button
          type="button"
          className="login-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="login-header">

          <div className="login-icon">
            <UserIcon />
          </div>

          <h1>Create your account</h1>

          <p>
            Create an account to get started
          </p>

        </div>

        {/* FORM */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="register-email">
              Email
            </label>

            <div className="input-wrapper">

              <UserIcon />

              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <div className="input-wrapper">

              <LockIcon />

              <input
                id="register-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>

          </div>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            className="login-submit-button"
          >
            Create Account
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;