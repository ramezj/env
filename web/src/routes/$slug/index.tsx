import { createFileRoute } from "@tanstack/react-router";
import { useTeamBySlug } from "#/queries/teams.queries";

export const Route = createFileRoute("/$slug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: team, isLoading, error } = useTeamBySlug(slug);

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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {team.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Team workspace for <span className="font-medium">{team.slug}</span>.
        </p>
        <p className="text-sm text-muted-foreground">Team ID: {team.id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Workspace Overview</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This workspace is now organized directly around the team and its
            shared resources.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Environment Scope</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Environments belong directly to the organization/team now. Add
            environment management here when the frontend is ready for those
            APIs.
          </p>
        </section>
      </div>
    </div>
  );
}
