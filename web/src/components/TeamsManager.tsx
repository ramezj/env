import { useForm } from "@tanstack/react-form";

import { createTeamSchema } from "@api/schemas/teams.schemas";
import { useTeams, useCreateTeam, useDeleteTeam, useUpdateTeam } from "../queries/teams.queries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

export function TeamsManager() {
  const { data: teams, isLoading, error } = useTeams();
  const createTeam = useCreateTeam();
  const deleteTeam = useDeleteTeam();
  const updateTeam = useUpdateTeam();

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: createTeamSchema,
    },
    onSubmit: async ({ value }) => {
      await createTeam.mutateAsync(value);
      form.reset();
    },
  });

  const handleEditSubmit = async (teamId: string) => {
    if (!editName.trim()) return;
    await updateTeam.mutateAsync({ teamId, name: editName });
    setEditingTeamId(null);
  };

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading teams...</div>;
  if (error) return <div className="text-sm text-destructive">Error loading teams: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-6">Create New Team</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 max-w-sm"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Team Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full"
                />
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                ) : null}
              </div>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            )}
          />
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams?.length === 0 ? (
            <p className="text-sm text-muted-foreground">You don't have any teams yet.</p>
          ) : (
            teams?.map((team) => (
              <div key={team.id} className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground flex flex-col space-y-4 transition-all hover:shadow-md">
                {editingTeamId === team.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Team Name</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="New team name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEditSubmit(team.id)} disabled={updateTeam.isPending}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingTeamId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-xl tracking-tight">{team.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">ID: {team.id}</p>
                    </div>
                    <div className="mt-auto pt-4 flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingTeamId(team.id);
                          setEditName(team.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => deleteTeam.mutate(team.id)}
                        disabled={deleteTeam.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
