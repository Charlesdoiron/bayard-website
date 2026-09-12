# Boutique — hypothèses retenues pour le front V1 (données fictives)

Ce document liste les choix faits pour construire le front de `/boutique` pendant que les points du §11 du
cahier des charges restent à valider. Chaque hypothèse est réversible : elle vit dans un seul fichier.

## Périmètre livré

- Catalogue « Tout », « Occasion », « Goodies du club », avec recherche, tri et filtres reflétés dans l'URL.
- Fiche annonce (`/boutique/annonce/[slug]`), fiche goodies (`/boutique/goodies/[slug]`), page par équipe
  (`/boutique/equipe/[slug]`), page « Vends tes articles » (`/boutique/vendre`).
- Favoris par navigateur (localStorage), en attendant les comptes membres.
- Formulaires « Contacter le vendeur », « Signaler », « Réserver » et « Publier l'annonce » : validation
  locale et confirmation de démonstration. Rien n'est envoyé ni enregistré.
- Données fictives dans `src/lib/boutique/mock-data.ts`. Photos : photos du club en attendant les vraies.
- Accès aux données uniquement via `src/lib/boutique/repository.ts` (fonctions async), pour brancher Supabase
  sans toucher aux pages.

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
| 1 | Qui peut vendre ? | Membres connectés (à venir). Le formulaire est visible par tous en démo. | `vendre/page.tsx` |
| 2 | Qui peut consulter ? | Catalogue public, indexable (SEO par annonce et par produit). | `layout.tsx`, `sitemap.ts` |
| 3 | Modération | A priori : statut « en attente » avant publication. | `types.ts` (`ListingStatus`) |
| 4 | Lieu de remise | Au club, en main propre. Texte dans la fiche annonce. | `annonce/[slug]/page.tsx` |
| 5 | Sécurité d'occasion | Casques et gilets acceptés, avec avertissement sur la fiche et engagement du vendeur au dépôt. | `annonce/[slug]/page.tsx`, `sell-form.tsx` |
| 6 | Équidés | Exclus (mention dans les CGU du formulaire). | `sell-form.tsx` |
| 7 | Durée d'une annonce | 60 jours. Pas de maximum par membre en démo. | `vendre/page.tsx` |
| 9 | Expiration réservation | 14 jours. | `reserve-form.tsx` |
| 11 | Goodies non-adhérents | Visibles par tous ; réservation avec compte (à venir). | — |
| 12 | Précommandes groupées | Gérées par l'option « sur commande » avec délai indicatif. | `mock-data.ts` (`onOrder`) |
| 13 | Liste des équipes | Dressage, Hunter, CCE, Pony-Games, Equifun, sans distinction cheval / poney. | `taxonomy.ts` (`TEAMS`) |
| 15 | Articles d'équipe réservés | Visibles par tous, badge « Réservé à l'équipe X », réservation limitée aux membres rattachés. | `badges.tsx`, `reserve-form.tsx` |
| 16 | Adresse | `/boutique` sur le site actuel, lien « Boutique » dans le menu et le pied de page. | `menu.tsx`, `footer.tsx` |

## Suite

1. Valider le cahier des charges et ces hypothèses avec le club.
2. Créer le projet Supabase (tables `listings`, `products`, `variants`, `reservations`, `profiles`, `teams`),
   l'authentification et le stockage des photos, puis remplacer `mock-data.ts` dans `repository.ts`.
3. Brancher les emails transactionnels (Brevo est déjà une dépendance du site).
4. Back-office administrateur.
