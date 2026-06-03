"use client";
import { loginUser, registerUser } from "@/entities/user/api";
import { useState } from "react";
import { InputField } from "@/shared/ui/input-field/input-field";
import Button from "@/shared/ui/button/button";

export default function Home() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginmode, setLoginMode] = useState(true);

  async function login() {
    let token = (await loginUser({ username: loginUsername, password: loginPassword })).data;
    document.cookie = `jwt=${token}; path=/;`;
    console.log(token);
    window.location.replace("/projects");
  }
  async function switchMode() {
    setLoginMode((prev) => !prev);
  }
  async function register() {
    let user = (await registerUser({ username: registerUsername, password: registerPassword })).data;
    console.log(user);
  }
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-col items-center w-full p-5 max-w-3xl flex-row border-2 border-[#6528FF] rounded-lg">
        {loginmode ?
          <form
            className="flex flex-col w-full items-center space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputField
              placeholder="Введите имя пользователя"
              value={loginUsername}
              setValue={(value) => setLoginUsername(value)}
              className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
            />
            <InputField
              enableVisibility
              placeholder="Введите пароль"
              value={loginPassword}
              setValue={(value) => setLoginPassword(value)}
              length={{ min: 8, max: 20 }}
              func={login}
              className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
            />
            <div className="flex flex-col w-full items-center">
              <Button text="Войти" func={login} className="" />
              <Button text="Зарегистрироваться" func={switchMode} className="bg-transparent text-[#6528FF] underline" />
            </div>
          </form>
          :
          <form
            className="flex flex-col w-full space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <InputField
              placeholder="Введите имя пользователя"
              value={registerUsername}
              setValue={(value) => setRegisterUsername(value)}
              className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
            />
            <InputField
              enableVisibility
              placeholder="Введите пароль"
              value={registerPassword}
              setValue={(value) => setRegisterPassword(value)}
              length={{ min: 8, max: 20 }}
              func={register}
              className="!bg-white !border-[#D7CFF4] !text-black !rounded-xl !py-2.5 !px-4 hover:border-[#6A4BD1] transition-colors"
            />
            <div className="flex flex-col w-full items-center">
              <Button text="Зарегистрироваться" func={register} className="" />
              <Button text="Войти" func={switchMode} className="bg-transparent text-[#6528FF] underline" />
            </div>
          </form>
        }
      </main>
    </div>
  );
}
