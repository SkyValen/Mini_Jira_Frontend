"use client";
import { getUserById, loginUser } from "../entities/user/api";
import { useState } from "react";
import { InputField } from "@/shared/ui/input-field/input-field";
import Button from "@/shared/ui/button/button";

export default function Home() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password");

  async function login() {
    let token = (await loginUser({ username, password })).data;
    document.cookie = `jwt=${token}; path=/;`;
    window.location.replace("/projects");
  }
  async function register() {
    window.location.replace("/register");
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-col items-center w-full p-5 max-w-3xl flex-row border-2 border-[#6528FF] rounded-lg">
        Hey, you made it!
      </main>
    </div>
  );
}
