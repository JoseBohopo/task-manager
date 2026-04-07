import * as tasksService from "@/lib/tasks.service";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
};

export async function GET() {
  const result = tasksService.listTasks();

  if (!result.success) {
    const status = STATUS_CODES[result.error.code] ?? 500;
    return Response.json({ error: result.error.message }, { status });
  }

  return Response.json(result.data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = tasksService.createTask(body);

  if (!result.success) {
    const status = STATUS_CODES[result.error.code] ?? 500;
    return Response.json({ error: result.error.message }, { status });
  }

  return Response.json(result.data, { status: 201 });
}
