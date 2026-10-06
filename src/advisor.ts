import { computeSignals, type Signal, type TaskStats } from "./signal.js";
import { retrieveKnowledge } from "./retrieval.js";
import { mockLLM, tascalmSystemPrompt, type Advice } from "./llm.js";

export type UserInput = {
  note: string;
  stats: TaskStats;
  overload: number;
};

export function validateAdvice(payload: unknown): Advice {
  const maybe = payload as Partial<Advice>;

  if (
    !maybe.signal ||
    !maybe.summary ||
    !maybe.recommendation ||
    typeof maybe.confidence !== "number"
  ) {
    throw new Error("LLM output failed schema validation");
  }

  return maybe as Advice;
}

export function adviseUser(input: UserInput): Advice {
  const signal = computeSignals(input.stats, input.overload);
  const knowledge = retrieveKnowledge(signal);
  const raw = mockLLM(
    signal,
    `${input.note} | System context: ${tascalmSystemPrompt}`,
    knowledge.map((item) => item.text)
  );

  const advice = validateAdvice(raw);

  if (advice.confidence < 0.7) {
    throw new Error("Quality gate failed: low confidence");
  }

  return advice;
}

export const goldenCases = [
  {
    name: "low completion",
    input: {
      note: "I keep planning but not finishing the real work.",
      stats: { completed: 2, total: 8 },
      overload: 0.4
    },
    expectedSignal: "LOW_TASK_COMPLETION" as Signal
  },
  {
    name: "high workload",
    input: {
      note: "Too many tasks and not enough time.",
      stats: { completed: 6, total: 8 },
      overload: 0.9
    },
    expectedSignal: "HIGH_WORKLOAD" as Signal
  },
  {
    name: "low routine",
    input: {
      note: "I know what to do, but I don't do it consistently.",
      stats: { completed: 5, total: 6 },
      overload: 0.3
    },
    expectedSignal: "LOW_ROUTINE_STICKINESS" as Signal
  }
];

export function evaluateGoldenCases() {
  let passed = 0;

  for (const test of goldenCases) {
    const result = adviseUser(test.input);
    const ok = result.signal === test.expectedSignal && result.confidence >= 0.8;

    if (ok) {
      passed += 1;
    }
  }

  const total = goldenCases.length;
  const gatePassed = passed === total;

  return {
    total,
    passed,
    gatePassed,
    result: gatePassed ? "CI quality gate passed" : "CI quality gate failed"
  };
}
