"use client";

import { useParams, useRouter } from "next/navigation";

import { Button } from "@technifit/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@technifit/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@technifit/ui/dialog";
import * as Icons from "@technifit/ui/icons";
import { useToast } from "@technifit/ui/use-toast";

import { api } from "~/trpc/client";

export function DeleteProject() {
  const { projectId } = useParams();
  const toaster = useToast();
  const router = useRouter();

  const title = "Delete project";
  const description = "This will delete the project and all of its data.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex items-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">{title}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center font-bold text-destructive">
              <Icons.Warning className="mr-2 h-6 w-6" />
              <p>This action can not be reverted</p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    if (!projectId) throw new Error("No project ID");

                    await api.project.delete.mutate({
                      id: projectId,
                    });
                    toaster.toast({ title: "Project deleted" });
                    router.push(`/dashboard`);
                  } catch {
                    toaster.toast({
                      title: "Project could not be deleted",
                      variant: "destructive",
                    });
                  }
                }}
              >
                {`I'm sure. Delete this project`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
