import { ReactNode } from "react";

import Navbar from "@/components/page/page-navbar";
import AddEvent from "@/components/page/add-event";
export default function PrivateLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="container my-6 mx-auto">
                {children}
            <AddEvent />
            </main>
        </>
    )
}