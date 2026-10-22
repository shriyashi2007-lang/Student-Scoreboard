import { useEffect, useMemo, useRef, useState } from "react";
import { usePage, useStoredState } from "./hooks/useDashboard";
import {
  STUDENT_KEY,
  DEFAULT_PASS_MARK,
  sampleStudents,
  statistics,
  rankStudents,
  normalizeStudents,
  makeId,
} from "./utils/data";
import { Icon, Modal, Confetti } from "./components/UI";
import StudentForm from "./components/StudentForm";
import {
  Dashboard,
  Students,
  Analytics,
  Leaderboard,
  Settings,
} from "./pages/Pages";
import "./styles/dashboard.css";
const navigation = [
  ["dashboard", "Overview"],
  ["students", "Students"],
  ["analytics", "Analytics"],
  ["leaderboard", "Leaderboard"],
  ["settings", "About & Settings"],
];
export default function App() {
  const [stored, setStudents] = useStoredState(STUDENT_KEY, sampleStudents);
  const students = useMemo(() => {
    try {
      return Array.isArray(stored)
        ? stored.filter(
            (s) =>
              s &&
              typeof s.name === "string" &&
              Number.isFinite(s.score) &&
              s.score >= 0 &&
              s.score <= 100,
          )
        : [];
    } catch {
      return [];
    }
  }, [stored]);
  const [pass, setPass] = useStoredState("scoreboard_pass", DEFAULT_PASS_MARK);
  const [reduced, setReduced] = useStoredState("scoreboard_motion", false);
  const [activity, setActivity] = useStoredState("scoreboard_activity", []);
  const [page, navigate] = usePage();
  const [sidebar, setSidebar] = useState(false);
  const [mobile, setMobile] = useState(() => innerWidth < 1024);
  const drawerRef = useRef(null);
  useEffect(() => {
    const resize = () => setMobile(innerWidth < 1024);
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    if (!sidebar || !mobile) return;
    const previous = document.activeElement;
    const drawer = drawerRef.current;
    const links = [...drawer.querySelectorAll("a,button")];
    links[0]?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === links[0]) {
        e.preventDefault();
        links.at(-1)?.focus();
      } else if (!e.shiftKey && document.activeElement === links.at(-1)) {
        e.preventDefault();
        links[0]?.focus();
      }
    };
    drawer.addEventListener("keydown", trap);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      drawer.removeEventListener("keydown", trap);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [sidebar, mobile]);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confetti, setConfetti] = useState(false);
  const ranked = useMemo(() => rankStudents(students), [students]);
  const stats = useMemo(() => statistics(students, pass), [students, pass]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSidebar(false);
    };
    addEventListener("keydown", handler);
    return () => removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(
      () => setToasts((items) => items.filter((t) => t.expires > Date.now())),
      Math.max(1, Math.min(...toasts.map((t) => t.expires)) - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [toasts]);
  useEffect(() => {
    if (!confetti) return;
    const timer = setTimeout(() => setConfetti(false), 2800);
    return () => clearTimeout(timer);
  }, [confetti]);
  function notify(message, undo) {
    setToasts((t) => [
      ...t,
      { id: makeId(), message, undo, expires: Date.now() + 5000 },
    ]);
  }
  function log(type, name) {
    setActivity((a) =>
      [{ id: makeId(), type, name, time: Date.now() }, ...a].slice(0, 30),
    );
  }
  function go(next) {
    navigate(next);
    setSidebar(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function save(student, editing = false) {
    const s = { ...student, id: editing ? student.id : makeId() };
    setStudents((items) =>
      editing ? items.map((old) => (old.id === s.id ? s : old)) : [...items, s],
    );
    log(editing ? "Edited" : "Added", s.name);
    notify(`${s.name} ${editing ? "updated" : "added"} successfully.`);
    setModal(null);
    if (s.score >= 90) setConfetti(true);
  }
  function remove(student) {
    setStudents((items) => items.filter((s) => s.id !== student.id));
    log("Deleted", student.name);
    notify(`${student.name} deleted.`, () => {
      setStudents((items) => [...items, student]);
      log("Restored", student.name);
      notify("Student restored.");
    });
    setModal(null);
  }
  function confirmAction() {
    if (modal.type === "delete") {
      remove(modal.student);
      return;
    }
    setStudents(modal.type === "reset" ? sampleStudents : []);
    setActivity([]);
    notify(
      modal.type === "reset"
        ? "Sample classroom restored."
        : "All student records cleared.",
    );
    setModal(null);
  }
  const title = {
    dashboard: "Dashboard",
    students: "Students",
    analytics: "Analytics",
    leaderboard: "Leaderboard",
    settings: "About & Settings",
  }[page];
  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content").focus();
        }}
      >
        Skip to content
      </a>
      {sidebar && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside
        ref={drawerRef}
        className={`sidebar ${sidebar ? "open" : ""}`}
        inert={mobile && !sidebar}
      >
        {mobile && (
          <button
            className="drawer-close"
            aria-label="Close navigation drawer"
            onClick={() => setSidebar(false)}
          >
            ×
          </button>
        )}
        <a
          className="brand"
          href="#/dashboard"
          onClick={() => setSidebar(false)}
        >
          <span className="brand-icon">
            <Icon name="book" width="27" height="27" />
          </span>
          <span>
            Scoreboard<small>EVERY STUDENT. EVERY STEP.</small>
          </span>
        </a>
        <span className="nav-label">YOUR WORKSPACE</span>
        <nav aria-label="Main navigation">
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={`#/${id}`}
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
              onClick={() => setSidebar(false)}
              title={label}
            >
              <Icon name={id} />
              <span>{label}</span>
              {page === id && <i />}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>✧</span>
          <h3>
            Progress starts
            <br />
            with possibility.
          </h3>
          <p>
            Give every student
            <br />a chance to shine.
          </p>
          <div className="note-lines">▁ ▃ ▅ ▄ ▆ █</div>
        </div>
        <div className="sidebar-footer">
          <span className="profile-avatar">ED</span>
          <div>
            <strong>Educator workspace</strong>
            <small>Inspiring the next generation</small>
          </div>
          <span>↗</span>
        </div>
      </aside>
      <div className="main-shell" inert={mobile && sidebar}>
        <header className="topbar">
          <div className="topbar-left">
            <button
              className={`hamburger ${sidebar ? "is-open" : ""}`}
              aria-label="Toggle navigation"
              aria-expanded={mobile ? sidebar : !collapsed}
              onClick={() => {
                if (innerWidth < 1024) setSidebar((v) => !v);
                else setCollapsed((v) => !v);
              }}
            >
              <span />
              <span />
              <span />
            </button>
            <a href="#/dashboard">Workspace</a>
            <span className="breadcrumb">/</span>
            <strong>{title}</strong>
            <select
              className="top-page-select"
              aria-label="Navigate to page"
              value={page}
              onChange={(e) => go(e.target.value)}
            >
              {navigation.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="topbar-right">
            <span className="local-badge">
              <i /> All changes saved locally
            </span>
            <a
              className="top-settings"
              href="#/settings"
              aria-label="Open settings"
            >
              <Icon name="settings" />
            </a>
            <span className="profile-avatar">ED</span>
          </div>
        </header>
        <main id="main-content" tabIndex="-1">
          <div className="page-heading">
            <div>
              <span className="eyebrow">YOUR CLASSROOM, CONNECTED</span>
              <h1>
                {page === "dashboard"
                  ? "A good day to make a difference."
                  : title}
              </h1>
              <p>
                {page === "dashboard"
                  ? "Welcome back, Educator. Let's turn potential into progress."
                  : page === "students"
                    ? "Nurture potential. Track progress. Celebrate every step."
                    : page === "analytics"
                      ? "See the bigger picture behind every result."
                      : page === "leaderboard"
                        ? "A little recognition goes a long way."
                        : "A thoughtful workspace for your classroom."}
              </p>
            </div>
            <div className="date-chip">
              <span>◷</span>
              <div>
                {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
                <strong>
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </div>
          </div>
          <div className="page-content" key={page}>
            {page === "dashboard" && (
              <Dashboard {...{ students, ranked, stats, pass, go, activity }} />
            )}
            {page === "students" && (
              <Students
                {...{ students, ranked, pass }}
                onAdd={(s) => save(s)}
                onEdit={(student) => setModal({ type: "edit", student })}
                onDelete={(student) => setModal({ type: "delete", student })}
              />
            )}
            {page === "analytics" && (
              <Analytics {...{ students, ranked, stats, pass }} />
            )}
            {page === "leaderboard" && <Leaderboard {...{ ranked, pass }} />}
            {page === "settings" && (
              <Settings
                {...{ pass, setPass, reduced, setReduced, students, notify }}
                confirm={(type) => setModal({ type })}
                onImport={(records) => {
                  const safe = normalizeStudents(records);
                  setStudents((items) => [...items, ...safe]);
                  log("Imported", `${safe.length} students`);
                  notify(`${safe.length} students imported.`);
                }}
              />
            )}
          </div>
          <footer className="page-footer">
            <span>
              Student Scoreboard <b>✦</b> A little better, every day.
            </span>
            <span>Made for brighter futures.</span>
          </footer>
        </main>
      </div>
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span>✓</span>
            <p>{t.message}</p>
            {t.undo && (
              <button
                onClick={() => {
                  t.undo();
                  setToasts((items) => items.filter((i) => i.id !== t.id));
                }}
              >
                Undo
              </button>
            )}
            <button
              aria-label="Dismiss notification"
              onClick={() =>
                setToasts((items) => items.filter((i) => i.id !== t.id))
              }
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {modal && (
        <Modal
          title={
            modal.type === "edit"
              ? "Edit student"
              : modal.type === "delete"
                ? "Delete this student?"
                : modal.type === "reset"
                  ? "Reset your classroom?"
                  : "Clear all student data?"
          }
          onClose={() => setModal(null)}
        >
          {modal.type === "edit" ? (
            <StudentForm
              initial={modal.student}
              onSave={(s) => save(s, true)}
              onCancel={() => setModal(null)}
            />
          ) : (
            <>
              <p>
                {modal.type === "delete"
                  ? `${modal.student.name} will be removed. You can undo this for 5 seconds.`
                  : "This replaces all current records. Export your CSV first if you want to keep them."}
              </p>
              <div className="modal-actions">
                <button className="secondary" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button className="danger" onClick={confirmAction}>
                  {modal.type === "reset"
                    ? "Reset to samples"
                    : modal.type === "delete"
                      ? "Delete student"
                      : "Clear all data"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
      {confetti && <Confetti />}
    </div>
  );
}
