import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import { useTeams } from "../../queries/teams.queries";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  const { session } = Route.useRouteContext();
  const { data: teams, isLoading, error } = useTeams();

  return (
    <div className="max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Choose a Team</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {session.user.name}. Pick an organization to open its
          workspace.
        </p>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground mt-8">Loading teams...</div>
      ) : error ? (
        <div className="text-sm text-destructive mt-8">
          Error loading teams: {error.message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {teams?.length ? (
            teams.map((team) => (
              <div
                key={team.id}
                className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-xl font-semibold">{team.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    /{team.slug}
                  </p>
                </div>
                <Button asChild className="mt-auto w-full">
                  <Link to="/$slug" params={{ slug: team.slug }}>
                    Open Workspace
                  </Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No teams found. Create one from{" "}
              <Link to="/dashboard/teams" className="underline">
                team management
              </Link>
              .
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
