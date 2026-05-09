import { createFileRoute } from "@tanstack/react-router";
import { ProjectsManager } from "#/components/ProjectsManager";
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
    <>
      <h1 className="text-4xl font-extrabold tracking-tight">
        {team.name}
      </h1>
      <p className="text-lg text-muted-foreground">
        Team workspace for <span className="font-medium">{team.slug}</span>.
      </p>
      <p className="text-sm text-muted-foreground">Team ID: {team.id}</p>
      <ProjectsManager organizationId={team.id} />
    </>
  );
}
