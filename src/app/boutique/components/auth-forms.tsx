"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { requestPasswordReset, signIn, signUp, updatePassword } from "../actions/auth";
import { idle } from "../actions/types";
import { Field, FormMessage, SubmitButton, inputClass } from "./form-ui";

/** A rejected submit sends focus to the first field the server refused. */
function useFocusFirstError(fieldErrors: Record<string, string> | undefined) {
  useEffect(() => {
    const first = fieldErrors && Object.keys(fieldErrors)[0];
    if (first) document.getElementById(first)?.focus();
  }, [fieldErrors]);
}

export function SignInForm({ next, initialMessage }: { next: string; initialMessage?: string }) {
  const [result, action] = useActionState(signIn, initialMessage ? { ok: false, message: initialMessage } : idle);
  useFocusFirstError(result.fieldErrors);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage result={result} />
      <Field label="Email" name="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Field label="Mot de passe" name="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <SubmitButton className="w-full" pendingLabel="Connexion…">Se connecter</SubmitButton>
      <div className="flex flex-col gap-1 text-center text-sm">
        <Link href="/boutique/mot-de-passe-oublie" className="text-bayard hover:underline">Mot de passe oublié ?</Link>
        <p className="text-gray-600">
          Pas encore de compte ?{" "}
          <Link href={`/boutique/inscription?next=${encodeURIComponent(next)}`} className="font-medium text-bayard hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [result, action] = useActionState(signUp, idle);
  const errors = result.fieldErrors ?? {};
  useFocusFirstError(result.fieldErrors);
  if (result.ok) {
    return (
      <div className="space-y-4 text-center">
        <FormMessage result={result} />
        <p className="text-sm text-gray-600">
          Une fois votre adresse confirmée, vous pourrez déposer des annonces et réserver des goodies.
        </p>
        <Link href="/boutique" className="inline-flex h-11 items-center rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-800">
          Retour à la boutique
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {/* Honeypot: hidden from humans, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <FormMessage result={result} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="first_name" error={errors.first_name}>
          <input id="first_name" name="first_name" autoComplete="given-name" required className={inputClass} />
        </Field>
        <Field label="Nom" name="last_name" hint="Seule l'initiale est affichée sur vos annonces.">
          <input id="last_name" name="last_name" autoComplete="family-name" className={inputClass} />
        </Field>
      </div>
      <Field label="Email" name="email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Field label="Mot de passe" name="password" error={errors.password} hint="8 caractères minimum.">
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </Field>
      <div>
        <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
          <input type="checkbox" name="terms" required className="mt-0.5 h-4 w-4 accent-bayard" />
          <span>
            J&apos;accepte les <Link href="/boutique/conditions" className="text-bayard hover:underline">conditions d&apos;utilisation</Link> de la boutique.
            Les ventes d&apos;occasion se font entre particuliers, le club héberge les annonces.
          </span>
        </label>
        {errors.terms ? <p className="mt-1 text-xs text-red-600">{errors.terms}</p> : null}
      </div>
      <SubmitButton className="w-full" pendingLabel="Création…">Créer mon compte</SubmitButton>
      <p className="text-center text-sm text-gray-600">
        Déjà membre ?{" "}
        <Link href={`/boutique/connexion?next=${encodeURIComponent(next)}`} className="font-medium text-bayard hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [result, action] = useActionState(requestPasswordReset, idle);
  useFocusFirstError(result.fieldErrors);
  return (
    <form action={action} className="space-y-4">
      <FormMessage result={result} />
      {!result.ok ? (
        <>
          <Field label="Email" name="email" error={result.fieldErrors?.email}>
            <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
          </Field>
          <SubmitButton className="w-full" pendingLabel="Envoi…">Recevoir le lien</SubmitButton>
        </>
      ) : null}
      <p className="text-center text-sm">
        <Link href="/boutique/connexion" className="text-bayard hover:underline">Retour à la connexion</Link>
      </p>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [result, action] = useActionState(updatePassword, idle);
  const errors = result.fieldErrors ?? {};
  useFocusFirstError(result.fieldErrors);
  return (
    <form action={action} className="space-y-4">
      <FormMessage result={result} />
      {result.ok ? (
        <Link href="/boutique/compte" className="inline-flex h-11 w-full items-center justify-center rounded-md bg-bayard px-5 text-sm font-semibold text-white">
          Aller à mon compte
        </Link>
      ) : (
        <>
          <Field label="Nouveau mot de passe" name="password" error={errors.password} hint="8 caractères minimum.">
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
          </Field>
          <Field label="Confirmer" name="confirm" error={errors.confirm}>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
          </Field>
          <SubmitButton className="w-full" pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </>
      )}
    </form>
  );
}
