export default function Loading() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-lg px-4 py-10 sm:py-14"
      aria-busy="true"
      aria-label="Loading tasks"
    >
      {/* Title skeleton */}
      <header className="mb-8">
        <div
          className="h-9 w-24 animate-pulse rounded-lg"
          style={{ background: "var(--bg-tertiary)" }}
        />
        <div
          className="mt-2 h-4 w-16 animate-pulse rounded"
          style={{ background: "var(--bg-tertiary)" }}
        />
      </header>

      {/* Form skeleton */}
      <div
        className="animate-pulse rounded-[12px] p-5"
        style={{
          background: "var(--bg-secondary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-3 h-11 rounded-[10px]" style={{ background: "var(--bg-tertiary)" }} />
        <div className="mb-4 h-20 rounded-[10px]" style={{ background: "var(--bg-tertiary)" }} />
        <div className="h-11 rounded-[10px]" style={{ background: "var(--bg-tertiary)" }} />
      </div>

      {/* List skeleton */}
      <section aria-label="Task list" className="mt-8">
        <ul
          className="overflow-hidden rounded-[12px]"
          style={{
            background: "var(--bg-secondary)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {(["a", "b", "c"] as const).map((id, i) => (
            <li
              key={id}
              className="flex items-center gap-3 px-4 py-3 animate-pulse"
              style={{
                borderTop: i > 0 ? "1px solid var(--separator)" : undefined,
              }}
            >
              <div
                className="h-5.5 w-5.5 shrink-0 rounded-full"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div className="flex flex-1 flex-col gap-2">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ background: "var(--bg-tertiary)" }}
                />
                <div
                  className="h-3 w-2/5 rounded"
                  style={{ background: "var(--bg-tertiary)", opacity: 0.6 }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
