import spec from "@/lib/openapi";

export async function GET() {
  return Response.json(spec);
}
