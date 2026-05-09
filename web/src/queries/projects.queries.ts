import { queryOptions, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export const projectKeys = {
  all: (organizationId: string) => ["projects", organizationId] as const,
  detail: (projectId: string) => ["projects", "detail", projectId] as const,
};

export const projectsQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: projectKeys.all(organizationId),
    queryFn: async () => {
      const res = await apiClient.api.projects.$get({ query: { organizationId } });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          (body as { error?: string } | null)?.error ?? "Failed to fetch projects";
        throw new Error(`Failed to fetch projects (${res.status}): ${message}`);
      }
      const json = await res.json();
      return json.data;
    },
    enabled: !!organizationId,
  });

export function useProjects(organizationId: string) {
  return useQuery(projectsQueryOptions(organizationId));
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { organizationId: string; name: string; description?: string }) => {
      const res = await apiClient.api.projects.$post({ json: input });
      if (!res.ok) throw new Error("Failed to create project");
      const json = await res.json();
      return json.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(variables.organizationId) });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, name, description }: { projectId: string; name?: string; description?: string }) => {
      const res = await apiClient.api.projects[":projectId"].$patch({
        param: { projectId },
        json: { name, description },
      });
      if (!res.ok) throw new Error("Failed to update project");
      const json = await res.json();
      return json.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(data.organizationId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, organizationId }: { projectId: string; organizationId: string }) => {
      const res = await apiClient.api.projects[":projectId"].$delete({
        param: { projectId },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error((error as any).error || "Failed to delete project");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(variables.organizationId) });
    },
  });
}
