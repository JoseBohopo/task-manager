import type { NextRequest } from "next/server";
import * as tasksService from "@/lib/tasks.service";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = tasksService.getTask(id);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      return Response.json({ error: result.error }, { status });
    }

    return Response.json(result.data);
  } catch {
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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
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
      return Response.json({ error: result.error }, { status });
    }

    return Response.json(result.data);
  } catch {
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
  try {
    const { id } = await params;
    const result = tasksService.deleteTask(id);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      return Response.json({ error: result.error }, { status });
    }

    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
