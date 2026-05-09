import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "../../lib/auth-client";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
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
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
