import Image from "next/image";
import Login from "./components/Login";
import Logo from "../components/Logo";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="bg-bg text-text h-screen grid grid-rows-5 place-items-center text-center">
      <div className="md:justify-self-start pt-2 pl-2 md:pl-10 2xl:pl-22">
        <Logo />
      </div>
      <div className="lg:-mt-28 xl:-mt-38">
        <div className="font-space font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl">Macstudio Nexus</div>
        <div className="font-plex text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-2 px-4">
          Official Content Management System
        </div>
      </div>
      <div className="place-items-center self-center row-span-2 mt-4">
        <Login />
      </div>
      <div className="fixed bottom-0 w-full text-center py-2 border-t-1 bg-secondary border-black">
        <Footer />
      </div>
    </div>
  );
}
