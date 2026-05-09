import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getServerSession } from "../../lib/server-session";
import { AppSidebar } from "#/components/app-sidebar";
import { SidebarProvider } from "#/components/ui/sidebar";

export const Route = createFileRoute("/$slug")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();
    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { slug } = Route.useParams();
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <main className="flex-1">
        <div className="p-4 border-b bg-sidebar h-16 flex items-center justify-start sticky top-0">
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
