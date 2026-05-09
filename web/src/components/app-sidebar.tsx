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
import { Link } from "@tanstack/react-router";
import { Home, Users } from "lucide-react";

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
    exact: true,
  },
  {
    title: "Teams",
    url: "/dashboard/teams",
    icon: Users,
    exact: false,
  },
];

export function AppSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
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
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      activeOptions={{ exact: item.exact }}
                      activeProps={{
                        className:
                          "bg-accent text-accent-foreground font-medium",
                      }}
                    >
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
