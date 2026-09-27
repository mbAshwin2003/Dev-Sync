import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, Copy, ExternalLink, HelpCircle, X } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.79l7.97-6.2z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

const GoogleAuthButton = ({ onSuccess, onError }) => {
  const { loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const googleBtnContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  const hasClientId = Boolean(clientId && clientId !== 'your_google_oauth_client_id_here.apps.googleusercontent.com');

  const handleGoogleCredentialResponse = useCallback(async (response) => {
    if (!response.credential) {
      onError?.('No credential received from Google');
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
      onSuccess?.();
    } catch (err) {
      onError?.(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, onError, onSuccess]);

  useEffect(() => {
    if (!hasClientId) return;

    // Load Google Identity Services script
    const scriptId = 'google-gsi-client-script';
    let script = document.getElementById(scriptId);

    const initializeGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              type: 'standard',
              theme: theme === 'dark' ? 'filled_black' : 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: '100%',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google GSI initialization error:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initializeGsi();
    }
  }, [hasClientId, clientId, theme, handleGoogleCredentialResponse]);

  const handleCustomButtonClick = () => {
    if (hasClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setShowSetupModal(true);
    }
  };

  const handleTestDemoLogin = async () => {
    setLoading(true);
    setShowSetupModal(false);
    try {
      await loginWithGoogle(null, {
        name: 'Alex Rivera (Google Demo)',
        email: 'alex.rivera.google@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
      });
      onSuccess?.();
    } catch (err) {
      onError?.(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const copyConfigSnippet = () => {
    navigator.clipboard.writeText('VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* If official Google GSI button is rendered */}
      {hasClientId ? (
        <div style={{ position: 'relative', width: '100%', minHeight: '44px' }}>
          <div ref={googleBtnContainerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
          {loading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              color: '#fff',
              zIndex: 10
            }}>
              <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Verifying Google Sign-in...
            </div>
          )}
        </div>
      ) : (
        /* Fallback / Setup / Demo Button */
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '11px 16px',
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--card-border))',
            borderRadius: '10px',
            color: 'hsl(var(--foreground))',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'hsl(var(--primary))';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'hsl(var(--card-border))';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <GoogleIcon />
          )}
          <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(234, 67, 53, 0.15)',
            color: '#ff6b6b',
            marginLeft: 'auto'
          }}>
            OAuth Setup
          </span>
        </button>
      )}

      {/* Setup Guide & Demo Modal */}
      {showSetupModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            border: '1px solid hsl(var(--glass-border))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GoogleIcon />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Google Sign-In Setup</h3>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                style={{ background: 'none', border: 'none', color: 'hsl(var(--muted))', cursor: 'pointer', padding: '4px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'hsl(var(--muted))', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Google OAuth is fully implemented in the code! To connect your live Google account, add your Google OAuth Client ID to your <code>.env</code> file.
            </p>

            {/* Quick Demo Test Option */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#a855f7' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Test Flow Right Now (Demo Mode)</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--foreground))', opacity: 0.85, marginBottom: '14px' }}>
                Simulate a successful Google Sign-in to test the dashboard, user profile linking, and session persistence immediately.
              </p>
              <button
                type="button"
                onClick={handleTestDemoLogin}
                className="glow-btn"
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
              >
                <GoogleIcon />
                Sign In With Demo Google Account
              </button>
            </div>

            {/* Step-by-step Setup instructions */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} /> How to get your Google Client ID:
              </h4>

              <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', lineHeight: '1.6', color: 'hsl(var(--foreground))', opacity: 0.9 }}>
                <li style={{ marginBottom: '8px' }}>
                  Go to the{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'hsl(var(--primary))', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Google Cloud Console <ExternalLink size={12} />
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Create a new project or select an existing one, then configure the <strong>OAuth consent screen</strong>.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Navigate to <strong>Credentials &gt; Create Credentials &gt; OAuth client ID</strong>.
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Choose <strong>Web application</strong>. Under <strong>Authorized JavaScript origins</strong>, add:
                  <div style={{ background: 'hsl(var(--background))', padding: '6px 10px', borderRadius: '6px', margin: '6px 0', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    http://localhost:5173
                  </div>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Copy your <strong>Client ID</strong> and add it to your <code>frontend/.env</code> and <code>backend/.env</code>:
                </li>
              </ol>

              <div style={{
                position: 'relative',
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--card-border))',
                borderRadius: '8px',
                padding: '10px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                marginTop: '10px'
              }}>
                <div style={{ color: 'hsl(var(--muted))' }}># frontend/.env &amp; backend/.env</div>
                <div style={{ color: 'hsl(var(--primary))', wordBreak: 'break-all' }}>
                  VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
                </div>
                <button
                  type="button"
                  onClick={copyConfigSnippet}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: copied ? '#22c55e' : 'hsl(var(--muted))',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  <Copy size={13} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                className="theme-btn"
                onClick={() => setShowSetupModal(false)}
                style={{ padding: '8px 18px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
