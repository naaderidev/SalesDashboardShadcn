"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/layout/auth-provider";
import { DEFAULT_AVATAR_SRC } from "@/components/dashboard/agent-avatar";
import { initials } from "@/lib/utils";

export default function SettingsPage() {
  const { user, openLogin } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and workspace preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how your teammates will see you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={DEFAULT_AVATAR_SRC} alt={user.name} />
                  <AvatarFallback className="text-base">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" defaultValue={user.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={user.role} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="team">Team</Label>
                  <Input id="team" defaultValue="Enterprise Sales" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">
                You&apos;re signed out. Sign in to edit your profile.
              </p>
              <Button size="sm" onClick={openLogin}>
                Log in
              </Button>
            </div>
          )}
        </CardContent>
        {user && (
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Save changes</Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Use the moon/sun icon in the top bar to switch between light and dark mode.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
