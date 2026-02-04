import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

function parseWithLogging<T>(schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: unknown } }, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(`[Zod] ${label} validation failed:`, result.error);
    throw new Error(`${label} validation failed`);
  }
  return result.data;
}

export function useDashboard() {
  return useQuery({
    queryKey: [api.dashboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      return parseWithLogging(api.dashboard.get.responses[200], json, "dashboard.get");
    },
  });
}
