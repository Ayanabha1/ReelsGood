"use client";
import { auth } from "@clerk/nextjs";
import React, { useEffect } from "react";

const LoginButton = () => {
  const user = auth();
  useEffect(() => {
    console.log(user);
  }, [user]);

  return <div>LoginButton</div>;
};

export default LoginButton;
