"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product, Variant } from "@/lib/boutique/types";
import { formatPrice } from "@/lib/boutique/format";
import { getTeam } from "@/lib/boutique/taxonomy";
import Modal from "./modal";

interface ReserveFormProps {
  product: Product;
}

const variantAvailable = (v: Variant) => v.stock > 0 || v.onOrder;

/**
 * Variant picker + quantity + "Réserver". No payment: the member reserves,
 * then pays and picks the item up at the club. Demo: local confirmation only.
 */
export default function ReserveForm({ product }: ReserveFormProps) {
  const available = product.variants.filter(variantAvailable);
  const single = product.variants.length === 1;
  const [variantId, setVariantId] = useState<string | undefined>(
    single ? product.variants[0].id : undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId);
  const max = variant ? (variant.onOrder ? 5 : Math.min(variant.stock, 5)) : 1;
  const canReserve = !!variant && variantAvailable(variant);
  const team = product.team ? getTeam(product.team) : undefined;

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
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={!canReserve}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          {variant?.onOrder ? "Précommander" : "Réserver"} · {formatPrice(product.price * quantity)}
        </button>
      </div>

      {product.teamOnly && team ? (
        <p className="mt-3 rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
          Article réservé aux membres de l&apos;{team.label.toLowerCase()}. Le rattachement à l&apos;équipe est
          vérifié par le secrétariat au moment de la réservation.
        </p>
      ) : null}

      <Modal open={open} onClose={() => { setOpen(false); setDone(false); }} title={variant?.onOrder ? "Précommander" : "Réserver"}>
        {done ? (
          <div className="py-4 text-center">
            <p className="text-lg font-semibold text-gray-900">Réservation enregistrée</p>
            <p className="mt-2 text-sm text-gray-600">
              Vous recevrez un email quand l&apos;article sera prêt. Paiement et retrait au club house ou au
              secrétariat. Une réservation non retirée sous 14 jours est annulée.
            </p>
            <button type="button" onClick={() => { setOpen(false); setDone(false); }} className="mt-6 h-11 rounded-md bg-bayard px-6 text-sm font-semibold text-white">
              Fermer
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="space-y-4"
          >
            <p className="rounded-md bg-bayard-light px-3 py-2 text-xs text-bayard">
              Version de démonstration : la réservation n&apos;est pas enregistrée. Avec les comptes membres,
              elle sera confirmée par email et suivie dans «&nbsp;Mes réservations&nbsp;».
            </p>
            <dl className="divide-y divide-gray-200 rounded-md border border-gray-200 text-sm">
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Article</dt><dd className="font-medium text-gray-900">{product.name}</dd></div>
              {variant ? <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Taille</dt><dd className="font-medium text-gray-900">{variant.label}</dd></div> : null}
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">Quantité</dt><dd className="font-medium text-gray-900">{quantity}</dd></div>
              <div className="flex justify-between px-3 py-2"><dt className="text-gray-600">À régler au club</dt><dd className="font-semibold text-gray-900">{formatPrice(product.price * quantity)}</dd></div>
            </dl>
            <label className="block text-sm font-medium text-gray-900">
              Votre email
              <input
                type="email"
                required
                placeholder="prenom@exemple.fr"
                className="mt-1 h-11 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:border-bayard focus:outline-none focus:ring-2 focus:ring-bayard/30"
              />
            </label>
            <button type="submit" className="h-11 w-full rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark">
              Confirmer la réservation
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
