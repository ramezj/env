import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

// ── Query Keys ───────────────────────────────────────────────────────────────

export const teamKeys = {
  all: () => ["teams"] as const,
  detail: (teamId: string) => ["teams", teamId] as const,
};

// ── Queries ──────────────────────────────────────────────────────────────────

export const teamsQueryOptions = queryOptions({
  queryKey: teamKeys.all(),
  queryFn: async () => {
    const res = await apiClient.api.teams.$get();
    if (!res.ok) throw new Error("Failed to fetch teams");
    const json = await res.json();
    return json.data;
  },
});

export function useTeams() {
  return useQuery(teamsQueryOptions);
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: teamKeys.detail(teamId),
    queryFn: async () => {
      const res = await apiClient.api.teams[":teamId"].$get({
        param: { teamId },
      });
      if (res.status === 404) throw new Error("Team not found");
      if (!res.ok) throw new Error("Failed to fetch team");
      const json = await res.json();
      return json.data;
    },
    enabled: !!teamId,
  });
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const res = await apiClient.api.teams.$post({ json: input });
      if (!res.ok) throw new Error("Failed to create team");
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all() });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, name }: { teamId: string; name?: string }) => {
      const res = await apiClient.api.teams[":teamId"].$patch({
        param: { teamId },
        json: { name },
      });
      if (!res.ok) throw new Error("Failed to update team");
      const json = await res.json();
      return json.data;
    },
    onSuccess: (_data, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all() });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: string) => {
      const res = await apiClient.api.teams[":teamId"].$delete({
        param: { teamId },
      });
      if (!res.ok) throw new Error("Failed to delete team");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all() });
    },
  });
}
