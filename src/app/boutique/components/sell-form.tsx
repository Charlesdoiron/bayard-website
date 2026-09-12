"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
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
import type { Listing } from "@/lib/boutique/types";
import { compressImage } from "@/lib/boutique/image";
import { getBrowserClient } from "@/lib/supabase/client";
import { createListing, updateListing } from "../actions/listings";
import type { ActionResult } from "../actions/types";
import { FormMessage, inputClass, labelClass, textareaClass } from "./form-ui";
import Modal from "./modal";
import { useSession } from "./use-session";

const MAX_PHOTOS = 6;
const SAFETY = new Set(["casques", "gilets-protection", "protections-dorsales"]);

interface Photo {
  id: string;
  /** Preview URL (object URL for new files, public URL once uploaded). */
  url: string;
  file?: File;
  /** Public URL once uploaded to storage. */
  uploaded?: string;
}

interface SellFormProps {
  /** Existing listing to edit; omitted to create. */
  listing?: Listing;
}

/**
 * Listing form (spec §5.1). With Supabase configured, photos are compressed
 * in the browser, uploaded to the member's folder in the `listing-photos`
 * bucket, then the server action validates and saves the listing. In demo
 * mode it only shows a confirmation.
 */
export default function SellForm({ listing }: SellFormProps) {
  const router = useRouter();
  const session = useSession();
  const [listingId] = useState(() => listing?.id ?? crypto.randomUUID());
  const [photos, setPhotos] = useState<Photo[]>(
    () => listing?.images.map((url, i) => ({ id: `existing-${i}`, url, uploaded: url })) ?? [],
  );
  const initialSub = listing ? getSubCategory(listing.subCategorySlug) : undefined;
  const [universe, setUniverse] = useState(initialSub?.category.universe ?? "");
  const [categorySlug, setCategorySlug] = useState(initialSub?.category.slug ?? "");
  const [subCategorySlug, setSubCategorySlug] = useState(listing?.subCategorySlug ?? "");
  const [size, setSize] = useState(listing?.size ?? "");
  const [isDon, setIsDon] = useState(listing ? listing.price === 0 : false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [result, setResult] = useState<ActionResult>({ ok: false });
  const [progress, setProgress] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [demoDone, setDemoDone] = useState(false);

  const categories = useMemo(() => CATEGORIES.filter((c) => c.universe === universe), [universe]);
  const category = categories.find((c) => c.slug === categorySlug);
  const sub = getSubCategory(subCategorySlug)?.sub;
  const sizes = sub ? SIZE_OPTIONS[sub.sizeKind] : [];
  const isSafetyGear = SAFETY.has(subCategorySlug);
  const errors = result.fieldErrors ?? {};

  // Reset dependent fields when a parent changes (not on first render of an edit).
  const [touched, setTouched] = useState(false);
  useEffect(() => { if (touched) { setCategorySlug(""); } }, [universe, touched]);
  useEffect(() => { if (touched) { setSubCategorySlug(""); } }, [categorySlug, touched]);
  useEffect(() => { if (touched) { setSize(""); } }, [subCategorySlug, touched]);

  useEffect(
    () => () => photos.forEach((p) => { if (p.file) URL.revokeObjectURL(p.url); }),
    [photos],
  );

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    setPhotoError(null);
    const room = MAX_PHOTOS - photos.length;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (accepted.length < files.length) setPhotoError(`${MAX_PHOTOS} photos maximum, images uniquement.`);
    setPhotos((prev) => [
      ...prev,
      ...accepted.map((f) => ({ id: `${f.name}-${f.size}-${Date.now()}`, url: URL.createObjectURL(f), file: f })),
    ]);
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  /** Upload new photos to storage, return the ordered list of public URLs. */
  const uploadPhotos = async (userId: string): Promise<string[]> => {
    const supabase = getBrowserClient();
    if (!supabase) throw new Error("Supabase indisponible");
    const urls: string[] = [];
    for (const [i, photo] of photos.entries()) {
      if (photo.uploaded) {
        urls.push(photo.uploaded);
        continue;
      }
      setProgress(`Envoi de la photo ${i + 1} sur ${photos.length}…`);
      const blob = await compressImage(photo.file!);
      const path = `${userId}/${listingId}/${Date.now()}-${i}.jpg`;
      const { error } = await supabase.storage.from("listing-photos").upload(path, blob, {
        contentType: "image/jpeg",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error(`Photo ${i + 1} : ${error.message}`);
      const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
      urls.push(data.publicUrl);
      photo.uploaded = data.publicUrl;
    }
    setProgress(null);
    return urls;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const intent = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value ?? "publish";
    if (photos.length === 0) {
      setPhotoError("Ajoutez au moins une photo.");
      return;
    }
    if (!session.configured) {
      setDemoDone(true);
      return;
    }
    if (!session.user) {
      router.push(`/boutique/connexion?next=${encodeURIComponent("/boutique/vendre")}`);
      return;
    }
    const userId = session.user.id;
    const formData = new FormData(form);
    startTransition(async () => {
      try {
        const urls = await uploadPhotos(userId);
        formData.delete("images");
        urls.forEach((u) => formData.append("images", u));
        formData.set("id", listingId);
        formData.set("intent", intent);
        const res = listing ? await updateListing({ ok: false }, formData) : await createListing({ ok: false }, formData);
        setResult(res);
        if (res.ok) {
          router.push(intent === "draft" || !res.data?.slug ? "/boutique/compte/annonces" : `/boutique/compte/annonces?envoyee=${res.data.slug}`);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        setProgress(null);
        setResult({ ok: false, message: err instanceof Error ? err.message : "Envoi impossible. Réessayez." });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormMessage result={result} />

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
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
                className="sr-only"
              />
            </label>
          ) : null}
        </div>
        {photoError || errors.images ? <p className="mt-2 text-xs text-red-600" role="alert">{photoError ?? errors.images}</p> : null}
      </section>

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">L&apos;article</h2>
        <label className={labelClass}>
          Titre
          <input name="title" type="text" required minLength={3} maxLength={80} defaultValue={listing?.title} placeholder="Ex. Selle mixte Wintec 500 17&quot;" className={inputClass} />
          <span className="mt-1 block text-xs text-gray-500">80 caractères max. Marque, modèle, taille : ce que vous taperiez pour le chercher.</span>
          {errors.title ? <span className="mt-1 block text-xs text-red-600">{errors.title}</span> : null}
        </label>
        <label className={labelClass}>
          Description
          <textarea
            name="description"
            required
            minLength={20}
            rows={5}
            defaultValue={listing?.description}
            placeholder="État précis, année d'achat, usage, défauts éventuels, ce qui est inclus…"
            className={textareaClass}
          />
          {errors.description ? <span className="mt-1 block text-xs text-red-600">{errors.description}</span> : null}
        </label>
      </section>

      {/* Category */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Catégorie</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Univers
            <select required value={universe} onChange={(e) => { setTouched(true); setUniverse(e.target.value); }} className={inputClass}>
              <option value="">Choisir…</option>
              {UNIVERSES.map((u) => <option key={u.slug} value={u.slug}>{u.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Catégorie
            <select required value={categorySlug} onChange={(e) => { setTouched(true); setCategorySlug(e.target.value); }} disabled={!universe} className={inputClass}>
              <option value="">Choisir…</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Sous-catégorie
            <select name="sub_category" required value={subCategorySlug} onChange={(e) => { setTouched(true); setSubCategorySlug(e.target.value); }} disabled={!category} className={inputClass}>
              <option value="">Choisir…</option>
              {category?.children.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
            </select>
            {errors.sub_category ? <span className="mt-1 block text-xs text-red-600">{errors.sub_category}</span> : null}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Pour qui
            <select name="audience" required className={inputClass} defaultValue={listing?.audience ?? ""}>
              <option value="">Choisir…</option>
              {AUDIENCES.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
            </select>
            {errors.audience ? <span className="mt-1 block text-xs text-red-600">{errors.audience}</span> : null}
          </label>
          <label className={labelClass}>
            Taille
            {sizes.length ? (
              <select name="size" required value={size} onChange={(e) => setSize(e.target.value)} className={inputClass}>
                <option value="">Choisir…</option>
                {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input
                name="size"
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                maxLength={40}
                placeholder={sub ? "Taille unique ou précision libre" : "Choisissez d'abord une sous-catégorie"}
                disabled={!sub}
                className={inputClass}
              />
            )}
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Marque <span className="font-normal text-gray-500">(facultatif)</span>
            <input name="brand" type="text" list="brands" maxLength={60} defaultValue={listing?.brand} placeholder="Ex. Pikeur" className={inputClass} />
            <datalist id="brands">
              {BRANDS.map((b) => <option key={b} value={b} />)}
            </datalist>
          </label>
          <label className={labelClass}>
            Couleur <span className="font-normal text-gray-500">(facultatif)</span>
            <select name="color" className={inputClass} defaultValue={listing?.color ?? ""}>
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
              <input type="radio" name="condition" value={c.slug} required defaultChecked={listing?.condition === c.slug} className="mt-1 h-4 w-4 accent-bayard" />
              <span>
                <span className="block text-sm font-medium text-gray-900">{c.label}</span>
                <span className="block text-xs text-gray-500">{c.help}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.condition ? <p className="mt-1 text-xs text-red-600">{errors.condition}</p> : null}
        {isSafetyGear ? (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <input type="checkbox" name="safety" required className="mt-0.5 h-4 w-4 accent-bayard" />
            <span>
              Je certifie que cet équipement de sécurité n&apos;a subi aucune chute ni aucun choc. Un casque ou un
              gilet ayant subi un choc doit être remplacé, même sans dommage visible.
            </span>
          </label>
        ) : null}
        {errors.safety ? <p className="mt-1 text-xs text-red-600">{errors.safety}</p> : null}
      </section>

      {/* Price */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Prix</h2>
        <div className="flex items-end gap-4">
          <label className={`${labelClass} w-40`}>
            Prix (€)
            <input
              name="price"
              type="number"
              min={1}
              max={20000}
              step={1}
              inputMode="numeric"
              required={!isDon}
              disabled={isDon}
              defaultValue={listing && listing.price > 0 ? listing.price : undefined}
              placeholder="Ex. 45"
              className={inputClass}
            />
          </label>
          <label className="flex h-11 cursor-pointer items-center gap-2 text-sm text-gray-900">
            <input type="checkbox" name="don" checked={isDon} onChange={(e) => setIsDon(e.target.checked)} className="h-4 w-4 accent-bayard" />
            Je le donne
          </label>
        </div>
        {errors.price ? <p className="text-xs text-red-600">{errors.price}</p> : null}
        <p className="text-xs text-gray-500">Aucune commission : le prix affiché est ce que vous recevez, en main propre au club.</p>
      </section>

      {/* Optional */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Compétition <span className="font-normal text-gray-500">(facultatif)</span></h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Discipline
            <select name="discipline" className={inputClass} defaultValue={listing?.discipline ?? ""}>
              <option value="">Aucune en particulier</option>
              {DISCIPLINES.map((d) => <option key={d.slug} value={d.slug}>{d.label}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Équipe de compétition
            <select name="team" className={inputClass} defaultValue={listing?.team ?? ""}>
              <option value="">Aucune</option>
              {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
            </select>
            <span className="mt-1 block text-xs text-gray-500">Pour une tenue ou un équipement aux couleurs d&apos;une équipe. L&apos;annonce portera le badge de l&apos;équipe.</span>
          </label>
        </div>
      </section>

      <div className="rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
        En publiant, vous acceptez les{" "}
        <Link href="/boutique/conditions" className="text-bayard hover:underline">conditions d&apos;utilisation</Link> de la boutique :
        le Club Bayard héberge les annonces, la vente se fait entre particuliers. Les ventes d&apos;équidés ne sont pas acceptées.
      </div>

      {progress ? <p className="text-sm text-bayard" aria-live="polite">{progress}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
          className="h-12 flex-1 rounded-md bg-bayard text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? "Envoi…" : listing && (listing.status === "publiee" || listing.status === "reservee") ? "Enregistrer les modifications" : "Publier l'annonce"}
        </button>
        <button
          type="submit"
          name="intent"
          value="draft"
          disabled={pending}
          className="h-12 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
        >
          Enregistrer le brouillon
        </button>
      </div>

      <Modal open={demoDone} onClose={() => setDemoDone(false)} title="Annonce enregistrée">
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
