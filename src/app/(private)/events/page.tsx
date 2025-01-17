import { UserButton } from "@clerk/nextjs";

export default function EventsPage() {
  return ( 
    <div className="min-h-screen">
      <div className="flex flex-row justify-between p-4 md:p-6">
        <h4 className="font-bold text-md">Access Your Events</h4>
        <div className="">
            <UserButton />
        </div>
      </div>
    </div>
  );
}
