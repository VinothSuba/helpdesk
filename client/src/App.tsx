import { useSession, signOut } from "@/lib/auth-client.ts";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { Button } from "@/components/ui/button.tsx";

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background px-6 py-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Helpdesk</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {session.user.name} ({session.user.email})
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </header>
      <p className="mt-8 text-muted-foreground">
        Welcome back. Tickets coming soon.
      </p>
    </div>
  );
}
