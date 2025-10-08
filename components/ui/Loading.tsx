import { Loader } from "lucide-react";

export default function Loading({ text }: { text: string }) {
  return (
    <div className="bg-black h-screen font-space text-2xl flex flex-col items-center justify-center gap-3">
      <Loader
        color="white"
        className="size-20 2xl:size-30 animate-[spin_2s_linear_infinite]"
      />
      <h1 className="text-3xl 2xl:text-5xl text-white">{text}</h1>
    </div>
  );
}
