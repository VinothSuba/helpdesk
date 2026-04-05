import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@/lib/auth-client.ts";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { DashboardPage } from "@/pages/DashboardPage.tsx";
import { UsersPage } from "@/pages/UsersPage.tsx";
import { NavBar } from "@/components/NavBar.tsx";
import { RequireRole } from "@/components/RequireRole.tsx";

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="px-6 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/users"
            element={
              <RequireRole role="admin">
                <UsersPage />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {session ? <AuthenticatedLayout /> : <LoginPage />}
    </BrowserRouter>
  );
}
