import { Button } from "../ui/button";
import Image from "next/image";
import GoogleSVG from "../../../public/googleicon";
import GithubSVG from "../../../public/githubicon";

export default function Hero() {
  return (
    <div className="w-full flex flex-row items-center justify-between px-8 bg-card">
      <div className="flex flex-col max-w-md space-y-6">
        <h1 className="text-7xl opacity-80 font-bold leading-tight text-start">
          Easy Scheduling Ahead
        </h1>
        <p className="text-lg opacity-70 text-start">
          Join 20 million professionals who easily book meetings with the #1
          scheduling tool.
        </p>
        <div className="relative min-h-screen flex flex-col md:flex-row gap-4 md:gap-2 justify-center">
          <Button className="flex items-center text-card rounded-xl h-14">
            <div className="border p-4 rounded-lg">
              <GoogleSVG />
            </div>
            <span className="font-semibold">Sign In With Google</span>
          </Button>
          <Button className="flex items-center px-6 py-3 bg-gray-800 text-card hover:bg-gray-900 rounded-xl h-14">
            <div className="border p-4 rounded-lg">
              <GithubSVG />
            </div>
            <span className="font-semibold">Sign In With Github</span>
          </Button>
        </div>
      </div>

      <div className="md:w-1/2 justify-center items-center hidden md:block">
        <Image
          src="/image/h.png"
          alt="Hero Image"
          width={500}
          height={500}
          className="w-full h-full object-cove rounded-lg "
        />
      </div>
    </div>
  );
}
