"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "bayard-boutique-favoris";

function readFavorites(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeFavorites(favs: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
  } catch {
    // storage unavailable (private mode…): favourites just don't persist
  }
}

interface FavoriteButtonProps {
  itemId: string;
  /** "overlay" for cards (white circle over the photo), "inline" for detail pages. */
  variant?: "overlay" | "inline";
  className?: string;
}

/**
 * Per-browser favourites, stored in localStorage. Will move to the member
 * account once authentication exists.
 */
export default function FavoriteButton({ itemId, variant = "overlay", className = "" }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readFavorites().has(itemId));
  }, [itemId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = readFavorites();
    if (favs.has(itemId)) favs.delete(itemId);
    else favs.add(itemId);
    writeFavorites(favs);
    setActive(favs.has(itemId));
  };

  const label = active ? "Retirer des favoris" : "Ajouter aux favoris";

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        aria-label={label}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:border-gray-400 hover:bg-gray-50 ${className}`}
      >
        <Heart
          className={`h-5 w-5 ${active ? "fill-bayard text-bayard" : "text-gray-700"}`}
          aria-hidden="true"
        />
        <span>{active ? "Dans vos favoris" : "Favori"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={label}
      className={`flex h-9 w-9 min-h-0 min-w-0 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5 hover:bg-white ${className}`}
    >
      <Heart
        className={`h-[18px] w-[18px] ${active ? "fill-bayard text-bayard" : "text-gray-700"}`}
        aria-hidden="true"
      />
    </button>
  );
}
