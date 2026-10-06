export type Signal =
  | "LOW_TASK_COMPLETION"
  | "HIGH_WORKLOAD"
  | "LOW_ROUTINE_STICKINESS";

export type TaskStats = {
  completed: number;
  total: number;
};

export function computeSignals(stats: TaskStats, overload: number): Signal {
  const completionRate = stats.total > 0 ? stats.completed / stats.total : 0;

  if (completionRate < 0.6) return "LOW_TASK_COMPLETION";
  if (overload > 0.8) return "HIGH_WORKLOAD";
  return "LOW_ROUTINE_STICKINESS";
}
