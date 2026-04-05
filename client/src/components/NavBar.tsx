import { NavLink } from "react-router-dom";
import { useSession, signOut } from "@/lib/auth-client.ts";
import { Button } from "@/components/ui/button.tsx";

export function NavBar() {
  const { data: session } = useSession();

  if (!session) return null;

  const role = (session.user as { role?: string }).role;
  const isAdmin = role === "admin";

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold">Helpdesk</h1>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`
            }
          >
            Dashboard
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `text-sm ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Users
            </NavLink>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {session.user.name} ({session.user.email})
        </span>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
