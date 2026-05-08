import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!session?.user) {
    return <div>Not authenticated</div>;
  }
  return <>{JSON.stringify(session)}</>;
}
