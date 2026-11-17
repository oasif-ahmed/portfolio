import { addProject, updateProject, type CustomProject } from "@/actions/projects";

export async function POST(request: Request) {
  const { id, project } = (await request.json()) as {
    id?: string | null;
    project: Omit<CustomProject, "id" | "_id">;
  };

  if (id) {
    return Response.json(await updateProject(id, project));
  }
  return Response.json(await addProject(project));
}
