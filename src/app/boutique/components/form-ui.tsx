"use client";

import { cloneElement, isValidElement } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "../actions/types";

/** Small building blocks shared by the boutique forms (auth, account, admin). */

export const inputClass =
  "mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-900 placeholder:text-gray-400 focus-visible:border-bayard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bayard/30 disabled:bg-gray-50 disabled:text-gray-400 sm:text-sm";
export const textareaClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus-visible:border-bayard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bayard/30 sm:text-sm";
export const labelClass = "block text-sm font-medium text-gray-900";

export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: React.ReactNode;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const control =
    error && isValidElement(children)
      ? cloneElement(children as React.ReactElement<React.AriaAttributes>, {
          "aria-invalid": true,
          "aria-describedby": `${name}-error`,
        })
      : children;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      {control}
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Un instant…",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-bayard text-white hover:bg-bayard-dark",
    secondary: "border border-gray-300 text-gray-800 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];
  return (
    <button
      type="submit"
      disabled={pending}
      className={`press inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold disabled:cursor-wait disabled:opacity-60 ${styles} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ result }: { result: ActionResult }) {
  if (!result.message) return null;
  return (
    <p
      role={result.ok ? "status" : "alert"}
      className={`rounded-md px-3 py-2 text-sm ${
        result.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
      }`}
    >
      {result.message}
    </p>
  );
}
