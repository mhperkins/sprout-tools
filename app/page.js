"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { initWindowStorage, setStorageUser } from "@/lib/storage";
import GrantTool from "@/components/GrantManager";
import SocialManager from "@/components/SocialManager";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("home"); // "home" | "grants" | "social"

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setStorageUser(session.user.id);
        initWindowStorage();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setStorageUser(session.user.id);
        initWindowStorage();
      } else {
        setUser(null);
        setActiveTool("home");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthError("Check your email for a confirmation link!");
      }
    } catch (err) {
      setAuthError(err.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveTool("home");
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#F7F3EC", fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
          <p style={{ color: "#5A6B40" }}>Loading Sprout Society...</p>
        </div>
      </div>
    );
  }

  // ── Auth Screen ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#F7F3EC",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "48px 40px",
          boxShadow: "0 8px 32px rgba(45,80,22,0.12)", maxWidth: 420, width: "100%",
          border: "1px solid #D4DEAD"
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
            <h1 style={{
              fontFamily: "'Lora', serif", fontSize: 24, color: "#2D5016", marginBottom: 4
            }}>
              Sprout Society
            </h1>
            <p style={{ color: "#5A6B40", fontSize: 14 }}>Tools & Dashboard</p>
          </div>

          <div style={{
            display: "flex", gap: 4, marginBottom: 24, background: "#E8DFC8",
            padding: 4, borderRadius: 10
          }}>
            <button onClick={() => setAuthMode("login")} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
              background: authMode === "login" ? "#fff" : "transparent",
              color: authMode === "login" ? "#2D5016" : "#5A6B40",
              fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              boxShadow: authMode === "login" ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
            }}>
              Log In
            </button>
            <button onClick={() => setAuthMode("signup")} style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
              background: authMode === "signup" ? "#fff" : "transparent",
              color: authMode === "signup" ? "#2D5016" : "#5A6B40",
              fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              boxShadow: authMode === "signup" ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
            }}>
              Sign Up
            </button>
          </div>

          <div>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 13, fontWeight: 600, color: "#5A6B40", marginBottom: 6
              }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@sproutsociety.org"
                style={{
                  width: "100%", padding: "12px 14px", border: "1.5px solid #D4DEAD",
                  borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 13, fontWeight: 600, color: "#5A6B40", marginBottom: 6
              }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleAuth(e)}
                style={{
                  width: "100%", padding: "12px 14px", border: "1.5px solid #D4DEAD",
                  borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            {authError && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13,
                background: authError.includes("Check your email") ? "#DCFCE7" : "#FEE2E2",
                color: authError.includes("Check your email") ? "#166534" : "#991B1B"
              }}>
                {authError}
              </div>
            )}

            <button onClick={handleAuth} disabled={authLoading} style={{
              width: "100%", padding: "14px", background: "#2D5016", color: "#fff",
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
              cursor: authLoading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              opacity: authLoading ? 0.7 : 1
            }}>
              {authLoading ? "..." : authMode === "login" ? "Log In" : "Create Account"}
            </button>
          </div>

          <p style={{
            textAlign: "center", marginTop: 20, fontSize: 12, color: "#8A9B72"
          }}>
            {authMode === "login"
              ? "Don't have an account? Click Sign Up above."
              : "Already have an account? Click Log In above."}
          </p>
        </div>
      </div>
    );
  }

  // ── Tool Router ────────────────────────────────────────────────────────
  if (activeTool === "grants") {
    return <GrantTool onLogout={handleLogout} userEmail={user.email} onSwitchTool={setActiveTool} />;
  }

  if (activeTool === "social") {
    return <SocialManager onLogout={handleLogout} userEmail={user.email} onSwitchTool={setActiveTool} />;
  }

  // ── Tool Hub (Home) ────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#F7F3EC",
      fontFamily: "'DM Sans', sans-serif", padding: "60px 24px"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🌱</div>
          <h1 style={{
            fontFamily: "'Lora', serif", fontSize: 36, color: "#2D5016",
            marginBottom: 8, fontWeight: 700
          }}>
            Sprout Society
          </h1>
          <p style={{ color: "#5A6B40", fontSize: 16, lineHeight: 1.6 }}>
            Your organization hub. Pick a tool to get started.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
          {/* Grant Manager */}
          <div
            onClick={() => setActiveTool("grants")}
            style={{
              background: "#fff", borderRadius: 20, padding: "32px 28px",
              border: "2px solid #D4DEAD", cursor: "pointer",
              transition: "all 0.2s", boxShadow: "0 2px 12px rgba(45,80,22,0.08)",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#7A9E5B"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,80,22,0.15)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#D4DEAD"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(45,80,22,0.08)"; }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: "#DCFCE7",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 16
            }}>📋</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#2D5016", marginBottom: 8 }}>Grant Manager</h2>
            <p style={{ color: "#5A6B40", fontSize: 14, lineHeight: 1.6 }}>
              Find grants, track applications, manage deadlines, and build winning proposals with AI assistance.
            </p>
            <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, color: "#7A9E5B", fontWeight: 600, fontSize: 14 }}>
              Open Tool →
            </div>
          </div>

          {/* Social Manager */}
          <div
            onClick={() => setActiveTool("social")}
            style={{
              background: "#fff", borderRadius: 20, padding: "32px 28px",
              border: "2px solid #D4DEAD", cursor: "pointer",
              transition: "all 0.2s", boxShadow: "0 2px 12px rgba(45,80,22,0.08)",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#7A9E5B"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,80,22,0.15)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#D4DEAD"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(45,80,22,0.08)"; }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: "#F5F3FF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 16
            }}>📱</div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, color: "#2D5016", marginBottom: 8 }}>Social Manager</h2>
            <p style={{ color: "#5A6B40", fontSize: 14, lineHeight: 1.6 }}>
              Plan content, schedule posts, manage approvals, publish to Instagram, and track performance.
            </p>
            <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, color: "#7A9E5B", fontWeight: 600, fontSize: 14 }}>
              Open Tool →
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid #D4DEAD" }}>
          <p style={{ color: "#8A9B72", fontSize: 12, marginBottom: 8 }}>
            Logged in as {user.email}
          </p>
          <button onClick={handleLogout} style={{
            background: "transparent", border: "1.5px solid #D4DEAD", color: "#5A6B40",
            borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
          }}
            onMouseOver={e => { e.target.style.borderColor = "#7A9E5B"; e.target.style.color = "#2D5016"; }}
            onMouseOut={e => { e.target.style.borderColor = "#D4DEAD"; e.target.style.color = "#5A6B40"; }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
