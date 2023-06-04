"use client";
import React from "react";
import { signIn } from "next-auth/react";

const Login = () => {
  return (
    // <div>
    //   <button onClick={() => signIn("google")}>Login with Google</button>
    // </div>
    <div>
      <button
        className="right-10 transform font-bold w-64  mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
        onClick={() => signIn("google")}
      >
        Login with Google
      </button>
      <button className="right-10 transform  font-bold w-64  mt-4 ml-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg ">
        Register
      </button>
      <button
        onClick={() => {
          console.log("logged out");
        }}
        className="right-80 transform  font-bold w-64  mt-4 ml-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Login;
