# Boutique — guide de mise en service

La boutique tourne en **mode démonstration** (données fictives, pas de comptes) tant que les variables
Supabase ne sont pas définies. Ce guide décrit comment passer en production. Comptez une heure.

## 1. Créer le projet Supabase

1. Créez un projet sur [supabase.com](https://supabase.com) (région `eu-west` de préférence, données en Europe).
2. Dans **SQL Editor**, exécutez dans l'ordre :
   - `supabase/migrations/0001_boutique.sql` (tables, sécurité, fonctions, buckets de photos) ;
   - `supabase/seed.sql` (les goodies du club, à ajuster ensuite depuis le back-office).

   Ou, avec le CLI : `supabase link --project-ref <ref>` puis `supabase db push` et `psql ... -f supabase/seed.sql`.
3. **Authentication → URL Configuration** :
   - Site URL : `https://club-bayard.fr` (l'URL réelle du site) ;
   - Redirect URLs : `https://club-bayard.fr/boutique/auth/callback` (et l'URL de préproduction si besoin).
4. **Authentication → Email Templates** : dans les gabarits *Confirm signup* et *Reset password*, remplacez le lien par
   `{{ .SiteURL }}/boutique/auth/callback?token_hash={{ .TokenHash }}&type={{ .Type }}&next=/boutique/compte`
   (pour *Reset password*, `next=/boutique/reinitialisation`). Personnalisez les textes en français.
5. **Authentication → Providers → Email** : laissez « Confirm email » activé. Optionnel : activez un captcha
   (Cloudflare Turnstile) dans **Authentication → Attack protection** ; un pot de miel est déjà en place côté formulaire.
6. **Storage** : les buckets `listing-photos` et `product-photos` sont créés par la migration (lecture publique,
   écriture limitée au propriétaire ou aux administrateurs).

## 2. Variables d'environnement

Copiez `.env.example` et renseignez, sur Scalingo (**Environment**) ou en local (`.env.local`) :

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | même page, clé `anon` / `publishable` |
| `SUPABASE_SERVICE_ROLE_KEY` | même page, clé `service_role` (secrète, serveur uniquement) |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site, sans `/` final |
| `BREVO_API_KEY` | déjà utilisée par la newsletter |
| `BOUTIQUE_EMAIL_FROM` / `BOUTIQUE_EMAIL_FROM_NAME` | expéditeur des emails (domaine authentifié SPF/DKIM dans Brevo → Senders & IP → Domains) |
| `BOUTIQUE_ADMIN_EMAILS` | destinataires des notifications (modération, signalements, réservations), séparés par des virgules |
| `BOUTIQUE_CRON_SECRET` | une chaîne aléatoire longue (`openssl rand -hex 32`) |

Redéployez : dès que les deux variables `NEXT_PUBLIC_SUPABASE_*` existent au build, le site quitte le mode démonstration.

## 3. Premier administrateur

1. Créez votre compte sur `/boutique/inscription` et confirmez l'email.
2. Dans Supabase → SQL Editor :
   ```sql
   update public.profiles set role = 'admin' where email = 'secretariat@clubbayard.com';
   ```
3. Reconnectez-vous : « Administration » apparaît dans le menu du compte. Les administrateurs suivants se nomment depuis
   **Administration → Membres & équipes**.

## 4. Tâche planifiée (expirations)

`cron.json` déclare une tâche Scalingo quotidienne (3 h 15) qui appelle `GET /api/boutique/cron` avec le secret. Elle :

- expire les annonces publiées depuis plus de 60 jours (paramétrable) ;
- expire les réservations non retirées et remet le stock en vente, avec email au membre ;
- prévient les vendeurs 5 jours avant l'expiration de leur annonce.

Sur un autre hébergeur, planifiez l'équivalent :
`curl -H "Authorization: Bearer $BOUTIQUE_CRON_SECRET" https://club-bayard.fr/api/boutique/cron`.

## 5. Vérifications après déploiement

- `/boutique` affiche les goodies du seed et plus le bandeau « Version de démonstration ».
- Inscription → email de confirmation → `/boutique/compte`.
- Dépôt d'une annonce test → email « Nouvelle annonce à modérer » → publication depuis `/boutique/admin/moderation` →
  email « Votre annonce est en ligne ».
- Réservation d'un goodies → email récapitulatif + notification admin → passage en « prête » → email « C'est prêt ».
- Appel manuel du cron : `curl -H "Authorization: Bearer …" https://…/api/boutique/cron` renvoie `{"ok":true,…}`.

## 6. Réglages du quotidien

- **Administration → Paramètres** : durée des annonces, délai de retrait, plafond d'annonces, anti-spam.
- **Administration → Goodies** : produits, photos, déclinaisons et stock, articles « sur commande », visibilité.
- **Administration → Membres & équipes** : rattachement aux équipes (accès aux tenues réservées), suspension, droits.
- **Administration → Réservations** : confirmer, marquer prête (email automatique), retirée et payée, export CSV.
- Les catégories, tailles, marques et équipes sont dans `src/lib/boutique/taxonomy.ts`.

## 7. Données personnelles

- Chaque membre peut modifier son profil et supprimer son compte (`/boutique/compte`), ce qui efface ses annonces,
  réservations, messages et photos.
- Les adresses email ne sont visibles que du membre et des administrateurs ; le public voit « Prénom N. ».
- Les conditions d'utilisation (`/boutique/conditions`) sont un projet à valider avec le club.
