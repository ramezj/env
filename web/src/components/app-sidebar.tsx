import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users } from "lucide-react";

const items = [
  {
    title: "Overview",
    to: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    title: "Teams",
    to: "/dashboard/teams",
    icon: Users,
    exact: false,
  },
] as const;

export function AppSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const normalizedPathname =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 h-16 flex items-center justify-start border-b">
        <h2 className="text-lg font-semibold">EnvProject</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.exact
                        ? normalizedPathname === item.to
                        : normalizedPathname === item.to ||
                          normalizedPathname.startsWith(`${item.to}/`)
                    }
                  >
                    <Link to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">
            {user.email}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
