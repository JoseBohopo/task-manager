import * as tasksService from "@/lib/tasks.service";

const STATUS_CODES: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = tasksService.updateTask(id, body);

  if (!result.success) {
    const status = STATUS_CODES[result.error.code] ?? 500;
    return Response.json({ error: result.error.message }, { status });
  }

  return Response.json(result.data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = tasksService.deleteTask(id);

  if (!result.success) {
    const status = STATUS_CODES[result.error.code] ?? 500;
    return Response.json({ error: result.error.message }, { status });
  }

  return new Response(null, { status: 204 });
}
