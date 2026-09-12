"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, useTransition } from "react";
import type { Product, Variant } from "@/lib/boutique/types";
import { formatPrice } from "@/lib/boutique/format";
import { getTeam } from "@/lib/boutique/taxonomy";
import { createReservation } from "../actions/reservations";
import type { ActionResult } from "../actions/types";
import { FormMessage, textareaClass } from "./form-ui";
import Modal from "./modal";
import { useSession } from "./use-session";

interface ReserveFormProps {
  product: Product;
}

const variantAvailable = (v: Variant) => v.stock > 0 || v.onOrder;

/**
 * Variant picker + quantity + "Réserver". No payment: the member reserves,
 * then pays and picks the item up at the club. Anonymous visitors are sent to
 * the login page; demo mode shows a local confirmation.
 */
export default function ReserveForm({ product }: ReserveFormProps) {
  const pathname = usePathname();
  const session = useSession();
  const available = product.variants.filter(variantAvailable);
  const single = product.variants.length === 1;
  const [variantId, setVariantId] = useState<string | undefined>(single ? product.variants[0].id : undefined);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ActionResult>({ ok: false });
  const [pending, startTransition] = useTransition();

  const variant = product.variants.find((v) => v.id === variantId);
  const max = variant ? (variant.onOrder ? 5 : Math.min(variant.stock, 5)) : 1;
  const canReserve = !!variant && variantAvailable(variant);
  const team = product.team ? getTeam(product.team) : undefined;
  const needsLogin = session.configured && !session.loading && !session.user;
  const loginHref = `/boutique/connexion?next=${encodeURIComponent(pathname)}`;

  const close = () => {
    setOpen(false);
    setResult({ ok: false });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variant) return;
    if (!session.configured) {
      setResult({ ok: true, message: "Réservation enregistrée (démonstration)." });
      return;
    }
    startTransition(async () => {
      const res = await createReservation([{ variantId: variant.id, quantity }], note);
      setResult(res);
    });
  };

  return (
    <div>
      {!single ? (
        <fieldset>
          <legend className="text-sm font-medium text-gray-900">
            Taille{variant ? <span className="ml-2 font-normal text-gray-500">{variant.label}</span> : null}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const ok = variantAvailable(v);
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVariantId(v.id);
                    setQuantity(1);
                  }}
                  disabled={!ok}
                  aria-pressed={active}
                  className={`relative h-11 min-w-[3.25rem] rounded-md border px-3 text-sm font-medium ${
                    active
                      ? "border-bayard bg-bayard text-white"
                      : ok
                        ? "border-gray-300 text-gray-900 hover:border-gray-500"
                        : "cursor-not-allowed border-gray-200 text-gray-400 line-through"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <p className="mt-3 text-sm" aria-live="polite">
        {variant ? (
          variant.onOrder ? (
            <span className="text-bayard">Sur commande · délai {variant.leadTime ?? "à confirmer"}</span>
          ) : variant.stock > 0 ? (
            <span className="text-emerald-700">
              {variant.stock <= 2 ? `Plus que ${variant.stock} en stock` : "En stock au club"}
            </span>
          ) : (
            <span className="text-gray-500">Rupture de stock</span>
          )
        ) : available.length > 0 ? (
          <span className="text-gray-500">Choisissez une taille</span>
        ) : (
          <span className="text-gray-500">Rupture de stock</span>
        )}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="inline-flex h-12 items-center rounded-md border border-gray-300">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
            className="flex h-full w-11 items-center justify-center text-gray-700 disabled:text-gray-300"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(max, q + 1))}
            disabled={!canReserve || quantity >= max}
            aria-label="Augmenter la quantité"
            className="flex h-full w-11 items-center justify-center text-gray-700 disabled:text-gray-300"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {needsLogin ? (
          <Link
            href={loginHref}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            Se connecter pour réserver
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!canReserve}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {variant?.onOrder ? "Précommander" : "Réserver"} · {formatPrice(product.price * quantity)}
          </button>
        )}
      </div>

      {product.teamOnly && team ? (
        <p className="mt-3 rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
          Article réservé aux membres de l&apos;{team.label.toLowerCase()}. Le rattachement à l&apos;équipe est géré
          par le secrétariat.
        </p>
      ) : null}

      <Modal open={open} onClose={close} title={variant?.onOrder ? "Précommander" : "Réserver"}>
        {result.ok ? (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-gray-900">Réservation enregistrée</p>
            <p className="mt-2 text-sm text-gray-600">
              Vous recevrez un email quand l&apos;article sera prêt. Paiement et retrait au club house ou au
              secrétariat. Une réservation non retirée sous 14 jours est annulée.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {session.configured ? (
                <Link href="/boutique/compte/reservations" className="inline-flex h-11 items-center justify-center rounded-md bg-bayard px-6 text-sm font-semibold text-white">
                  Mes réservations
                </Link>
              ) : null}
              <button type="button" onClick={close} className="h-11 rounded-md border border-gray-300 px-6 text-sm font-medium text-gray-800">
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {!session.configured ? (
              <p className="rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
                Version de démonstration : la réservation n&apos;est pas enregistrée.
              </p>
            ) : null}
            <FormMessage result={result} />
            <dl className="divide-y divide-gray-200 rounded-md border border-gray-200 text-sm">
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Article</dt><dd className="font-medium text-gray-900">{product.name}</dd></div>
              {variant ? <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Taille</dt><dd className="font-medium text-gray-900">{variant.label}</dd></div> : null}
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Quantité</dt><dd className="font-medium text-gray-900">{quantity}</dd></div>
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">À régler au club</dt><dd className="font-semibold text-gray-900">{formatPrice(product.price * quantity)}</dd></div>
            </dl>
            <label className="block text-sm font-medium text-gray-900">
              Message pour le club <span className="font-normal text-gray-500">(facultatif)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Ex. nom du cavalier à broder, créneau de passage…"
                className={textareaClass}
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="h-11 w-full rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "Enregistrement…" : "Confirmer la réservation"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
