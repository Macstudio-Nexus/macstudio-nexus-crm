"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mail, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Error sending email. Please try again.");
      } else {
        setMessage("Check your email for a sign-in link!");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }

    // Auto-hide message after 2 seconds
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      <div className="bg-bg shadow-[0_0_5px_rgba(0,0,0,0.3)] shadow-black w-fit p-6 md:p-12 rounded-xl font-plex">
        <h1 className="text-4xl md:text-5xl">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex border-1 border-text rounded-lg p-2 my-8 md:my-12">
            <label htmlFor="email" className="pr-4">
              <Mail />
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="border-none outline-none text-text md:text-xl"
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
        </form>
      </div>
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
