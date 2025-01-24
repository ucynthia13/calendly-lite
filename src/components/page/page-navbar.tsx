import { UserPlus } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <header className="flex pt-4 bg-card">
            <nav className="flex justify-end font-medium text-sm gap-6 container">
                <UserPlus className="opacity-50" />
                <UserButton />
            </nav>
        </header>
    )
}