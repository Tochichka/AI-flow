import { adviseUser, evaluateGoldenCases } from "./advisor.js";

const sample = adviseUser({
  note: "I want to spend less energy on planning and more on execution.",
  stats: { completed: 3, total: 7 },
  overload: 0.5
});

console.log("Sample advice:");
console.log(JSON.stringify(sample, null, 2));

console.log("\nGolden case evaluation:");
console.log(JSON.stringify(evaluateGoldenCases(), null, 2));
