"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "../../public/assets/images/logo.png";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/app/actions/action";
const LoginComponent: React.FC = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const isDisabled = credentials.email === "" || credentials.password === "";
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (field === "email") {
      setCredentials({ ...credentials, email: e.target.value });
    } else if (field === "password") {
      setCredentials({ ...credentials, password: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // TODO: Implement actual login logic here
      try {
        const formData = new FormData(e.currentTarget);
        const response = await doCredentialLogin(formData);

        if (response?.error) {
          console.error(response.error);
          setError(response.error.message);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error(e);
        setError("Check your credentials.");
      }
      //console.log("Login attempted with:", credentials);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="bg-slate-800 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          <Image
            src={logo}
            width={0}
            height={0}
            style={{ aspectRatio: 1 }}
            className="max-h-20 min-w-20 max-w-40 mx-auto bg-contain"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-12 w-full sm:w-[400px]"
        >
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            value={credentials.email}
            onChange={(e) => {
              handleChange(e, "email");
            }}
            className="p-2 rounded text-black w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={credentials.password}
            minLength={6}
            onChange={(e) => {
              handleChange(e, "password");
            }}
            className="p-2 rounded text-black w-full"
          />
          <button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-label="Login"
            aria-describedby="login-button"
            className={`w-full bg-blue-500 p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Login
          </button>
          <div
            className="flex h-8 items-center space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {error && (
              <div className="text-center text-red-500 mb-4 text-sm bg-rose-200 border border-red text-red rounded-md p-2">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginComponent;
