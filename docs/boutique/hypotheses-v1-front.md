# Boutique — hypothèses retenues et état d'avancement

Ce document liste les choix faits pour construire `/boutique` pendant que les points du §11 du cahier des charges
restent à valider. Chaque hypothèse est réversible : elle vit dans un seul fichier ou dans un paramètre du back-office.

## Ce qui est construit

| Périmètre V1 (cahier des charges §2) | État |
|---|---|
| Création de compte et authentification | Fait : inscription avec confirmation d'email, connexion, mot de passe oublié, suppression de compte (RGPD). |
| Espace Occasion : dépôt avec photos, cycle de vie, mise en relation par email | Fait : photos compressées dans le navigateur, modération a priori, statuts vendeur, contact par email avec « répondre à », anti-spam, signalement. |
| Espace Goodies : catalogue géré par le centre, réservation, suivi | Fait : déclinaisons et stock, sur commande, réservation atomique, expiration avec remise en stock, « Mes réservations ». |
| Rattachement aux équipes de compétition | Fait : badge sur les articles, page par équipe, articles réservés aux membres rattachés, gestion des rattachements. |
| Catalogue : recherche, tri, filtres | Fait : filtres Kramer dans l'URL, vue Tout / Occasion / Goodies. |
| Emails automatiques | Fait via Brevo : tout le tableau du §9.2. |
| Back-office | Fait : tableau de bord, modération, annonces, signalements, goodies, réservations avec export CSV, membres et équipes, paramètres. |
| Intégration visuelle | Fait : charte Bayard, lien Boutique dans le menu et le pied de page, UX inspirée de Vinted. |

Sans variables Supabase, le site reste en **mode démonstration** (données fictives). Voir `mise-en-service.md`.

## Design

- UX et UI inspirées de Vinted : grille de cartes photo 3/4 avec cœur favori, ligne vendeur, prix en gras ;
  barre de recherche + bouton « Vends tes articles » ; chips de filtres avec menus déroulants sur desktop et
  panneau plein écran sur mobile ; fiche article avec galerie, bloc prix / actions, carte vendeur, détails.
- Couleurs de la charte Bayard (bleu `#005896` comme accent, défini dans `globals.css` sous `--color-bayard`).
- Catégories et facettes reprises de kramer.fr (rubriques Cavalier et Cheval) : voir
  `src/lib/boutique/taxonomy.ts`. Facettes : Catégorie, Taille (adaptée à la catégorie), Pour qui, Équipe,
  État, Prix, Marque, Couleur, Discipline, Dons, Disponibles, tri.

## Réponses provisoires aux points du §11

| # | Point | Hypothèse retenue | Où changer |
|---|---|---|---|
| 1 | Qui peut vendre ? | Tout membre inscrit (email confirmé). Pas de vérification de licence FFE. Un administrateur peut suspendre un compte. | `supabase/migrations` (politique `listings seller insert`) |
| 2 | Qui peut consulter ? | Catalogue public, indexable (SEO par annonce et par produit). Contacter, réserver, vendre : compte requis. | `middleware.ts` |
| 3 | Modération | A priori : statut « en attente » jusqu'à validation d'un administrateur, email au vendeur. | `actions/listings.ts`, réglage `moderation` en base |
| 4 | Lieu de remise | Au club, en main propre. Texte sur la fiche annonce et dans les emails. | `annonce/[slug]/page.tsx`, `email.ts` |
| 5 | Sécurité d'occasion | Casques et gilets acceptés : engagement du vendeur au dépôt et avertissement sur la fiche. | `sell-form.tsx`, `actions/listings.ts` |
| 6 | Équidés | Exclus (conditions d'utilisation, motif de refus disponible en modération). | `conditions/page.tsx` |
| 7 | Durée d'une annonce, plafond | 60 jours, 20 annonces actives par membre. Modifiables dans Paramètres. | Back-office → Paramètres |
| 8 | Qui gère les goodies | Tout compte « admin » ; les notifications vont à `BOUTIQUE_ADMIN_EMAILS`. | `.env` |
| 9 | Délai de retrait | 14 jours après l'email « prête », puis expiration et remise en stock. Modifiable. | Back-office → Paramètres |
| 10 | Paiement sur place | Hors périmètre du site : le montant « à régler au club » est indiqué, l'admin marque « retirée et payée ». | — |
| 11 | Goodies non-adhérents | Visibles par tous ; réservation avec compte. | — |
| 12 | Précommandes groupées | Option « sur commande » par déclinaison, avec délai indicatif ; confirmation admin possible. | Back-office → Goodies |
| 13 | Liste des équipes | Dressage, Hunter, CCE, Pony-Games, Equifun, sans distinction cheval / poney. | `taxonomy.ts` (`TEAMS`), enum SQL `team_slug` |
| 14 | Qui rattache aux équipes | Les administrateurs, depuis Membres & équipes. | — |
| 15 | Articles d'équipe réservés | Visibles par tous avec la mention « Réservé à l'équipe X » ; réservation refusée aux non-membres. Les tenues revendues d'occasion sont ouvertes à tous. | `create_reservation` (SQL) |
| 16 | Adresse | `/boutique` sur le site actuel. | `menu.tsx`, `footer.tsx` |
| 17 | Références de filtres | Kramer (Cavalier, Cheval). | `taxonomy.ts` |

## Reste à faire hors code

1. Valider le cahier des charges, ces hypothèses et le texte des conditions d'utilisation avec le club.
2. Créer le projet Supabase et renseigner les variables (guide `mise-en-service.md`).
3. Authentifier le domaine d'envoi dans Brevo (SPF/DKIM) pour `boutique@clubbayard.com`.
4. Remplacer les photos de démonstration par de vraies photos produits depuis le back-office.
