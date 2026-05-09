import { createFileRoute } from "@tanstack/react-router";
import { ProjectsManager } from "../../../components/ProjectsManager";
import { projectsQueryOptions } from "../../../queries/projects.queries";

export const Route = createFileRoute("/dashboard/teams/$teamId")({
  component: TeamProjectsPage,
  loader: async ({ context, params }) => {
    // Prefetch projects for this organization before the page renders
    await context.queryClient.ensureQueryData(
      projectsQueryOptions(params.teamId),
    );
  },
});

function TeamProjectsPage() {
  const { teamId } = Route.useParams();
  return (
    <div className="max-w-5xl">
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Team Projects
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage applications, websites, and microservices for this team.
        </p>
      </div>

      <ProjectsManager organizationId={teamId} />
    </div>
  );
}
