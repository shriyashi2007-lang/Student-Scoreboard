import { useEffect, useRef, useState } from "react";
export function Icon({ name, ...props }) {
  const paths = {
    dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    students:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 8v6 M17 11h6",
    analytics: "M4 20V10 M10 20V4 M16 20v-8 M22 20H2",
    leaderboard:
      "M8 3h8v6a4 4 0 0 1-8 0z M8 5H4v3a4 4 0 0 0 4 4 M16 5h4v3a4 4 0 0 1-4 4 M12 13v6 M8 21h8",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2",
    arrow: "M5 12h14 M14 7l5 5-5 5",
    plus: "M12 5v14 M5 12h14",
    check: "M5 12l4 4L19 6",
    search: "M21 21l-6-6 M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14",
    book: "M3 3h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v16h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3z",
  };
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] ?? paths.book} />
    </svg>
  );
}
export function Avatar({ student, index = 0 }) {
  return (
    <span className={`avatar tone-${index % 4}`}>
      {student.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")}
    </span>
  );
}
export function Counter({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let id;
    const start = performance.now();
    const tick = (now) => {
      const t =
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.dataset.motion === "reduced"
          ? 1
          : Math.max(0, Math.min((now - start) / 750, 1));
      setDisplay(value * (1 - (1 - t) ** 3));
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <>{Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}</>
  );
}
export function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);
  const closeRef = useRef(onClose);
  function requestClose() {
    setClosing(true);
    timer.current = setTimeout(() => closeRef.current(), 170);
  }
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    const previous = document.activeElement;
    const el = ref.current;
    el.querySelector("input,button,select")?.focus();
    function key(e) {
      if (e.key === "Escape") {
        setClosing(true);
        timer.current = setTimeout(() => closeRef.current(), 170);
      }
      if (e.key === "Tab") {
        const nodes = [
          ...el.querySelectorAll('button,input,select,[tabindex="0"]'),
        ].filter((n) => !n.disabled);
        if (e.shiftKey && document.activeElement === nodes[0]) {
          e.preventDefault();
          nodes.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === nodes.at(-1)) {
          e.preventDefault();
          nodes[0]?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      clearTimeout(timer.current);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <div
      className={`modal-backdrop ${closing ? "closing" : ""}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <section
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="close"
          aria-label="Close dialog"
          onClick={requestClose}
        >
          ×
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}
export function Carousel({ students }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const start = useRef(0);
  const list = students.slice(0, 5);
  const count = list.length;
  const next = (delta) => setIndex((i) => (i + delta + count) % count);
  useEffect(() => {
    if (paused || userPaused || count < 2) return;
    const timer = setInterval(() => {
      if (
        document.documentElement.dataset.motion !== "reduced" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        setIndex((i) => (i + 1) % count);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, userPaused, count]);
  if (!count)
    return <p>No students yet. Your future stars will appear here.</p>;
  const student = list[index % count];
  return (
    <div
      className="carousel"
      tabIndex="0"
      aria-label="Top performers carousel"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (["ArrowRight", "ArrowLeft"].includes(e.key)) {
          e.preventDefault();
          next(e.key === "ArrowRight" ? 1 : -1);
        }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(e) => (start.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - start.current;
        if (Math.abs(delta) > 35) next(delta < 0 ? 1 : -1);
      }}
    >
      <div className="carousel-person" key={student.id}>
        <Avatar student={student} />
        <div>
          <span className="eyebrow">
            STUDENT SPOTLIGHT · #{(index % count) + 1}
          </span>
          <h3>{student.name}</h3>
          <p>{student.score} / 100 marks · Outstanding effort</p>
        </div>
      </div>
      <div className="carousel-controls">
        <button aria-label="Previous student" onClick={() => next(-1)}>
          ‹
        </button>
        {list.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === index % count ? "selected" : ""}`}
            aria-label={`Show ${s.name}`}
            aria-pressed={i === index % count}
            onClick={() => setIndex(i)}
          >
            <span />
          </button>
        ))}
        <button aria-label="Next student" onClick={() => next(1)}>
          ›
        </button>
        <button
          aria-label={userPaused ? "Play carousel" : "Pause carousel"}
          onClick={() => setUserPaused((p) => !p)}
        >
          {userPaused ? "▶" : "Ⅱ"}
        </button>
      </div>
    </div>
  );
}
export function Podium({ students }) {
  return (
    <div className="podium">
      {[1, 0, 2].map(
        (i) =>
          students[i] && (
            <div className={`podium-place place-${i}`} key={students[i].id}>
              <span className="medal">{["♛", "◇", "◇"][i]}</span>
              <Avatar student={students[i]} index={i} />
              <strong>{students[i].name}</strong>
              <span>
                {students[i].score} <small>marks</small>
              </span>
              <div className="pedestal">
                {i + 1}
                <small>{["ST", "ND", "RD"][i]}</small>
              </div>
            </div>
          ),
      )}
    </div>
  );
}
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 45 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 7) * 0.08}s`,
            background: ["#2E8B57", "#20B2AA", "#F4C542"][i % 3],
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
    </div>
  );
}
