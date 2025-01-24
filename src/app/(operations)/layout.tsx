import { PageSidebar } from "@/components/page/page-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendly Like",
  description: "A Calendly Like App",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SidebarProvider>
        <PageSidebar />
        <div className="flex flex-col w-full">
          {children}
        </div>
      </SidebarProvider>
  );
}
