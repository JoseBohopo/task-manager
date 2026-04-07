import * as tasksService from "@/lib/tasks.service";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
};

export async function GET() {
  try {
    const result = tasksService.listTasks();

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

export async function POST(request: Request) {
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
    const result = tasksService.createTask(body);

    if (!result.success) {
      const status = STATUS_CODES[result.error.code] ?? 500;
      return Response.json({ error: result.error }, { status });
    }

    return Response.json(result.data, { status: 201 });
  } catch {
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
