import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "../../lib/auth-client";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

const fetchServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const { data: session } = await getSession({
      fetchOptions: {
        headers: headers as any,
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
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 border-b bg-sidebar h-16 flex items-center justify-start">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          {/* <SidebarTrigger /> */}
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
