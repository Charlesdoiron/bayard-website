"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AUDIENCES,
  BRANDS,
  CATEGORIES,
  COLORS,
  CONDITIONS,
  DISCIPLINES,
  SIZE_OPTIONS,
  TEAMS,
  UNIVERSES,
  getSubCategory,
} from "@/lib/boutique/taxonomy";
import Modal from "./modal";

const MAX_PHOTOS = 6;
const inputClass =
  "mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-bayard focus:outline-none focus:ring-2 focus:ring-bayard/30";
const labelClass = "block text-sm font-medium text-gray-900";

interface Photo {
  id: string;
  url: string;
  name: string;
}

/**
 * Listing form, mirroring the spec's fields (§5.1). Demo: validates locally and
 * shows a confirmation. Photo previews never leave the browser.
 */
export default function SellForm() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [universe, setUniverse] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  const [size, setSize] = useState("");
  const [isDon, setIsDon] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const categories = useMemo(() => CATEGORIES.filter((c) => c.universe === universe), [universe]);
  const category = categories.find((c) => c.slug === categorySlug);
  const sub = getSubCategory(subCategorySlug)?.sub;
  const sizes = sub ? SIZE_OPTIONS[sub.sizeKind] : [];
  const isSafetyGear = ["casques", "gilets-protection", "protections-dorsales"].includes(subCategorySlug);

  // Reset dependent fields when the parent changes
  useEffect(() => { setCategorySlug(""); }, [universe]);
  useEffect(() => { setSubCategorySlug(""); }, [categorySlug]);
  useEffect(() => { setSize(""); }, [subCategorySlug]);

  // Free object URLs when previews are removed or the form unmounts
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotoError(null);
    const room = MAX_PHOTOS - photos.length;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (accepted.length < files.length) {
      setPhotoError(`${MAX_PHOTOS} photos maximum, images uniquement.`);
    }
    setPhotos((prev) => [
      ...prev,
      ...accepted.map((f) => ({ id: `${f.name}-${f.size}-${Date.now()}`, url: URL.createObjectURL(f), name: f.name })),
    ]);
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (photos.length === 0) {
          setPhotoError("Ajoutez au moins une photo.");
          return;
        }
        setSubmitted(true);
      }}
      className="space-y-8"
      noValidate={false}
    >
      {/* Photos */}
      <section>
        <h2 className="text-base font-semibold text-gray-900">Photos</h2>
        <p className="mt-1 text-xs text-gray-500">De 1 à {MAX_PHOTOS} photos. La première sera la photo principale. Compressées automatiquement.</p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((p, i) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image src={p.url} alt={`Photo ${i + 1}`} fill unoptimized sizes="120px" className="object-cover" />
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">Principale</span>
              ) : null}
              <button
                type="button"
                onClick={() => removePhoto(p.id)}
                aria-label={`Retirer la photo ${i + 1}`}
                className="absolute right-1 top-1 flex h-7 w-7 min-h-0 min-w-0 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-xs font-medium text-gray-600 hover:border-bayard hover:text-bayard">
              <Camera className="h-6 w-6" aria-hidden="true" />
              Ajouter
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
                className="sr-only"
              />
            </label>
          ) : null}
        </div>
        {photoError ? <p className="mt-2 text-xs text-red-600" role="alert">{photoError}</p> : null}
      </section>

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">L&apos;article</h2>
        <label className={labelClass}>
          Titre
          <input type="text" required maxLength={80} placeholder="Ex. Selle mixte Wintec 500 17&quot;" className={inputClass} />
          <span className="mt-1 block text-xs text-gray-500">80 caractères max. Marque, modèle, taille : ce que vous taperiez pour le chercher.</span>
        </label>
        <label className={labelClass}>
          Description
          <textarea
            required
            minLength={20}
            rows={5}
            placeholder="État précis, année d'achat, usage, défauts éventuels, ce qui est inclus…"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-bayard focus:outline-none focus:ring-2 focus:ring-bayard/30"
          />
        </label>
      </section>

      {/* Category */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Catégorie</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Univers
            <select required value={universe} onChange={(e) => setUniverse(e.target.value)} className={inputClass}>
              <option value="">Choisir…</option>
              {UNIVERSES.map((u) => <option key={u.slug} value={u.slug}>{u.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Catégorie
            <select required value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} disabled={!universe} className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}>
              <option value="">Choisir…</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Sous-catégorie
            <select required value={subCategorySlug} onChange={(e) => setSubCategorySlug(e.target.value)} disabled={!category} className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}>
              <option value="">Choisir…</option>
              {category?.children.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Pour qui
            <select required className={inputClass} defaultValue="">
              <option value="">Choisir…</option>
              {AUDIENCES.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Taille
            {sizes.length ? (
              <select required value={size} onChange={(e) => setSize(e.target.value)} className={inputClass}>
                <option value="">Choisir…</option>
                {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder={sub ? "Taille unique ou précision libre" : "Choisissez d'abord une sous-catégorie"}
                disabled={!sub}
                className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
              />
            )}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Marque <span className="font-normal text-gray-500">(facultatif)</span>
            <input type="text" list="brands" placeholder="Ex. Pikeur" className={inputClass} />
            <datalist id="brands">
              {BRANDS.map((b) => <option key={b} value={b} />)}
            </datalist>
          </label>
          <label className={labelClass}>
            Couleur <span className="font-normal text-gray-500">(facultatif)</span>
            <select className={inputClass} defaultValue="">
              <option value="">Choisir…</option>
              {COLORS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* Condition */}
      <section>
        <h2 className="text-base font-semibold text-gray-900">État</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CONDITIONS.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-300 p-3 has-[:checked]:border-bayard has-[:checked]:bg-bayard-light">
              <input type="radio" name="condition" value={c.slug} required className="mt-1 h-4 w-4 accent-bayard" />
              <span>
                <span className="block text-sm font-medium text-gray-900">{c.label}</span>
                <span className="block text-xs text-gray-500">{c.help}</span>
              </span>
            </label>
          ))}
        </div>
        {isSafetyGear ? (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-bayard" />
            <span>
              Je certifie que cet équipement de sécurité n&apos;a subi aucune chute ni aucun choc. Un casque ou un
              gilet ayant subi un choc doit être remplacé, même sans dommage visible.
            </span>
          </label>
        ) : null}
      </section>

      {/* Price */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Prix</h2>
        <div className="flex items-end gap-4">
          <label className={`${labelClass} w-40`}>
            Prix (€)
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              required={!isDon}
              disabled={isDon}
              placeholder="Ex. 45"
              className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
            />
          </label>
          <label className="flex h-11 cursor-pointer items-center gap-2 text-sm text-gray-900">
            <input type="checkbox" checked={isDon} onChange={(e) => setIsDon(e.target.checked)} className="h-4 w-4 accent-bayard" />
            Je le donne
          </label>
        </div>
        <p className="text-xs text-gray-500">Aucune commission : le prix affiché est ce que vous recevez, en main propre au club.</p>
      </section>

      {/* Optional */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Compétition <span className="font-normal text-gray-500">(facultatif)</span></h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Discipline
            <select className={inputClass} defaultValue="">
              <option value="">Aucune en particulier</option>
              {DISCIPLINES.map((d) => <option key={d.slug} value={d.slug}>{d.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Équipe de compétition
            <select className={inputClass} defaultValue="">
              <option value="">Aucune</option>
              {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
            </select>
            <span className="mt-1 block text-xs text-gray-500">Pour une tenue ou un équipement aux couleurs d&apos;une équipe. L&apos;annonce portera le badge de l&apos;équipe.</span>
          </label>
        </div>
      </section>

      <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
        En publiant, vous acceptez les conditions d&apos;utilisation de la boutique : le Club Bayard héberge les
        annonces, la vente se fait entre particuliers. Les ventes d&apos;équidés ne sont pas acceptées.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="h-12 flex-1 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark">
          Publier l&apos;annonce
        </button>
        <button type="button" className="h-12 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-800 hover:bg-gray-50">
          Enregistrer le brouillon
        </button>
      </div>

      <Modal open={submitted} onClose={() => setSubmitted(false)} title="Annonce enregistrée">
        <div className="py-2 text-center">
          <p className="text-sm text-gray-700">
            Version de démonstration : l&apos;annonce n&apos;est pas réellement publiée. Avec les comptes membres,
            elle passera en modération puis sera mise en ligne, et vous serez prévenu par email.
          </p>
          <Link href="/boutique/occasion" className="mt-6 inline-flex h-11 items-center rounded-md bg-bayard px-6 text-sm font-semibold text-white">
            Retour aux annonces
          </Link>
        </div>
      </Modal>
    </form>
  );
}
