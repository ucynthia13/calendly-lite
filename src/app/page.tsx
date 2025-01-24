import Hero from "@/components/page/page-hero";
import PublicNav from "@/components/page/public-navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId != null) redirect("/events");
  return (
    <div className="text-center container my-auto">
      {/* <h4 className="text-md mb-3 font-semibold">Sign In To Access Your Events</h4>
      <div className="flex gap-2 justify-center">
        <Button asChild>
          <SignInButton />
        </Button>
        <Button asChild>
          <SignUpButton />
        </Button>
      </div> */}
      <PublicNav />
      <Hero />
    </div>
  );
}
