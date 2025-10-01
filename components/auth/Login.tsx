"use client";

import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setIsLoading(true);
    setMessage("");

    const signInResult = await signIn("email", {
      email: email,
      callbackUrl: `${window.location.origin}/dashboard`,
      redirect: false,
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      setMessage("Error sending magic link");
      return;
    }

    setEmail("");
    setMessage("Link sent! Check your email to login");
  }

  return (
    <>
      <form
        action={handleSubmit}
        className="bg-component-bg border-1 border-neon-green-trans w-fit p-6 md:p-8 rounded-xl font-plex"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
          Log In
        </h1>
        <div className="flex rounded-lg p-2 my-6 md:my-10">
          <Input
            placeholder="tonysoprano@gmail.com"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 md:p-6 lg:p-8"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`login-button `}
        >
          {isLoading ? (
            <div className="px-14 animate-[spin_2s_linear_infinite]">
              <Loader color="white" size={35}/>
            </div>
          ) : (
            <div className="font-plex text-sm md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              Send Magic Link
            </div>
          )}
        </button>

        {/* {session?.user?.email} */}
      </form>
      {message && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"></div>
          <div className="pop-up-container">
            <div className="">{message}</div>
          </div>
        </>
      )}
    </>
  );
}
