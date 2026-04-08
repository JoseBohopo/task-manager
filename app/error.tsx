"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorProps>) {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-400">
          Something went wrong
        </h2>
        <p className="mb-4 text-sm text-red-600 dark:text-red-300">
          {error.message ?? "An unexpected error occurred while loading tasks."}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
