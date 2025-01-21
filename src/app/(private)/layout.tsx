import { ReactNode } from "react";
import { CalendarRange } from "lucide-react"
import { UserButton } from "@clerk/nextjs";
import NavLink from "@/components/navbar";
export default function PrivateLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="flex border-b border-slate-200 py-2 bg-card container">
                <nav className="flex items-center font-medium text-sm gap-6 container">
                    <CalendarRange size={24} />
                    <span className="sr-only">Calendly-Like</span>
                    <NavLink href="/events">Events</NavLink>
                    <NavLink href="/schedule">Schedule</NavLink>
                    <div className="ml-auto size-10">
                        <UserButton />
                    </div>
                </nav>
            </header>
            <main className="container my-6 mx-auto">
                {children}
            </main>
        </>
    )
}