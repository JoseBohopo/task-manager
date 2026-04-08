import { beforeEach, describe, expect, it } from "vitest";
import * as store from "@/lib/store";
import { GET as listHandler, POST as createHandler } from "@/app/api/tasks/route";
import {
  GET as getByIdHandler,
  PUT as updateHandler,
  DELETE as deleteHandler,
} from "@/app/api/tasks/[id]/route";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(method: string, body?: unknown): NextRequest {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  return new Request("http://localhost/api/tasks", init) as unknown as NextRequest;
}

function makeIdParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  store.clearAll();
});

// ---------------------------------------------------------------------------
// GET /api/tasks
// ---------------------------------------------------------------------------
describe("GET /api/tasks", () => {
  it("returns 200 and an empty array when there are no tasks", async () => {
    const res = await listHandler();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns 200 and all tasks", async () => {
    await createHandler(makeRequest("POST", { title: "Task 1", status: "PENDING" }));
    await createHandler(makeRequest("POST", { title: "Task 2", status: "COMPLETED" }));

    const res = await listHandler();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// POST /api/tasks
// ---------------------------------------------------------------------------
describe("POST /api/tasks", () => {
  it("returns 201 and the created task", async () => {
    const res = await createHandler(
      makeRequest("POST", { title: "Write tests", status: "PENDING" })
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.title).toBe("Write tests");
    expect(body.status).toBe("PENDING");
  });

  it("returns 400 VALIDATION_ERROR for invalid input", async () => {
    const res = await createHandler(makeRequest("POST", { title: "" }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 VALIDATION_ERROR for a whitespace-only title", async () => {
    const res = await createHandler(
      makeRequest("POST", { title: "   ", status: "PENDING" })
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 PARSE_ERROR for invalid JSON", async () => {
    const req = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "application/json" },
    }) as unknown as NextRequest;

    const res = await createHandler(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("PARSE_ERROR");
  });
});

// ---------------------------------------------------------------------------
// GET /api/tasks/:id
// ---------------------------------------------------------------------------
describe("GET /api/tasks/:id", () => {
  it("returns 200 and the task", async () => {
    const created = await createHandler(
      makeRequest("POST", { title: "Find me", status: "PENDING" })
    );
    const { id } = await created.json();

    const res = await getByIdHandler(makeRequest("GET"), makeIdParams(id));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.id).toBe(id);
  });

  it("returns 404 NOT_FOUND for a non-existent id", async () => {
    const res = await getByIdHandler(makeRequest("GET"), makeIdParams("bad-id"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

// ---------------------------------------------------------------------------
// PUT /api/tasks/:id
// ---------------------------------------------------------------------------
describe("PUT /api/tasks/:id", () => {
  it("returns 200 and the updated task", async () => {
    const created = await createHandler(
      makeRequest("POST", { title: "Old", status: "PENDING" })
    );
    const { id } = await created.json();

    const req = new Request(`http://localhost/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: "New", status: "COMPLETED" }),
      headers: { "Content-Type": "application/json" },
    }) as unknown as NextRequest;

    const res = await updateHandler(req, makeIdParams(id));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.title).toBe("New");
    expect(body.status).toBe("COMPLETED");
  });

  it("returns 404 NOT_FOUND for a non-existent id", async () => {
    const req = new Request("http://localhost/api/tasks/bad-id", {
      method: "PUT",
      body: JSON.stringify({ title: "X" }),
      headers: { "Content-Type": "application/json" },
    }) as unknown as NextRequest;

    const res = await updateHandler(req, makeIdParams("bad-id"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------------------------------------------
describe("DELETE /api/tasks/:id", () => {
  it("returns 204 on successful delete", async () => {
    const created = await createHandler(
      makeRequest("POST", { title: "Delete me", status: "PENDING" })
    );
    const { id } = await created.json();

    const res = await deleteHandler(makeRequest("DELETE"), makeIdParams(id));
    expect(res.status).toBe(204);
  });

  it("returns 404 NOT_FOUND for a non-existent id", async () => {
    const res = await deleteHandler(makeRequest("DELETE"), makeIdParams("bad-id"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

// ---------------------------------------------------------------------------
// Full CRUD integration flow
// ---------------------------------------------------------------------------
describe("Full CRUD flow", () => {
  it("creates, reads, updates, then deletes a task", async () => {
    // Create
    const createRes = await createHandler(
      makeRequest("POST", { title: "Integration task", status: "PENDING" })
    );
    expect(createRes.status).toBe(201);
    const task = await createRes.json();
    const { id } = task;

    // Read
    const getRes = await getByIdHandler(makeRequest("GET"), makeIdParams(id));
    expect(getRes.status).toBe(200);
    const fetchedTask = await getRes.json();
    expect(fetchedTask.id).toBe(id);

    // Update
    const putReq = new Request(`http://localhost/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "COMPLETED" }),
      headers: { "Content-Type": "application/json" },
    }) as unknown as NextRequest;
    const updateRes = await updateHandler(putReq, makeIdParams(id));
    expect(updateRes.status).toBe(200);
    const updated = await updateRes.json();
    expect(updated.status).toBe("COMPLETED");

    // Delete
    const deleteRes = await deleteHandler(makeRequest("DELETE"), makeIdParams(id));
    expect(deleteRes.status).toBe(204);

    // Verify gone
    const afterDelete = await getByIdHandler(makeRequest("GET"), makeIdParams(id));
    expect(afterDelete.status).toBe(404);
  });
});
