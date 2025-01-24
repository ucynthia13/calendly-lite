import { CalendarRange } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import EventForm from "../forms/eventform";

export default function AddEvent() {
    return (
        <Sheet>
            <SheetTrigger className="p-3 gap-1 px-3 items-center flex fixed bottom-6 right-8 rounded-full border border-primary text-primary cursor-pointer">
                <CalendarRange />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="pb-4 text-lg">Add Event</SheetTitle>
                </SheetHeader>
                <EventForm />
            </SheetContent>
        </Sheet>

    )
}