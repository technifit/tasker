"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { formatRelative } from "date-fns";

import type { RouterOutputs } from "@technifit/api";
import { MEMBERSHIP } from "@technifit/api/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@technifit/ui/avatar";
import { Button } from "@technifit/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@technifit/ui/dropdown-menu";
import * as Icons from "@technifit/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@technifit/ui/table";
import { useToast } from "@technifit/ui/use-toast";

import { api } from "~/trpc/client";

function formatMemberRole(role: string) {
  for (const [key, value] of Object.entries(MEMBERSHIP)) {
    if (value === role) {
      return key;
    }
  }
  return role;
}

export function OrganizationMembers(props: {
  membersPromise: Promise<RouterOutputs["organization"]["listMembers"]>;
}) {
  const members = use(props.membersPromise);
  const toaster = useToast();
  const router = useRouter();

  const { orgRole } = useAuth();

  // TODO: DataTable with actions
  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none bg-muted">
          <TableHead>Name</TableHead>
          <TableHead>Joined at</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{member.name}</span>
                <span className="text-sm text-muted-foreground">
                  {member.email}
                </span>
              </div>
            </TableCell>
            <TableCell>{formatRelative(member.joinedAt, new Date())}</TableCell>
            <TableCell>{formatMemberRole(member.role)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Icons.Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={orgRole !== "admin"}
                    onClick={async () => {
                      try {
                        const res = await api.organization.deleteMember.mutate({
                          userId: member.id,
                        });
                        router.refresh();
                        toaster.toast({
                          title: `Deleted ${res.memberName} from the organization`,
                        });
                      } catch {
                        toaster.toast({
                          title: "Failed to delete member",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="text-destructive"
                  >
                    Delete member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
