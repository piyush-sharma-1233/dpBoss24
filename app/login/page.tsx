"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { signIn, SignInResponse } from "next-auth/react";
import logo from "../../public/assets/images/logo.png";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (!result) {
        setError("Check your credentials.");
        return;
      }
      if (result?.error) {
        setError("Check your credentials.");
      } else {
        // Handle successful login (e.g., redirect to dashboard)
        router.push("/add-results");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsSubmitting(false);
      setError("Check your credentials.");
    } finally {
      setIsSubmitting(false); // Ensure this is called in both success and error cases
    }
  }
  // handle this later

  return (
    <div className="min-h-screen bg-no-repeat bg-cover flex items-center justify-center bg-yellow-100 font-[family-name:var(--font-geist-sans)]">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-10 w-10 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-yellow-500 text-lg font-medium">Logging in...</p>
          </div>
        </div>
      )}
      <div className="bg-gray-100 p-10 shadow-lg rounded-[32px]">
        {error && (
          <div className="text-center text-red-500 mb-4 text-sm bg-red-200 border border-red text-red rounded-md p-2">
            {error}
          </div>
        )}
        <div className="w-full">
          <Image
            src={logo}
            width={237}
            priority
            height={34}
            alt="logo"
            className="m-auto"
          />
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="min-w-96">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              className="mt-1 p-2 block w-full border border-gray rounded-md shadow-sm focus:ring-gray focus:border-gray-300"
              type="email"
              name="email"
              id="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              className="mt-1 p-2 block w-full border border-gray rounded-md shadow-sm focus:ring-gray focus:border-gray-300"
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            aria-label="Login"
            aria-describedby="login-button"
            className={`w-full p-4 bg-gray-800 text-yellow-500 rounded-lg font-bold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            } `}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
