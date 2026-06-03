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
        <form
          className="flex flex-col w-full space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputField
            placeholder="Введите имя пользователя"
            value={username}
            setValue={(value) => setUsername(value)}
            className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
          />
          <InputField
            enableVisibility
            placeholder="Введите пароль"
            value={password}
            setValue={(value) => setPassword(value)}
            length={{ min: 8, max: 20 }}
            func={login}
            className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
          />
          <div className="flex justify-between">
            <Button text="Регистрация" func={register} className="" />
            <Button text="Логин" func={login} className="" />
          </div>
        </form>
      </main>
    </div>
  );
}
