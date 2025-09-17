"use client";

import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { Mail, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage("");

    const signInResult = await signIn("email", {
      email: email,
      callbackUrl: `${window.location.origin}`,
      redirect: false,
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      setMessage("Error sending magic link");
      return;
    }

    setEmail("");
    setMessage("Magic link sent! Check your email.");
  }

  const { data:session } = useSession()

  return (
    <>
      <h1 className="text-4xl md:text-5xl">Log In</h1>
      <form
        action={handleSubmit}
        className="bg-bg shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-black w-fit p-6 md:p-12 rounded-xl font-plex"
      >
        <div className="flex rounded-lg p-2 my-8 md:my-12">
          <Input
            placeholder="Email"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-6"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`login-button ${isLoading ? "hover:bg-bg" : "hover:bg-text"}`}
        >
          {isLoading ? (
            <div className="px-14 animate-[spin_2s_linear_infinite]">
              <Loader color="white" />
            </div>
          ) : (
            "Send Magic Link"
          )}
        </button>

          {session?.user?.email}

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
