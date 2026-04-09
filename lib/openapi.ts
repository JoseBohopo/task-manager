const spec = {
  openapi: "3.0.3",
  info: {
    title: "Task Manager API",
    description:
      "REST API for managing tasks. Supports creating, reading, updating, and deleting tasks.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000", description: "Local development" }],
  tags: [{ name: "Tasks", description: "Task CRUD operations" }],
  paths: {
    "/api/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List all tasks",
        operationId: "listTasks",
        responses: {
          "200": {
            description: "Array of all tasks",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Task" } },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        operationId: "createTask",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTaskInput" },
              example: { title: "Buy milk", description: "From the supermarket", status: "PENDING" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created task",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Task" } },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Task UUID",
          schema: { type: "string" },
        },
      ],
      get: {
        tags: ["Tasks"],
        summary: "Get a task by ID",
        operationId: "getTask",
        responses: {
          "200": {
            description: "Task found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Task" } },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task (partial)",
        operationId: "updateTask",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateTaskInput" },
              example: { status: "COMPLETED" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated task",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Task" } },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        operationId: "deleteTask",
        responses: {
          "204": { description: "Task deleted successfully" },
          "404": { $ref: "#/components/responses/NotFound" },
          "500": { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    schemas: {
      Status: {
        type: "string",
        enum: ["PENDING", "COMPLETED"],
        description: "Task completion status",
      },
      Task: {
        type: "object",
        required: ["id", "title", "status"],
        properties: {
          id: { type: "string", format: "uuid", description: "Unique task identifier" },
          title: { type: "string", minLength: 1, description: "Task title" },
          description: { type: "string", description: "Optional task description" },
          status: { $ref: "#/components/schemas/Status" },
        },
      },
      CreateTaskInput: {
        type: "object",
        required: ["title", "status"],
        properties: {
          title: { type: "string", minLength: 1, description: "Task title" },
          description: { type: "string", description: "Optional task description" },
          status: { $ref: "#/components/schemas/Status" },
        },
      },
      UpdateTaskInput: {
        type: "object",
        description: "All fields are optional. Only provided fields will be updated.",
        properties: {
          title: { type: "string", minLength: 1, description: "Task title" },
          description: { type: "string", description: "Task description" },
          status: { $ref: "#/components/schemas/Status" },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string", description: "Machine-readable error code" },
              message: { type: "string", description: "Human-readable error message" },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: "Validation or parse error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: { code: "VALIDATION_ERROR", message: "title: Required" } },
          },
        },
      },
      NotFound: {
        description: "Task not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: { code: "NOT_FOUND", message: "Task abc123 not found" } },
          },
        },
      },
      InternalError: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
          },
        },
      },
    },
  },
} as const;

export default spec;
