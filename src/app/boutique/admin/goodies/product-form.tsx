"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { GOODIES_CATEGORIES, TEAMS } from "@/lib/boutique/taxonomy";
import type { Product } from "@/lib/boutique/types";
import { compressImage } from "@/lib/boutique/image";
import { getBrowserClient } from "@/lib/supabase/client";
import { saveProduct } from "../../actions/admin";
import type { ActionResult } from "../../actions/types";
import { Field, FormMessage, inputClass, textareaClass } from "../../components/form-ui";

interface Photo {
  id: string;
  url: string;
  file?: File;
  uploaded?: string;
}

interface VariantDraft {
  key: string;
  id?: string;
  label: string;
  stock: number;
  onOrder: boolean;
  leadTime: string;
}

const MAX_PHOTOS = 6;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(
    () => product?.images.map((url, i) => ({ id: `existing-${i}`, url, uploaded: url })) ?? [],
  );
  const [variants, setVariants] = useState<VariantDraft[]>(
    () =>
      product?.variants.map((v) => ({ key: v.id, id: v.id, label: v.label, stock: v.stock, onOrder: !!v.onOrder, leadTime: v.leadTime ?? "" })) ??
      [{ key: "new-0", label: "Taille unique", stock: 0, onOrder: false, leadTime: "" }],
  );
  const [team, setTeam] = useState(product?.team ?? "");
  const [result, setResult] = useState<ActionResult>({ ok: false });
  const [progress, setProgress] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const errors = result.fieldErrors ?? {};

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    setPhotos((prev) => [...prev, ...accepted.map((f) => ({ id: `${f.name}-${Date.now()}`, url: URL.createObjectURL(f), file: f }))]);
  };

  const updateVariant = (key: string, patch: Partial<VariantDraft>) =>
    setVariants((vs) => vs.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  const addVariant = () => setVariants((vs) => [...vs, { key: `new-${Date.now()}`, label: "", stock: 0, onOrder: false, leadTime: "" }]);

  const removeVariant = (key: string) => setVariants((vs) => vs.filter((v) => v.key !== key));

  const move = (index: number, delta: number) =>
    setVariants((vs) => {
      const next = [...vs];
      const target = index + delta;
      if (target < 0 || target >= next.length) return vs;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const uploadPhotos = async (): Promise<string[]> => {
    const supabase = getBrowserClient();
    if (!supabase) throw new Error("Supabase indisponible");
    const folder = product?.id ?? crypto.randomUUID();
    const urls: string[] = [];
    for (const [i, photo] of photos.entries()) {
      if (photo.uploaded) {
        urls.push(photo.uploaded);
        continue;
      }
      setProgress(`Envoi de la photo ${i + 1} sur ${photos.length}…`);
      const blob = await compressImage(photo.file!);
      const path = `${folder}/${Date.now()}-${i}.jpg`;
      const { error } = await supabase.storage.from("product-photos").upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw new Error(`Photo ${i + 1} : ${error.message}`);
      const { data } = supabase.storage.from("product-photos").getPublicUrl(path);
      urls.push(data.publicUrl);
      photo.uploaded = data.publicUrl;
    }
    setProgress(null);
    return urls;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const urls = await uploadPhotos();
        formData.delete("images");
        urls.forEach((u) => formData.append("images", u));
        formData.set("variants", JSON.stringify(variants.map(({ id, label, stock, onOrder, leadTime }) => ({ id, label, stock, onOrder, leadTime }))));
        const res = await saveProduct({ ok: false }, formData);
        setResult(res);
        if (res.ok) router.push("/boutique/admin/goodies");
        else window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setProgress(null);
        setResult({ ok: false, message: err instanceof Error ? err.message : "Enregistrement impossible." });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <FormMessage result={result} />

      <section>
        <h2 className="text-base font-semibold text-gray-900">Photos</h2>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((p, i) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image src={p.url} alt={`Photo ${i + 1}`} fill unoptimized sizes="120px" className="object-cover" />
              <button type="button" onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))} aria-label="Retirer" className="absolute right-1 top-1 flex h-7 w-7 min-h-0 min-w-0 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-xs font-medium text-gray-600 hover:border-bayard hover:text-bayard">
              <Camera className="h-6 w-6" aria-hidden="true" />
              Ajouter
              <input type="file" accept="image/*" multiple onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} className="sr-only" />
            </label>
          ) : null}
        </div>
        {errors.images ? <p className="mt-2 text-xs text-red-600">{errors.images}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" name="name" error={errors.name}>
          <input id="name" name="name" required defaultValue={product?.name} className={inputClass} />
        </Field>
        <Field label="Catégorie" name="category" error={errors.category}>
          <select id="category" name="category" required defaultValue={product?.category ?? ""} className={inputClass}>
            <option value="">Choisir…</option>
            {GOODIES_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description" name="description" error={errors.description}>
            <textarea id="description" name="description" required rows={4} defaultValue={product?.description} className={textareaClass} />
          </Field>
        </div>
        <Field label="Prix (€)" name="price" error={errors.price}>
          <input id="price" name="price" type="number" min={0} step={0.5} required defaultValue={product?.price} className={inputClass} />
        </Field>
        <Field label="Ordre d'affichage" name="sort_order" hint="Les plus petits d'abord.">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Note de taille / essayage" name="size_note" hint="Affichée sous la description.">
            <input id="size_note" name="size_note" defaultValue={product?.sizeNote} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Équipe de compétition" name="team" error={errors.team}>
          <select id="team" name="team" value={team} onChange={(e) => setTeam(e.target.value)} className={inputClass}>
            <option value="">Aucune</option>
            {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
          </select>
        </Field>
        <div className="flex flex-col justify-end gap-3">
          <label className={`flex items-center gap-2 text-sm ${team ? "text-gray-900" : "text-gray-400"}`}>
            <input type="checkbox" name="team_only" disabled={!team} defaultChecked={product?.teamOnly} className="h-4 w-4 accent-bayard" />
            Réservé aux membres de l&apos;équipe
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-900">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? false} className="h-4 w-4 accent-bayard" />
            Publié dans la boutique
          </label>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Déclinaisons et stock</h2>
          <button type="button" onClick={addVariant} className="inline-flex h-9 items-center gap-1 rounded-md border border-gray-300 px-3 text-xs font-medium text-gray-800 hover:bg-gray-50">
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Une ligne par taille ou couleur. « Sur commande » : pas de stock, délai indicatif, précommandes acceptées.</p>
        {errors.variants ? <p className="mt-1 text-xs text-red-600">{errors.variants}</p> : null}
        <ul className="mt-3 space-y-2">
          {variants.map((v, i) => (
            <li key={v.key} className="grid grid-cols-[auto_1fr_5rem_auto_1fr_auto] items-center gap-2 rounded-lg border border-gray-200 p-2 text-sm">
              <span className="flex flex-col text-gray-400">
                <button type="button" onClick={() => move(i, -1)} aria-label="Monter" className="h-4 w-4 min-h-0 min-w-0 leading-none">▲</button>
                <GripVertical className="h-4 w-4" aria-hidden="true" />
                <button type="button" onClick={() => move(i, 1)} aria-label="Descendre" className="h-4 w-4 min-h-0 min-w-0 leading-none">▼</button>
              </span>
              <input value={v.label} onChange={(e) => updateVariant(v.key, { label: e.target.value })} placeholder="Taille (ex. M, 10 ans, Full)" aria-label="Déclinaison" className="h-10 rounded-md border border-gray-300 px-2" />
              <input type="number" min={0} value={v.stock} onChange={(e) => updateVariant(v.key, { stock: Math.max(0, Number(e.target.value) || 0) })} disabled={v.onOrder} aria-label="Stock" className="h-10 rounded-md border border-gray-300 px-2 disabled:bg-gray-50 disabled:text-gray-400" />
              <label className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-700">
                <input type="checkbox" checked={v.onOrder} onChange={(e) => updateVariant(v.key, { onOrder: e.target.checked })} className="h-4 w-4 accent-bayard" />
                Sur commande
              </label>
              <input value={v.leadTime} onChange={(e) => updateVariant(v.key, { leadTime: e.target.value })} disabled={!v.onOrder} placeholder="Délai (ex. 6 à 8 semaines)" aria-label="Délai" className="h-10 rounded-md border border-gray-300 px-2 disabled:bg-gray-50 disabled:text-gray-400" />
              <button type="button" onClick={() => removeVariant(v.key)} aria-label="Supprimer la déclinaison" className="flex h-9 w-9 min-h-0 min-w-0 items-center justify-center rounded-md text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {progress ? <p className="text-sm text-bayard" aria-live="polite">{progress}</p> : null}
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="h-11 rounded-md bg-bayard px-6 text-sm font-semibold text-white hover:bg-bayard-dark disabled:cursor-wait disabled:opacity-60">
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" onClick={() => router.push("/boutique/admin/goodies")} className="h-11 rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-800">
          Annuler
        </button>
      </div>
    </form>
  );
}
