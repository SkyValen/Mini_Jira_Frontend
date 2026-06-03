import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { settingHooks } from "./inputHooks";

export function InputField({
    enableVisibility = false,
    placeholder,
    value,
    setValue,
    func,
    className,
    length = { min: undefined, max: undefined },
}) {
    const [visible, setVisible] = settingHooks.useVisibility(enableVisibility);
    const [outline, setOutline] = useState(false);
    return (
        <div
            className={`${outline ? "ring-1 ring-[#6528FF] ring-opacity-50" : ""} flex items-center justify-between border-2 border-primary rounded-lg p-1 outline-none bg-hrm-dark-purple w-full ${className}`}
        >
            <input
                className="outline-none flex-1 bg-transparent select-none w-full min-w-0"
                type={visible ? "text" : "password"}
                maxLength={length.max}
                minLength={length.min}
                placeholder={`${placeholder}`}
                onFocus={() => setOutline(true)}
                onBlur={() => setOutline(false)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                onKeyDown={
                    func
                        ? (e) => {
                              if (e.key === "Enter") {
                                  e.preventDefault();
                                  func();
                              }
                          }
                        : undefined
                }
            />
            {enableVisibility ? (
                <div
                    className="cursor-pointer flex items-center justify-center pl-2 pr-1 text-[#7765A6] hover:text-[#6A4BD1] transition-colors"
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
            ) : undefined}
        </div>
    );
}
