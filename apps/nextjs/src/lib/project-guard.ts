import { notFound } from "next/navigation";
import { db } from "@technifit/db";

export async function userCanAccess(projectId: string) {
  if (!projectId.startsWith("project_")) {
    notFound();
  }

  // see if project exists
  const project = await db
    .selectFrom("Project")
    .select("id")
    .where("id", "=", projectId)
    .executeTakeFirst();

  if (!project) {
    notFound();
  }
}
