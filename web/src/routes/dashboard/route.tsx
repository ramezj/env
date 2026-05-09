import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "../../lib/auth-client";
import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

const fetchServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const { data: session } = await getSession({
      fetchOptions: {
        headers: headers,
      },
    });
    return session;
  },
);

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await fetchServerSession();
    if (!session?.user) {
      throw redirect({
        to: "/sign-up",
      });
    }
    return {
      session,
    };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { session } = Route.useRouteContext();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold tracking-tight">EnvProject</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
            activeOptions={{ exact: true }}
          >
            Overview
          </Link>
          <Link
            to="/dashboard/teams"
            className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
          >
            Teams
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="text-sm font-medium">{session.user.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {session.user.email}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
