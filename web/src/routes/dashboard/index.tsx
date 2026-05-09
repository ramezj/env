import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { session } = Route.useRouteContext();

  return (
    <div className="max-w-5xl p-6 md:p-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {session.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground flex flex-col items-start space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Organizations & Teams</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your teams, invite members, and configure settings.
            </p>
          </div>
          <Button asChild className="mt-auto">
            <Link to="/dashboard/teams">Manage Teams</Link>
          </Button>
        </div>

        <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground flex flex-col items-start space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Session Info</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your current session payload.
            </p>
          </div>
          <pre className="mt-auto bg-muted p-4 rounded-md text-xs overflow-x-auto w-full">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
