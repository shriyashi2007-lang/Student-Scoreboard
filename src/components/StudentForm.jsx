import { useState } from "react";
export default function StudentForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial ?? { name: "", score: "", group: "", roll: "" },
  );
  const [touched, setTouched] = useState({});
  const errors = {
    name: !form.name.trim()
      ? "Please enter a student name."
      : form.name.trim().length > 100
        ? "Use at most 100 characters."
        : "",
    score:
      form.score === ""
        ? "Please enter marks."
        : !Number.isFinite(Number(form.score)) ||
            Number(form.score) < 0 ||
            Number(form.score) > 100
          ? "Marks must be between 0 and 100."
          : "",
  };
  function submit(e) {
    e.preventDefault();
    setTouched({ name: true, score: true });
    if (Object.values(errors).some(Boolean)) return;
    onSave({ ...form, name: form.name.trim(), score: Number(form.score) });
    if (!initial) {
      setForm({ name: "", score: "", group: "", roll: "" });
      setTouched({});
    }
  }
  return (
    <form onSubmit={submit} noValidate className="student-form">
      <div className="form-grid">
        {[
          ["name", "Student name", "e.g. Olivia Bennett"],
          ["score", "Marks (0–100)", "e.g. 85"],
          ["group", "Class (optional)", "e.g. 10 A"],
          ["roll", "Roll no. (optional)", "e.g. 009"],
        ].map(([key, label, placeholder]) => (
          <label key={key}>
            {label}
            <input
              autoComplete="off"
              type={key === "score" ? "number" : "text"}
              min={key === "score" ? 0 : undefined}
              max={key === "score" ? 100 : undefined}
              step={key === "score" ? "any" : undefined}
              maxLength={key === "name" ? 100 : 50}
              value={form[key] ?? ""}
              placeholder={placeholder}
              aria-invalid={!!(touched[key] && errors[key])}
              aria-describedby={`${key}-error`}
              onBlur={() => setTouched((t) => ({ ...t, [key]: true }))}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
            {touched[key] && errors[key] && (
              <small className="error" id={`${key}-error`}>
                {errors[key]}
              </small>
            )}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <span className="muted">
          {initial
            ? "A little progress makes a big difference."
            : "Every great achievement starts with a student."}
        </span>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button className="primary" type="submit">
          {initial ? "Save changes" : "+ Add Student"}
        </button>
      </div>
    </form>
  );
}
