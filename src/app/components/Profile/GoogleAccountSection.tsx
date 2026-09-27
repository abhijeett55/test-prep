import type { ConnectedAccount } from "./types";
import "./Profile.css";

type GoogleAccountSectionProps = {
  account: ConnectedAccount;
};

// Identical for every role — connect/disconnect a Google account.
export default function GoogleAccountSection({ account }: GoogleAccountSectionProps) {
  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <h2 className="profile-section-title">Google account</h2>
        <button
          type="button"
          className={account.connected ? "profile-danger-button" : "profile-primary-button"}
          onClick={account.onConnectToggle}
        >
          {account.connected ? "Disconnect Google account" : "Connect Google account"}
        </button>
      </div>
      <p className="profile-section-subtitle">Sign in using your Google account.</p>

      {account.connected && (
        <div className="google-account-row">
          {account.avatarUrl ? (
            <img src={account.avatarUrl} alt="" className="google-avatar" />
          ) : (
            <div className="google-avatar google-avatar-fallback">{account.name.charAt(0)}</div>
          )}
          <div>
            <div className="google-account-name">{account.name}</div>
            <div className="google-account-email">{account.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}