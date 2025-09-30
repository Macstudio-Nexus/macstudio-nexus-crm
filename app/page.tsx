// import Image from "next/image";
import Login from "../components/auth/Login";
import Logo from "../components/ui/Logo";
import Footer from "../components/ui/Footer";

export default function Home() {
  return (
    <div className="bg-main-bg text-text-light h-screen grid grid-rows-5 place-items-center text-center">
      <div className="md:justify-self-start pt-2 pl-2 md:pl-10 2xl:pl-22 size-25 md:size-35 2xl:size-45">
        <Logo />
      </div>
      <div className="lg:-mt-28 xl:-mt-38">
        <div className="font-space font-bold text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
          Macstudio Nexus
        </div>
        <div className="font-space text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-2 px-4">
          Official CRM
        </div>
      </div>
      <div className="place-items-center self-center row-span-2 mt-4">
        <Login />
      </div>
      <div className="fixed bottom-1 w-full text-center py-2 border-t bg-component-bg border-border">
        <Footer />
      </div>
    </div>
  );
}
