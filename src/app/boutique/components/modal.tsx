"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** "sheet" slides from the bottom on mobile, centered dialog on desktop. */
  size?: "md" | "lg";
}

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Portal target: rendered into <body> so the dialog escapes any stacking
  // context (sticky filter bar, fixed site header) and sits on top of everything.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog
    const first = panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, select, button, [href]",
    );
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 min-h-0 min-w-0 cursor-default bg-black/50"
      />
      <div
        ref={panelRef}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
