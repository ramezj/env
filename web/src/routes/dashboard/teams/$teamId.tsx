import { createFileRoute } from "@tanstack/react-router";
import { ProjectsManager } from "../../../components/ProjectsManager";

export const Route = createFileRoute("/dashboard/teams/$teamId")({
  component: TeamProjectsPage,
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
