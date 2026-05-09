import { createFileRoute } from "@tanstack/react-router";
import { useTeam } from "../../../queries/teams.queries";

export const Route = createFileRoute("/dashboard/teams/$teamId")({
  component: TeamWorkspacePage,
});

function TeamWorkspacePage() {
  const { teamId } = Route.useParams();
  const { data: team, isLoading, error } = useTeam(teamId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading team...</div>;
  }

  if (error || !team) {
    return (
      <div className="text-sm text-destructive">
        Error loading team: {error?.message ?? "Team not found"}
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {team.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Organization workspace for <span className="font-medium">/{team.slug}</span>.
        </p>
        <p className="text-sm text-muted-foreground">Team ID: {team.id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Team Summary</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Team resources now map directly to the organization.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Next Frontend Area</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Environment management can live here once the frontend queries and
            forms for team-level environments are added.
          </p>
        </section>
      </div>
    </div>
  );
}
