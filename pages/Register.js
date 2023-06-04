"use client";
import React from "react";
import { signIn } from "next-auth/react";

const Register = () => {
  return (
    <div>
      <button onClick={() => signIn("google")}>Login with Google</button>
    </div>
  );
};

export default Register;
