import type { Signal } from "./signal.js";

export type KnowledgeItem = {
  id: string;
  signal: Signal;
  text: string;
};

const knowledgeBase: KnowledgeItem[] = [
  {
    id: "task_completion_01",
    signal: "LOW_TASK_COMPLETION",
    text: "When task completion is low, reduce scope and focus on the top three priorities."
  },
  {
    id: "task_completion_02",
    signal: "LOW_TASK_COMPLETION",
    text: "Short wins create momentum; finish one meaningful task before starting a new one."
  },
  {
    id: "workload_01",
    signal: "HIGH_WORKLOAD",
    text: "High workload means protecting focus time and removing optional tasks from the day."
  },
  {
    id: "routine_01",
    signal: "LOW_ROUTINE_STICKINESS",
    text: "A weak routine becomes stronger when the first step is simplified and repeated consistently."
  }
];

export function retrieveKnowledge(signal: Signal): KnowledgeItem[] {
  return knowledgeBase.filter((item) => item.signal === signal);
}
