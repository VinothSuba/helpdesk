import { useSession, signOut } from "./lib/auth-client.ts";
import { LoginPage } from "./pages/LoginPage.tsx";

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Helpdesk</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>{session.user.name} ({session.user.email})</span>
          <button
            onClick={() => signOut()}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Sign out
          </button>
        </div>
      </header>
      <p style={{ color: "#666", marginTop: "2rem" }}>Welcome back. Tickets coming soon.</p>
    </div>
  );
}
