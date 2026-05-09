import { createFileRoute } from "@tanstack/react-router";
import { TeamsManager } from "../../../components/TeamsManager";

export const Route = createFileRoute("/dashboard/teams/")({
  component: TeamsPage,
});

function TeamsPage() {
  return (
    <div className="max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Organizations
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your teams, invite members, and configure your organization
          settings.
        </p>
      </div>

      <TeamsManager />
    </div>
  );
}
