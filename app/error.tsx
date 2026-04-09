"use client";

import { useEffect, useRef } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorProps>) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // WCAG 4.1.3 — move focus to the error heading so screen readers announce it
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main id="main-content" className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <div
        role="alert"
        className="rounded-xl p-6"
        style={{
          background: "var(--bg-secondary)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-4 flex items-center gap-3">
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ color: "var(--destructive)", flexShrink: 0 }}
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 9a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 16z" />
          </svg>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-[17px] font-semibold leading-snug outline-none"
            style={{ color: "var(--destructive)" }}
          >
            Something went wrong
          </h2>
        </div>

        <p
          className="mb-5 text-[15px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {error.message ?? "An unexpected error occurred while loading tasks."}
        </p>

        <button
          onClick={reset}
          className="w-full rounded-[10px] text-[15px] font-semibold text-white transition-colors"
          style={{
            background: "var(--destructive)",
            minHeight: "44px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "var(--destructive-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--destructive)")
          }
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = "var(--focus-ring)")
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
