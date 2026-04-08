import type { NextRequest } from "next/server";
import * as tasksService from "@/lib/tasks.service";
import { logRequest } from "@/lib/logger";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
};

const PATH = "/api/tasks/:id";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  try {
    const { id } = await params;
    const result = tasksService.getTask(id);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      logRequest({ method: "GET", path: PATH, status, durationMs: Date.now() - start });
      return Response.json({ error: result.error }, { status });
    }

    logRequest({ method: "GET", path: PATH, status: 200, durationMs: Date.now() - start });
    return Response.json(result.data);
  } catch {
    logRequest({ method: "GET", path: PATH, status: 500, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logRequest({ method: "PUT", path: PATH, status: 400, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "PARSE_ERROR", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  try {
    const { id } = await params;
    const result = tasksService.updateTask(id, body);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      logRequest({ method: "PUT", path: PATH, status, durationMs: Date.now() - start });
      return Response.json({ error: result.error }, { status });
    }

    logRequest({ method: "PUT", path: PATH, status: 200, durationMs: Date.now() - start });
    return Response.json(result.data);
  } catch {
    logRequest({ method: "PUT", path: PATH, status: 500, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const start = Date.now();
  try {
    const { id } = await params;
    const result = tasksService.deleteTask(id);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      logRequest({ method: "DELETE", path: PATH, status, durationMs: Date.now() - start });
      return Response.json({ error: result.error }, { status });
    }

    logRequest({ method: "DELETE", path: PATH, status: 204, durationMs: Date.now() - start });
    return new Response(null, { status: 204 });
  } catch {
    logRequest({ method: "DELETE", path: PATH, status: 500, durationMs: Date.now() - start });
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
