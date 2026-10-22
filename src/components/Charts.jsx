export function Distribution({ students, view = "bar" }) {
  const bins = [
    { label: "0–39", min: 0, max: 39, color: "var(--navy)" },
    { label: "40–59", min: 40, max: 59, color: "var(--teal)" },
    { label: "60–79", min: 60, max: 79, color: "var(--sea-green)" },
    { label: "80–100", min: 80, max: 100, color: "var(--gold)" },
  ].map((b) => ({
    ...b,
    value: students.filter(
      (s) =>
        s.score >= b.min &&
        (b.max === 100 ? s.score <= 100 : s.score < b.max + 1),
    ).length,
  }));
  const max = Math.max(1, ...bins.map((b) => b.value));
  if (view === "donut") {
    let angle = 0;
    const segments = bins.map((b) => {
      const from = angle;
      angle += students.length ? (b.value / students.length) * 100 : 0;
      return `${b.color} ${from}% ${angle}%`;
    });
    return (
      <div className="distribution-donut">
        <div
          className="donut"
          style={{
            background: students.length
              ? `conic-gradient(${segments.join(",")})`
              : "var(--mint)",
          }}
        >
          <div>
            <strong>{students.length}</strong>
            <span>students</span>
          </div>
        </div>
        <div className="legend">
          {bins.map((b) => (
            <span key={b.label}>
              <i style={{ background: b.color }} />
              {b.label}: {b.value}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="bar-chart">
      {view === "line" ? (
        <svg
          className="line-chart"
          viewBox="0 0 400 150"
          role="img"
          aria-label={bins
            .map((b) => `${b.label}: ${b.value} students`)
            .join(", ")}
        >
          <polyline
            points={bins
              .map((b, i) => `${40 + i * 105},${130 - (b.value / max) * 110}`)
              .join(" ")}
            fill="none"
            stroke="var(--sea-green)"
            strokeWidth="4"
          />
          {bins.map((b, i) => (
            <g key={b.label}>
              <circle
                cx={40 + i * 105}
                cy={130 - (b.value / max) * 110}
                r="6"
                fill={b.color}
              />
              <text x={40 + i * 105} y="148" textAnchor="middle">
                {b.label}
              </text>
              <title>
                {b.label}: {b.value}
              </title>
            </g>
          ))}
        </svg>
      ) : (
        <div className="bars">
          {bins.map((b) => (
            <div className="bar-column" key={b.label}>
              <strong>{b.value}</strong>
              <div
                className="bar"
                style={{
                  height: `${(b.value / max) * 130 + 3}px`,
                  background: b.color,
                }}
                title={`${b.value} students`}
              />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="chart-caption">
        MARKS RANGE <span>↑ Number of students</span>
      </div>
    </div>
  );
}
export function PassDonut({ stats, pass }) {
  const percent = stats.total
    ? Math.round((stats.passed / stats.total) * 100)
    : 0;
  return (
    <div className="pass-chart">
      <div
        className="donut"
        style={{
          background: `conic-gradient(var(--sea-green) 0 ${percent}%, var(--sky) ${percent}% 100%)`,
        }}
        role="img"
        aria-label={`${stats.passed} passed, ${stats.failed} failed`}
      >
        <div>
          <strong>{percent}%</strong>
          <span>pass rate</span>
        </div>
      </div>
      <div className="legend">
        <span>
          <i />
          Passed <b>{stats.passed}</b>
        </span>
        <span>
          <i className="fail-dot" />
          Failed <b>{stats.failed}</b>
        </span>
        <small>Pass mark: {pass} / 100</small>
      </div>
    </div>
  );
}
