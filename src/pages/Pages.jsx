import { useState } from "react";
import { Avatar, Carousel, Counter, Icon, Podium } from "../components/UI";
import { Distribution, PassDonut } from "../components/Charts";
import StudentForm from "../components/StudentForm";
import { grade, exportCSV, parseCSV } from "../utils/data";
export function Dashboard({ students, ranked, stats, pass, go, activity }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow light">A LITTLE PROGRESS, EVERY DAY</span>
          <h1>
            Great minds.
            <br />
            Brighter futures.
          </h1>
          <p>
            A clear view of every student's journey.
            <br />
            Celebrate success. Inspire what's next.
          </p>
          <button className="hero-button" onClick={() => go("students")}>
            <Icon name="plus" /> Add Student <Icon name="arrow" />
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <div className="floating-star">✦</div>
          <div className="report-illustration">
            <div className="report-top">
              <span>YOUR CLASS, AT A GLANCE</span>
              <Icon name="book" />
            </div>
            <div className="report-score">
              A<span>+</span>
              <small>Limitless potential</small>
            </div>
            <div className="report-line" />
            <div className="report-line short" />
            <div className="mini-bars">
              {[40, 65, 52, 80, 100].map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </div>
          </div>
          <div className="success-pill">
            <span>✓</span>
            <div>
              Growing together<strong>One achievement at a time</strong>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-grid" aria-label="Class statistics">
        {[
          ["Total Students", stats.total, "students", "sky"],
          ["Passed", stats.passed, "check", "mint"],
          ["Failed", stats.failed, "book", "peach"],
          [
            "Average Marks",
            Number(stats.average.toFixed(1)),
            "analytics",
            "lavender",
          ],
          ["Highest Marks", stats.highest, "leaderboard", "yellow"],
        ].map(([label, value, icon, color], i) => (
          <article
            className="stat-card"
            style={{ animationDelay: `${i * 80}ms` }}
            key={label}
          >
            <span className={`stat-icon ${color}`}>
              <Icon name={icon} />
            </span>
            <span className="stat-label">{label}</span>
            <strong>
              <Counter value={value} />
              {label.includes("Marks") && <small>/100</small>}
            </strong>
            <span className="stat-foot">
              {label === "Total Students"
                ? "Learning, growing, achieving"
                : label === "Passed"
                  ? `At least ${pass} marks`
                  : label === "Failed"
                    ? "A little support goes a long way"
                    : label === "Average Marks"
                      ? "Our collective progress"
                      : "Setting the standard"}
            </span>
          </article>
        ))}
      </section>
      {!students.length ? (
        <section className="panel empty">
          <Icon name="book" width="60" height="60" />
          <h2>A fresh start for your class</h2>
          <p>Add your first student to bring your dashboard to life.</p>
          <button className="primary" onClick={() => go("students")}>
            Add Student
          </button>
        </section>
      ) : (
        <>
          <div className="dashboard-charts">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Performance overview</h2>
                  <p>Every result tells a story.</p>
                </div>
                <span className="tag">This class</span>
              </div>
              <PassDonut stats={stats} pass={pass} />
            </section>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Marks distribution</h2>
                  <p>A snapshot of where we stand.</p>
                </div>
                <button className="text-button" onClick={() => go("analytics")}>
                  View analytics ↗
                </button>
              </div>
              <Distribution students={students} />
            </section>
          </div>
          <div className="dashboard-bottom">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">A ROUND OF APPLAUSE</span>
                  <h2>
                    Our shining stars <span className="gold">✦</span>
                  </h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => go("leaderboard")}
                >
                  Leaderboard ↗
                </button>
              </div>
              <Podium students={ranked.slice(0, 3)} />
            </section>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Recent activity</h2>
                  <p>The latest in your classroom.</p>
                </div>
                <span className="activity-icon">◷</span>
              </div>
              <div className="activity-list">
                {activity.length ? (
                  activity.slice(0, 4).map((a) => (
                    <div className="activity-item" key={a.id}>
                      <span className="activity-check">
                        {a.type === "Deleted" ? "−" : "✓"}
                      </span>
                      <div>
                        <strong>{a.name}</strong>
                        <p>
                          {a.type} ·{" "}
                          {new Date(a.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="activity-empty">
                    <Icon name="check" />
                    <h3>You're all caught up</h3>
                    <p>Student updates will appear here.</p>
                  </div>
                )}
              </div>
              <div className="activity-note">
                Small steps. Meaningful progress.
              </div>
            </section>
          </div>
          <section className="panel spotlight">
            <Carousel students={ranked} />
          </section>
        </>
      )}
    </>
  );
}
export function Students({ students, ranked, pass, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("high");
  const list = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All" ||
          (filter === "Passed" ? s.score >= pass : s.score < pass)),
    )
    .sort((a, b) =>
      sort === "high"
        ? b.score - a.score
        : sort === "low"
          ? a.score - b.score
          : sort === "az"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
    );
  return (
    <>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">ROOM FOR EVERY BRIGHT MIND</span>
            <h2>Add a student</h2>
          </div>
          <span className="tag">Let's grow together</span>
        </div>
        <StudentForm onSave={onAdd} />
      </section>
      <section className="panel roster">
        <div className="panel-heading">
          <div>
            <h2>Your students</h2>
            <p>
              {students.length} individual journeys. One inspiring classroom.
            </p>
          </div>
        </div>
        <div className="table-toolbar">
          <label className="search-box">
            <Icon name="search" />
            <input
              aria-label="Search students"
              placeholder="Find a student…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="segmented" aria-label="Filter by status">
            {["All", "Passed", "Failed"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            aria-label="Sort students"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="high">Marks: high to low</option>
            <option value="low">Marks: low to high</option>
            <option value="az">Name: A–Z</option>
            <option value="za">Name: Z–A</option>
          </select>
        </div>
        {list.length ? (
          <table>
            <thead>
              <tr>
                {[
                  "Rank",
                  "Student",
                  "Marks",
                  "Progress",
                  "Grade",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id}>
                  <td data-label="Rank">
                    #{ranked.findIndex((r) => r.id === s.id) + 1}
                  </td>
                  <td data-label="Student">
                    <div className="student-cell">
                      <Avatar student={s} />
                      <div>
                        <strong>{s.name}</strong>
                        <small>
                          {[s.group, s.roll && `Roll ${s.roll}`]
                            .filter(Boolean)
                            .join(" · ") || "Class not specified"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td data-label="Marks">
                    <strong>{s.score}</strong>
                    <small>/100</small>
                  </td>
                  <td data-label="Progress">
                    <div className="progress" aria-label={`${s.score} percent`}>
                      <i style={{ width: `${s.score}%` }} />
                    </div>
                  </td>
                  <td data-label="Grade">
                    <span className="grade">{grade(s.score)}</span>
                  </td>
                  <td data-label="Status">
                    <span
                      className={`status ${s.score >= pass ? "passed" : "failed"}`}
                    >
                      {s.score >= pass ? "✓ Passed" : "! Failed"}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="row-actions">
                      <button
                        onClick={() => onEdit(s)}
                        aria-label={`Edit ${s.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="danger-text"
                        onClick={() => onDelete(s)}
                        aria-label={`Delete ${s.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">
            <h3>
              {students.length
                ? "No matching students"
                : "Your classroom starts here"}
            </h3>
            <p>
              {students.length
                ? "Try a different name or filter."
                : "Add a student using the form above."}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
export function Analytics({ students, ranked, stats, pass }) {
  const [view, setView] = useState("bar");
  return (
    <>
      <div className="insight-grid">
        {[
          ["Class average", `${stats.average.toFixed(1)} / 100`],
          ["Median marks", stats.median],
          [
            "Pass percentage",
            `${stats.total ? Math.round((stats.passed / stats.total) * 100) : 0}%`,
          ],
          ["Highest scorer", ranked[0]?.name ?? "—"],
          ["Lowest scorer", ranked.at(-1)?.name ?? "—"],
        ].map(([k, v]) => (
          <div className="panel insight" key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <div className="dashboard-charts">
        <section className="panel">
          <div className="panel-heading">
            <h2>Marks distribution</h2>
            <select
              aria-label="Chart view"
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="bar">Bar</option>
              <option value="donut">Donut</option>
              <option value="line">Line</option>
            </select>
          </div>
          <Distribution students={students} view={view} />
        </section>
        <section className="panel">
          <h2>Pass vs. fail</h2>
          <PassDonut stats={stats} pass={pass} />
        </section>
        <section className="panel">
          <h2>Grade distribution</h2>
          <div className="grade-chart">
            {["A+", "A", "B", "C", "D", "F"].map((g, i) => {
              const count = students.filter((s) => grade(s.score) === g).length;
              return (
                <div key={g}>
                  <strong>{g}</strong>
                  <div className="progress">
                    <i
                      style={{
                        width: `${(count / Math.max(1, students.length)) * 100}%`,
                        background: [
                          "var(--gold)",
                          "var(--sea-green)",
                          "var(--teal)",
                          "var(--navy)",
                        ][i % 4],
                      }}
                    />
                  </div>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <h2>Individual performance</h2>
          <div className="individual-chart">
            {ranked.map((s, i) => (
              <div
                key={s.id}
                title={`${s.name}: ${s.score} marks`}
                tabIndex="0"
                aria-label={`${s.name}: ${s.score} marks`}
              >
                <span>
                  {i + 1}. {s.name}
                </span>
                <div className="progress">
                  <i style={{ width: `${s.score}%` }} />
                </div>
                <strong>{s.score}</strong>
              </div>
            ))}
            {!students.length && <p>Add students to see their progress.</p>}
          </div>
        </section>
      </div>
    </>
  );
}
export function Leaderboard({ ranked, pass }) {
  return (
    <>
      <section className="panel leaderboard-hero">
        <span className="eyebrow">EFFORT DESERVES A SPOTLIGHT</span>
        <h1>Meet the high achievers.</h1>
        <p>
          Celebrating dedication, curiosity, and a little everyday brilliance.
        </p>
        <Podium students={ranked.slice(0, 3)} />
      </section>
      <section className="panel spotlight">
        <Carousel students={ranked} />
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>The class leaderboard</h2>
          <span className="tag">{ranked.length} students</span>
        </div>
        <div className="rank-list">
          {ranked.map((s, i) => (
            <div
              className={`rank-row ${i < 3 ? "top-rank" : ""}`}
              key={`${s.id}-${s.score}`}
            >
              <span className={`rank-badge rank-${i}`}>
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
              </span>
              <Avatar student={s} index={i} />
              <div className="rank-name">
                <strong>{s.name}</strong>
                <small>
                  {s.group || "Your classroom"} ·{" "}
                  {s.score >= pass ? "Passed" : "Failed"}
                </small>
              </div>
              <span className="grade">{grade(s.score)}</span>
              <strong>
                {s.score}
                <small> / 100</small>
              </strong>
            </div>
          ))}
          {!ranked.length && (
            <p className="empty">
              Add your first student to start the leaderboard.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
export function Settings({
  pass,
  setPass,
  reduced,
  setReduced,
  confirm,
  students,
  onImport,
  notify,
}) {
  const [passInput, setPassInput] = useState(pass);
  async function importFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const records = parseCSV(await file.text());
      if (!records.length) throw Error("The file contains no student rows.");
      onImport(records);
    } catch (error) {
      notify(error.message);
    }
    e.target.value = "";
  }
  return (
    <div className="settings-grid">
      <section className="panel">
        <span className="eyebrow">MAKE IT YOURS</span>
        <h2>Classroom preferences</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              passInput === "" ||
              Number(passInput) < 0 ||
              Number(passInput) > 100
            ) {
              notify("Enter a pass mark between 0 and 100.");
              return;
            }
            setPass(Number(passInput));
            notify("Pass mark updated.");
          }}
        >
          <label>
            Pass mark
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
            />
          </label>
          <p>
            Pass status updates across your dashboard. Letter grades follow the
            fixed academic scale.
          </p>
          <button className="primary">Save preferences</button>
        </form>
        <label className="switch-label">
          <div>
            <strong>Reduced motion</strong>
            <p>Keep the experience calm and comfortable.</p>
          </div>
          <input
            type="checkbox"
            checked={reduced}
            onChange={(e) => setReduced(e.target.checked)}
          />
        </label>
      </section>
      <section className="panel">
        <span className="eyebrow">YOUR DATA, YOUR WAY</span>
        <h2>Import & export</h2>
        <p>
          Download your class records or bring in students from another
          spreadsheet.
        </p>
        <button className="primary" onClick={() => exportCSV(students)}>
          ↓ Export students as CSV
        </button>
        <label className="file-button">
          ↑ Import students from CSV
          <input type="file" accept=".csv,text/csv" onChange={importFile} />
        </label>
        <p className="muted">
          Required columns: Name, Marks. Optional: Class, Roll. Imported records
          are added to your class; matching names are allowed.
        </p>
        <hr />
        <h3>A fresh start</h3>
        <div className="settings-actions">
          <button className="secondary" onClick={() => confirm("reset")}>
            Reset to sample data
          </button>
          <button className="danger" onClick={() => confirm("clear")}>
            Clear all data
          </button>
        </div>
      </section>
      <section className="panel about">
        <Icon name="book" width="38" height="38" />
        <div>
          <span className="eyebrow">BUILT FOR BRIGHTER FUTURES</span>
          <h2>About this project</h2>
          <p>
            Student Scoreboard is an interactive student performance dashboard
            built with React and Vite. It helps educators manage marks,
            understand class performance, and celebrate student achievement
            through accessible charts and a live leaderboard.
          </p>
          <p>
            Records stay in this browser using local storage. Export a CSV to
            keep a backup or move records to another device.
          </p>
          <span className="tag">React + Vite</span>{" "}
          <span className="tag">Accessible by design</span>{" "}
          <span className="tag">Made for learning</span>
        </div>
      </section>
    </div>
  );
}
