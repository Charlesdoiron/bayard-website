import { permanentRedirect } from "next/navigation";

export default function NotFound() {
  // Site one-page : toute URL inconnue (vieilles pages indexées par Google,
  // anciennes routes, etc.) est redirigée définitivement vers la home.
  permanentRedirect("/");
}
