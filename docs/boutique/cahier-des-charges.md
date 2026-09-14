# Cahier des charges — Boutique Club Bayard

**Occasion entre cavaliers & goodies du club**

**Version :** 0.2 (brouillon à valider)
**Rédaction :** Fragile Studio
**Date :** septembre 2026

---

## 1. Contexte et objectif

Le Club Bayard souhaite proposer à sa communauté une boutique en ligne en deux espaces :

1. **Occasion** : les membres vendent entre eux leur équipement d'équitation d'occasion (matériel du cavalier, du cheval et du poney).
2. **Goodies** : le centre présente et vend ses propres articles (textile, accessoires aux couleurs du club, tenues d'équipe…).

Une partie de l'équipement est liée à la compétition, et plus précisément aux équipes du club : Dressage, Hunter, CCE, Pony-Games, Equifun. Ces articles doivent être identifiables comme tels dans les deux espaces.

**Principe clé :** le site ne gère aucun paiement.
- **Occasion :** mise en relation entre particuliers. Paiement et remise en main propre, de préférence au centre.
- **Goodies :** réservation en ligne, puis paiement et retrait au club house ou au secrétariat.

---

## 2. Périmètre

### Inclus (V1)
- Création de compte et authentification
- **Espace Occasion :** dépôt d'annonces avec photos, cycle de vie des annonces, mise en relation par email
- **Espace Goodies :** catalogue géré par le centre, réservation d'articles, suivi des réservations
- Rattachement des articles aux équipes de compétition
- Catalogue avec recherche, tri et filtres (communs aux deux espaces)
- Emails automatiques (transactionnels)
- Back-office pour l'équipe du club (modération, goodies, réservations, équipes)
- Intégration visuelle avec clubbayard.com

### Exclus (V1)
- Paiement en ligne, commission, facturation
- Messagerie instantanée intégrée
- Livraison ou expédition
- Application mobile native (le site sera responsive)
- Vente d'équidés *(voir point à valider §11)*

---

## 3. Utilisateurs et rôles

| Rôle | Peut… |
|---|---|
| **Visiteur** (non connecté) | Consulter les annonces et les goodies, rechercher, filtrer |
| **Membre** (connecté) | Tout ce que fait le visiteur, plus : publier des annonces, contacter un vendeur, réserver des goodies, suivre ses réservations |
| **Membre d'équipe** | Membre rattaché à une ou plusieurs équipes de compétition par un administrateur. Accède aux articles réservés à son équipe *(à valider §11)* |
| **Administrateur** (équipe du club) | Modérer les annonces, gérer les goodies et le stock, traiter les réservations, gérer les membres et les équipes |

Un membre peut être à la fois vendeur, acheteur et client des goodies.

---

## 4. Parcours principaux

1. **Vendre d'occasion :** créer un compte → déposer une annonce → (modération) → publication → recevoir des demandes → marquer « réservée », puis « vendue ».
2. **Acheter d'occasion :** parcourir → filtrer → contacter le vendeur → échange par email → remise en main propre.
3. **Réserver un goodies :** parcourir l'espace Goodies → choisir la taille et la quantité → réserver → email « prête à retirer » → paiement et retrait au club.
4. **Gérer les goodies (admin) :** créer un produit → gérer les tailles et le stock → traiter les réservations → marquer « retirée ».
5. **Modérer (admin) :** valider ou refuser les annonces → traiter les signalements.

---

## 5. Espace Occasion

### 5.1 Annonces — champs

| Champ | Type | Obligatoire |
|---|---|---|
| Titre | Texte court (80 car. max) | Oui |
| Catégorie / sous-catégorie | Liste (voir §8) | Oui |
| Pour qui | Cavalier adulte / Cavalier enfant / Cheval / Poney / Shetland | Oui |
| Taille | Selon la catégorie (voir §8) | Selon catégorie |
| Marque | Texte avec suggestions | Non |
| État de l'article | Neuf avec étiquette / Très bon état / Bon état / Satisfaisant | Oui |
| Prix | Montant en €. « Don » possible (prix 0) | Oui |
| Description | Texte long | Oui |
| Photos | 1 à 6 images, compressées automatiquement | Au moins 1 |
| Discipline | CSO / Dressage / CCE / Hunter / Pony-games / Loisir… | Non |
| **Équipe de compétition** | Aucune / Dressage / Hunter / CCE / Pony-Games / Equifun | Non |

Le champ **Équipe** signale un article de tenue ou d'équipement d'équipe (veste, polo, tapis aux couleurs de l'équipe…). Il permet notamment à un cavalier qui quitte une équipe de revendre sa tenue à un nouvel arrivant. L'article porte alors un badge « Équipe CCE », « Équipe Dressage », etc.

La date de publication est automatique. L'identité du vendeur se limite à son prénom (et à l'initiale de son nom si besoin).

### 5.2 Annonces — cycle de vie

| Statut | Visible publiquement | Déclencheur |
|---|---|---|
| Brouillon | Non | Annonce enregistrée mais non soumise |
| En attente de validation | Non | Soumise *(si modération a priori)* |
| Publiée | Oui | Validée, ou publication directe |
| Réservée | Oui, avec badge « Réservé » | Action du vendeur |
| Vendue | Oui 7 jours (badge), puis masquée | Action du vendeur |
| Expirée | Non | Automatique après X jours sans mise à jour |
| Refusée | Non | Action d'un administrateur, avec motif envoyé au vendeur |
| Retirée | Non | Action du vendeur ou d'un administrateur |

Le vendeur peut remettre en ligne une annonce expirée en un clic.

### 5.3 Mise en relation

- Sur une annonce, le bouton « Contacter le vendeur » ouvre un formulaire (message libre). Il faut être connecté.
- Le message est transmis par email au vendeur. L'adresse de l'acheteur est placée en « répondre à ».
- L'adresse email du vendeur n'est jamais affichée publiquement.
- Une limite anti-spam s'applique (nombre de messages par heure et par compte).
- Tout utilisateur peut signaler une annonce.

---

## 6. Espace Goodies (géré par le centre)

### 6.1 Principe
- Les articles sont créés et gérés uniquement par les administrateurs.
- Ils sont clairement distingués de l'occasion : rubrique dédiée et badge « Boutique officielle ».
- Comme le paiement ne se fait pas en ligne, le membre **réserve** en ligne, puis **paie et retire** l'article au club.

### 6.2 Fiche produit — champs

| Champ | Type | Obligatoire |
|---|---|---|
| Nom | Texte court | Oui |
| Catégorie | Textile / Accessoires cavalier / Accessoires cheval / Tenue d'équipe / Divers | Oui |
| Description | Texte long | Oui |
| Photos | 1 à 6 images | Au moins 1 |
| Prix | Montant en € | Oui |
| Déclinaisons | Tailles et/ou couleurs, chacune avec son stock | Selon produit |
| Stock | Quantité par déclinaison. Option « sur commande » (sans stock, délai indiqué) | Oui |
| **Équipe de compétition** | Aucune / Dressage / Hunter / CCE / Pony-Games / Equifun | Non |
| Réservé aux membres de l'équipe | Oui / Non | Si équipe renseignée |
| Visibilité | Publié / Masqué | Oui |

### 6.3 Réservation
- Le membre choisit la déclinaison et la quantité, puis confirme sa réservation (panier simple, un ou plusieurs articles).
- Le stock disponible est décrémenté dès la réservation, puis réajusté en cas d'annulation ou d'expiration.
- Une réservation non retirée expire au bout de X jours et l'article est remis en stock.
- Le membre peut annuler tant que la réservation n'est pas marquée « prête ».

### 6.4 Réservations — cycle de vie

| Statut | Déclencheur |
|---|---|
| Demandée | Réservation faite par le membre |
| Confirmée | Validée par un administrateur (utile pour les articles sur commande) |
| Prête à retirer | L'article est disponible au club — email au membre |
| Retirée et payée | Action d'un administrateur au moment du retrait |
| Annulée | Action du membre ou d'un administrateur |
| Expirée | Automatique si non retirée après X jours |

### 6.5 Articles d'équipe
- Un goodies peut être rattaché à une équipe (ex. polo Équipe Pony-Games).
- S'il est marqué « réservé aux membres de l'équipe », seuls les membres rattachés à cette équipe peuvent le réserver. Il reste visible pour les autres, avec la mention « Réservé à l'équipe X » *(à valider §11)*.
- Des commandes groupées de tenues pour une équipe (précommande avant une date limite, puis commande au fournisseur) sont possibles via l'option « sur commande ».

---

## 7. Catalogue : recherche, tri et filtres

**Navigation :** deux onglets, « Occasion » et « Goodies du club », plus une vue « Tout ».

**Recherche :** plein texte sur le titre, la description et la marque.

**Tri :**
- Plus récents (par défaut)
- Prix croissant
- Prix décroissant

**Filtres :**
- Espace (Occasion / Goodies)
- Catégorie / sous-catégorie
- **Équipe de compétition**
- Pour qui (cavalier adulte, enfant, cheval, poney, shetland)
- Taille (le filtre s'adapte à la catégorie choisie)
- Fourchette de prix
- État de l'article (occasion uniquement)
- Marque
- Discipline
- Disponibles uniquement (masque les articles réservés ou en rupture)
- Dons uniquement

Les filtres sont combinables, reflétés dans l'URL (pour pouvoir partager une recherche) et utilisables sur mobile (panneau dédié).

Une page par équipe (ex. `/boutique/equipe/cce`) regroupe tous les articles de l'équipe, occasion et goodies confondus. Elle peut servir de lien à partager avec les membres de l'équipe.

> **Références à intégrer :** *[sites de référence fournis par l'équipe — à compléter]*

---

## 8. Catégories et tailles (proposition)

**Cavalier**
- Casques / bombes — tour de tête (cm) ou taille (XS–XL)
- Gilets de protection / airbags — taille adulte ou enfant
- Bottes, boots, mini-chaps — pointure, et hauteur/tour de mollet pour les bottes
- Pantalons — taille (34–46) ou âge (enfant)
- Vestes de concours, polos, blousons — taille ou âge
- Gants, cravaches, éperons

**Cheval / poney**
- Selles — taille en pouces (15"–18"), type (mixte, obstacle, dressage), largeur d'arcade
- Filets, brides, licols — taille (shetland, poney, cob, full, XFull)
- Tapis, amortisseurs, bonnets
- Couvertures, chemises — taille en cm (ex. 105–165)
- Protections (guêtres, cloches, protège-boulets) — taille
- Sangles — longueur en cm

**Écurie et divers**
- Pansage, soins, rangement, accessoires

---

## 9. Fonctions transverses

### 9.1 Comptes
- Inscription par email et mot de passe, avec validation de l'email obligatoire. Une connexion par lien magique est à envisager.
- Mot de passe oublié / réinitialisation.
- Profil : prénom, nom, téléphone (facultatif), équipe(s) de compétition (renseignées par un administrateur uniquement).
- Espaces « Mes annonces » et « Mes réservations ».
- Suppression du compte par l'utilisateur (obligation RGPD).

### 9.2 Emails automatiques

| Email | Destinataire |
|---|---|
| Validation de l'email / réinitialisation du mot de passe | Membre |
| Annonce publiée / refusée (avec motif) / bientôt expirée | Vendeur |
| Nouvelle demande de contact (+ copie à l'expéditeur) | Vendeur / Acheteur |
| Réservation goodies enregistrée | Membre |
| Réservation prête à retirer | Membre |
| Réservation annulée / expirée | Membre |
| Nouvelle annonce à modérer / nouveau signalement | Administrateurs |
| Nouvelle réservation goodies | Administrateurs |

Les emails sont envoyés depuis une adresse du domaine du club (ex. `boutique@clubbayard.com`), aux couleurs du club.

### 9.3 Back-office administrateur
- **Occasion :** file de modération, liste des annonces, traitement des signalements
- **Goodies :** création et modification des produits, déclinaisons, stock, visibilité
- **Réservations :** liste filtrable par statut, passage en « prête », « retirée et payée » ou « annulée », export CSV
- **Équipes :** rattacher ou détacher des membres de chaque équipe
- **Membres :** liste des membres, suspension d'un compte
- **Référentiels :** catégories, tailles, marques
- **Statistiques :** annonces actives, ventes déclarées, réservations, articles les plus demandés

---

## 10. Exigences non fonctionnelles et technique

- **Mobile d'abord :** usage majoritaire sur téléphone, souvent depuis le centre.
- **Intégration :** même charte graphique que clubbayard.com, lien « Boutique » dans le menu.
- **Performance :** images optimisées automatiquement.
- **Accessibilité :** contrastes, navigation au clavier, textes alternatifs.
- **SEO :** une page indexable par annonce et par produit.
- **Sécurité :** mots de passe chiffrés, captcha léger à l'inscription, limitation des envois.

### RGPD et cadre légal
- CGU à rédiger. Pour l'occasion, le club agit comme hébergeur des annonces et les transactions se font entre particuliers. Pour les goodies, le club est vendeur.
- Politique de confidentialité et mentions légales à mettre à jour.
- Suppression du compte et des données sur demande.
- Durée de conservation des données des comptes inactifs à définir.

### Architecture (proposition)
- **Front :** Next.js, dans la continuité du site actuel (`/boutique` ou `boutique.clubbayard.com`).
- **Base de données, authentification, photos :** Supabase.
- **Emails :** service transactionnel (ex. Resend), domaine authentifié (SPF/DKIM).
- **Hébergement :** Vercel.

---

## 11. Points à valider avec l'équipe

**Occasion**
1. **Qui peut vendre ?** Uniquement les adhérents (avec vérification, par exemple via la licence FFE), ou tout le monde ?
2. **Qui peut consulter et acheter ?** Catalogue public ou réservé aux membres ?
3. **Modération :** a priori ou a posteriori ? Qui modère, et avec quel délai ?
4. **Lieu de remise :** point de rencontre ou dépôt au club house ?
5. **Équipements de sécurité d'occasion :** accepte-t-on les casques et gilets de protection ? Avertissement obligatoire, interdiction, ou engagement du vendeur ?
6. **Vente de chevaux et poneys :** exclue (recommandé) ou acceptée ?
7. **Durée de vie d'une annonce** : 30, 60 ou 90 jours ? Nombre maximum d'annonces par membre ?

**Goodies**
8. **Qui gère les goodies au quotidien** (stock, réservations, retraits) : secrétariat, club house, bénévoles de l'association ?
9. **Lieu et horaires de retrait**, et délai avant expiration d'une réservation non retirée ?
10. **Moyens de paiement sur place**, et ventes associatives (CBE) ou UCPA ? Cela a un impact sur les CGU et la facturation.
11. **Goodies accessibles aux non-adhérents** (parents, public) ?
12. **Précommandes groupées** de tenues d'équipe : besoin réel en V1 ?

**Équipes de compétition**
13. **Liste des équipes** à retenir : Dressage, Hunter, CCE, Pony-Games, Equifun, avec une distinction cheval / poney ?
14. **Qui rattache les membres aux équipes** (coachs, secrétariat) ?
15. **Articles d'équipe réservés** aux membres de l'équipe, ou ouverts à tous ? Même question pour les tenues d'équipe revendues d'occasion.

**Général**
16. **Adresse et nom** de la boutique ?
17. **Références de filtres :** sites de référence à fournir.

---

## 12. Validation

| Rôle | Nom | Date | Validé |
|---|---|---|---|
| Direction du club | | | ☐ |
| Équipe UCPA | | | ☐ |
| Fragile Studio | Charles D'Oiron | | ☐ |
