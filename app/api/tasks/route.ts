import * as tasksService from "@/lib/tasks.service";
import { logRequest } from "@/lib/logger";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
};

export async function GET() {
  const start = Date.now();
  try {
    const result = tasksService.listTasks();

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      logRequest({ method: "GET", path: "/api/tasks", status, durationMs: Date.now() - start });
      return Response.json({ error: result.error }, { status });
    }

    logRequest({ method: "GET", path: "/api/tasks", status: 200, durationMs: Date.now() - start });
    return Response.json(result.data);
  } catch {
    logRequest({ method: "GET", path: "/api/tasks", status: 500, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const start = Date.now();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logRequest({ method: "POST", path: "/api/tasks", status: 400, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "PARSE_ERROR", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  try {
    const result = tasksService.createTask(body);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      logRequest({ method: "POST", path: "/api/tasks", status, durationMs: Date.now() - start });
      return Response.json({ error: result.error }, { status });
    }

    logRequest({ method: "POST", path: "/api/tasks", status: 201, durationMs: Date.now() - start });
    return Response.json(result.data, { status: 201 });
  } catch {
    logRequest({ method: "POST", path: "/api/tasks", status: 500, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
