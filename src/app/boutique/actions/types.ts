/** Shape returned by every boutique server action, consumed by useActionState. */
export interface ActionResult {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Optional payload (e.g. created slug) for the client. */
  data?: Record<string, string>;
}

export const DEMO_MESSAGE =
  "Version de démonstration : les comptes membres et l'envoi de données seront activés avec la mise en service de la base.";

export const idle: ActionResult = { ok: false };
