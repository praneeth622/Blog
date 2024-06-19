import { useState } from "react";
import { Link } from "react-router-dom";

type AuthProps = {
  type: "signIn" | "signUp";
};

export default function Auth({ type }: AuthProps) {
  return (
    <div className="flex justify-center h-screen flex-col items-center">
      <div className="flex justify-center flex-col">
        <div className="text-2xl font-extrabold">
          {type === "signUp" ? "Create An Account" : "Sign In"}
        </div>
        <div className="text-neutral-500">
          {type === "signUp" ? (
            <>
              Already Have an Account? <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              Don't Have an Account? <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
        <LabelInput />
      </div>
    </div>
  );
}

function LabelInput() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mt-4 w-full max-w-md">
      <div className="font-bold text-left mt-3">
        Username
      </div>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your username"
        />
      </div>
      <div className="font-bold text-left mt-4">
        Password
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your password"
        />
      </div>
    </div>
  );
}
