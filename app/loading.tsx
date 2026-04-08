export default function Loading() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8 h-8 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
      <section className="mt-8 flex flex-col gap-3">
        {(["a", "b", "c"] as const).map((id) => (
          <div
            key={id}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="mt-0.5 h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
