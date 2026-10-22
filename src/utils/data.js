export const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  "student-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2);
export const STUDENT_KEY = "scoreboard_students";
export const DEFAULT_PASS_MARK = 40;
export const sampleStudents = [
  ["Olivia Bennett", 96, "10 A", "001"],
  ["Ethan Williams", 92, "10 A", "002"],
  ["Amelia Clarke", 89, "10 B", "003"],
  ["Noah Anderson", 84, "10 A", "004"],
  ["Sophia Mitchell", 76, "10 B", "005"],
  ["Lucas Parker", 65, "10 A", "006"],
  ["Isabella Reed", 38, "10 B", "007"],
  ["James Wilson", 32, "10 B", "008"],
].map(([name, score, group, roll], i) => ({
  id: `sample-${i}`,
  name,
  score,
  group,
  roll,
}));
export function grade(score) {
  return score >= 90
    ? "A+"
    : score >= 80
      ? "A"
      : score >= 70
        ? "B"
        : score >= 60
          ? "C"
          : score >= 40
            ? "D"
            : "F";
}
export function rankStudents(students) {
  return [...students].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name),
  );
}
export function statistics(students, pass) {
  const scores = students.map((s) => s.score).sort((a, b) => a - b);
  const n = scores.length;
  return {
    total: n,
    passed: scores.filter((s) => s >= pass).length,
    failed: scores.filter((s) => s < pass).length,
    average: n ? scores.reduce((a, b) => a + b, 0) / n : 0,
    highest: n ? scores[n - 1] : 0,
    median: n
      ? (scores[Math.floor((n - 1) / 2)] + scores[Math.floor(n / 2)]) / 2
      : 0,
  };
}
export function normalizeStudents(rows) {
  if (!Array.isArray(rows)) throw Error("Student data must be a list.");
  return rows.map((s) => {
    const score = Number(s.score ?? s.marks);
    if (
      !String(s.name ?? "").trim() ||
      String(s.name).length > 100 ||
      String(s.score ?? s.marks ?? "").trim() === "" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100
    )
      throw Error(
        "Every student needs a name (up to 100 characters) and marks from 0 to 100.",
      );
    return {
      id: makeId(),
      name: String(s.name).trim(),
      score,
      group: String(s.group ?? s.class ?? ""),
      roll: String(s.roll ?? ""),
    };
  });
}
export function parseCSV(text) {
  const rows = [];
  let row = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (!quoted && (c === "," || c === "\n")) {
      row.push(cell.replace(/\r$/, ""));
      cell = "";
      if (c === "\n") {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else cell += c;
  }
  if (quoted) throw Error("CSV has an unclosed quote.");
  row.push(cell.replace(/\r$/, ""));
  if (row.some(Boolean)) rows.push(row);
  const headers = (rows.shift() ?? []).map((h) =>
    h
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase(),
  );
  if (
    !headers.includes("name") ||
    !headers.some((h) => ["marks", "score"].includes(h))
  )
    throw Error("CSV needs Name and Marks columns.");
  return normalizeStudents(
    rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))),
  );
}
export function exportCSV(students) {
  const escape = (v) =>
    '"' +
    String(v)
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  const csv = [
    "Name,Marks,Class,Roll",
    ...students.map((s) =>
      [s.name, s.score, s.group, s.roll].map(escape).join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "student-performance.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
