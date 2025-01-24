"use client";
import { Calendar, ChevronDown, ChevronUp, HomeIcon, Inbox, LucideIcon, Search, Settings, User2 } from "lucide-react";

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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface Item {
  title: string;
  url: string;
  icon: LucideIcon;
}

const items: Item[] = [
  { title: "Home", url: "/", icon: HomeIcon },
  { title: "Events", url: "/events", icon: Inbox },
  { title: "Calendar", url: "/schedule", icon: Calendar },
  { title: "Settings", url: "#", icon: Settings },
  { title: "Reports", url: "/reports", icon: Inbox },
  { title: "Analytics", url: "/analytics", icon: Search },
];

const otherItems: Item[] = [
  { title: "Profile", url: "/profile", icon: User2 },
  { title: "Messages", url: "/messages", icon: Inbox },
  { title: "Notifications", url: "/notifications", icon: ChevronUp },
  { title: "Help", url: "/help", icon: Search },
  { title: "Logout", url: "/logout", icon: Settings },

];

export function PageSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      className={cn("bg-card", {
        "w-16": !open,
        " w-64": open,
      })}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-primary hover:text-primary">
                  <span className="text-xl font-bold">CalendlyLike</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Your Events</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Your Meetings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={cn({ "px-2 pt-4": open })}>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Main Items</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, itemIndex) => (
                <SidebarItem key={itemIndex} item={item} active={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <div className="flex justify-between">
            {open && <SidebarGroupLabel>Other</SidebarGroupLabel>}
            <SidebarTrigger />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item, index) => (
                <SidebarItem key={index} item={item} active={pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span className="font-semibold">Account Center</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const SidebarItem = ({ item, active }: { item: Item; active: boolean }) => {
  const { open } = useSidebar()
  return (
    <SidebarMenuItem data-active={active} key={item.title} className={cn("hover:bg-blue-100/40 rounded-md", { "bg-blue-100/50 rounded-md": active && open })}>
      <Link
        title={item.title}
        href={item.url}
        className={cn(
          "flex items-center gap-4 py-3",
          { "pl-4": open },
          { "justify-center": !open }
        )}
      >
        <item.icon
          data-active={active}
          className={cn("text-card-foreground ", {
            "text-primary": active,
          })}
          size={20}
        />

        {open && (
          <span
            data-active={active}
            className={cn(
              "font-medium capitalize transition-all duration-300",
              { "font-semibold text-primary": active }
            )}
          >
            {item.title}
          </span>
        )}
      </Link>
    </SidebarMenuItem>
  );
};
