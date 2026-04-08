import { beforeEach, describe, expect, it } from "vitest";
import * as store from "@/lib/store";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "@/lib/tasks.service";

beforeEach(() => {
  store.clearAll();
});

// ---------------------------------------------------------------------------
// listTasks
// ---------------------------------------------------------------------------
describe("listTasks", () => {
  it("returns an empty array when there are no tasks", () => {
    const result = listTasks();
    expect(result).toEqual({ success: true, data: [] });
  });

  it("returns all created tasks", () => {
    createTask({ title: "A", status: "PENDING" });
    createTask({ title: "B", status: "COMPLETED" });

    const result = listTasks();
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// createTask
// ---------------------------------------------------------------------------
describe("createTask", () => {
  it("creates a task with required fields", () => {
    const result = createTask({ title: "Buy milk", status: "PENDING" });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.id).toBeDefined();
    expect(result.data.title).toBe("Buy milk");
    expect(result.data.status).toBe("PENDING");
  });

  it("creates a task with an optional description", () => {
    const result = createTask({
      title: "Read book",
      description: "Clean Code",
      status: "PENDING",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.description).toBe("Clean Code");
  });

  it("returns VALIDATION_ERROR for an empty title", () => {
    const result = createTask({ title: "", status: "PENDING" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns VALIDATION_ERROR for an invalid status", () => {
    const result = createTask({ title: "Task", status: "INVALID" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns VALIDATION_ERROR when required fields are missing", () => {
    const result = createTask({});

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns VALIDATION_ERROR for a whitespace-only title", () => {
    const result = createTask({ title: "   ", status: "PENDING" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });
});

// ---------------------------------------------------------------------------
// getTask
// ---------------------------------------------------------------------------
describe("getTask", () => {
  it("returns a task by id", () => {
    const created = createTask({ title: "Find me", status: "PENDING" });
    if (!created.success) throw new Error("setup failed");

    const result = getTask(created.data.id);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(created.data);
  });

  it("returns NOT_FOUND for a non-existent id", () => {
    const result = getTask("non-existent-id");

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("NOT_FOUND");
  });
});

// ---------------------------------------------------------------------------
// updateTask
// ---------------------------------------------------------------------------
describe("updateTask", () => {
  it("updates a task's title", () => {
    const created = createTask({ title: "Old title", status: "PENDING" });
    if (!created.success) throw new Error("setup failed");

    const result = updateTask(created.data.id, { title: "New title" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe("New title");
    expect(result.data.status).toBe("PENDING");
  });

  it("updates a task's status", () => {
    const created = createTask({ title: "Task", status: "PENDING" });
    if (!created.success) throw new Error("setup failed");

    const result = updateTask(created.data.id, { status: "COMPLETED" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.status).toBe("COMPLETED");
  });

  it("returns NOT_FOUND for a non-existent id", () => {
    const result = updateTask("non-existent-id", { title: "New" });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("NOT_FOUND");
  });

  it("returns VALIDATION_ERROR for an invalid field value", () => {
    const created = createTask({ title: "Task", status: "PENDING" });
    if (!created.success) throw new Error("setup failed");

    const result = updateTask(created.data.id, { status: "BAD_STATUS" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("VALIDATION_ERROR");
  });
});

// ---------------------------------------------------------------------------
// deleteTask
// ---------------------------------------------------------------------------
describe("deleteTask", () => {
  it("deletes an existing task", () => {
    const created = createTask({ title: "Delete me", status: "PENDING" });
    if (!created.success) throw new Error("setup failed");

    const result = deleteTask(created.data.id);
    expect(result).toEqual({ success: true, data: true });

    const fetched = getTask(created.data.id);
    expect(fetched.success).toBe(false);
  });

  it("returns NOT_FOUND for a non-existent id", () => {
    const result = deleteTask("non-existent-id");

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.code).toBe("NOT_FOUND");
  });
});
