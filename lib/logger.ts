interface RequestLog {
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

export function logRequest(entry: RequestLog): void {
  const level = entry.status >= 500 ? "error" : "info";
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      method: entry.method,
      path: entry.path,
      status: entry.status,
      durationMs: entry.durationMs,
    })
  );
}
