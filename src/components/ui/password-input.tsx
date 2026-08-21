"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentPropsWithoutRef<typeof Input> & {
  showLabel: string;
  hideLabel: string;
};

/**
 * Campo de senha com alternância de visibilidade. Vive fora do register-form
 * de proposito: assim o botao acompanha qualquer tela que peca senha, e o
 * redesenho do cadastro nao precisa reimplementar isso.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, showLabel, hideLabel, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-12", className)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex min-h-11 w-11 items-center justify-center rounded-r-md text-mist transition-colors duration-200 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flare"
        >
          <Icon className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    );
  },
);
