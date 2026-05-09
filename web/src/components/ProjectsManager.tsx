import { useForm } from "@tanstack/react-form";
import { createProjectSchema } from "@api/schemas/projects.schemas";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "../queries/projects.queries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

export function ProjectsManager({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data: projects, isLoading, error } = useProjects(organizationId);
  if (error) {
    console.error(error);
  }
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    validators: {
      onChange: createProjectSchema
        .omit({ organizationId: true })
        .required({ description: true }),
    },
    onSubmit: async ({ value }) => {
      await createProject.mutateAsync({
        organizationId,
        ...value,
      });
      form.reset();
    },
  });

  const handleEditSubmit = async (projectId: string) => {
    if (!editName.trim()) return;
    await updateProject.mutateAsync({ projectId, name: editName });
    setEditingProjectId(null);
  };

  if (isLoading)
    return (
      <div className="text-sm text-muted-foreground">Loading projects...</div>
    );
  if (error)
    return (
      <div className="text-sm text-destructive">Error: {error.message}</div>
    );

  return (
    <div className="space-y-8">
      <div className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground">
        <h2 className="text-2xl font-semibold mb-6">Create New Project</h2>
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
                <Label htmlFor={field.name}>Project Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Authentication Service"
                  className="w-full"
                />
                {field.state.meta.errors ? (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Main backend APIs"
                  className="w-full"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            )}
          />
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No projects found in this team.
            </p>
          ) : (
            projects?.map((project) => (
              <div
                key={project.id}
                className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground flex flex-col space-y-4 transition-all hover:shadow-md"
              >
                {editingProjectId === project.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="New project name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditSubmit(project.id)}
                        disabled={updateProject.isPending}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProjectId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold text-xl tracking-tight">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-auto pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingProjectId(project.id);
                          setEditName(project.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteProject.mutate({
                            projectId: project.id,
                            organizationId,
                          })
                        }
                        disabled={deleteProject.isPending}
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
