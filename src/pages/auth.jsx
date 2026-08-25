import React from 'react';
import '../styles/auth.css';

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

function UsersIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Auth({ onAdmin, onUser, onRegister }) {
  return (
    <div className="auth-welcome-page">
      <div className="welcome-card">
        <h1>Welcome!!!</h1>

        <p className="welcome-subtitle">
          Login to continue your journey
          <br />
          with Tuinue Wasichana
        </p>

        <p className="role-heading">
          I am logging in as
        </p>

        <div className="role-options">

          {/* ADMIN */}
          <button
            className="role-option"
            type="button"
            onClick={onAdmin}
          >
            <div className="role-number admin-number">
              1
            </div>

            <div className="role-icon admin-icon">
              <UserIcon />
            </div>

            <div className="role-text">
              <strong>Admin</strong>
              <span>
                Manage platform and users
              </span>
            </div>
          </button>


          {/* USER */}
          <button
            className="role-option"
            type="button"
            onClick={onUser}
          >
            <div className="role-number user-number">
              2
            </div>

            <div className="role-icon user-icon">
              <UserIcon />
            </div>

            <div className="role-text">
              <strong>User</strong>
              <span>
                Login to your account
              </span>
            </div>
          </button>


          {/* REGISTER */}
          <button
            className="role-option"
            type="button"
            onClick={onRegister}
          >
            <div className="role-number register-number">
              3
            </div>

            <div className="role-icon register-icon">
              <UsersIcon />
            </div>

            <div className="role-text">
              <strong>Register</strong>
              <span>
                Create a new account
              </span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

export default Auth;