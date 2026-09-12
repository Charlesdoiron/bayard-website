import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions d'utilisation de la boutique",
  description: "Règles d'utilisation de la boutique du Club Bayard : annonces d'occasion entre particuliers et réservation des goodies du club.",
  alternates: { canonical: "/boutique/conditions" },
};

/**
 * Draft terms. The final wording must be validated by the club (see the
 * spec, §10 « RGPD et cadre légal »).
 */
export default function ConditionsPage() {
  return (
    <article className="mx-auto max-w-2xl py-8 text-sm leading-relaxed text-gray-700 sm:py-12 sm:text-base [&_a]:text-bayard [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_p]:mt-3">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Conditions d&apos;utilisation de la boutique</h1>
      <p className="text-sm text-gray-500">Projet de conditions, version à valider par le club. Dernière mise à jour : septembre 2026.</p>

      <h2>1. Objet</h2>
      <p>
        La boutique en ligne du {SITE_CONFIG.business.name} (« la boutique ») propose deux espaces : un espace
        <strong> Occasion</strong>, où les membres publient des annonces pour vendre entre eux leur équipement
        d&apos;équitation, et un espace <strong>Goodies</strong>, où le club propose ses propres articles à la réservation.
        La boutique ne gère aucun paiement en ligne.
      </p>

      <h2>2. Compte membre</h2>
      <p>
        Publier une annonce, contacter un vendeur ou réserver un goodies nécessite un compte, créé avec une adresse
        email valide. Le titulaire est responsable de la confidentialité de son mot de passe. Le club peut suspendre un
        compte en cas de non-respect des présentes conditions.
      </p>

      <h2>3. Espace Occasion : ventes entre particuliers</h2>
      <p>
        Le club héberge les annonces et met les membres en relation. La vente est conclue directement entre le vendeur
        et l&apos;acheteur, qui conviennent du prix, de la remise (de préférence au club, en main propre) et du paiement.
        Le club n&apos;est pas partie à la transaction, ne perçoit aucune commission et ne garantit ni l&apos;état ni la
        conformité des articles.
      </p>
      <p>
        Le vendeur s&apos;engage à décrire l&apos;article de bonne foi, à publier des photos de l&apos;article réel et à
        mettre à jour le statut de l&apos;annonce (réservée, vendue). Sont interdits : la vente d&apos;équidés, les
        articles contrefaits, dangereux ou sans rapport avec l&apos;équitation. Les équipements de sécurité (casques,
        gilets, protections dorsales) ne peuvent être proposés que s&apos;ils n&apos;ont subi aucune chute ni choc ;
        l&apos;acheteur est invité à les vérifier avant achat.
      </p>
      <p>
        Les annonces sont vérifiées par le club avant publication et retirées automatiquement après 60 jours. Le club
        peut refuser ou retirer une annonce à tout moment, en informant le vendeur.
      </p>

      <h2>4. Espace Goodies : réservation et retrait</h2>
      <p>
        La réservation en ligne vaut demande de mise de côté. Le paiement et le retrait ont lieu au club house ou au
        secrétariat du club. Une réservation non retirée dans les 14 jours suivant l&apos;email « prête à retirer » est
        annulée et les articles remis en vente. Les articles « sur commande » sont commandés auprès du fournisseur
        après confirmation ; le délai indiqué est indicatif.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Les données du compte (identité, email, téléphone facultatif, équipes) servent uniquement au fonctionnement de
        la boutique : publication des annonces, mise en relation, suivi des réservations et emails associés. Seul le
        prénom (et l&apos;initiale du nom) est affiché publiquement. Chaque membre peut consulter, modifier et supprimer
        son compte et ses données depuis son espace. Les comptes inactifs depuis plus de trois ans sont supprimés.
        Contact : <a href={`mailto:${SITE_CONFIG.business.email}`}>{SITE_CONFIG.business.email}</a>.
      </p>

      <h2>6. Signalements</h2>
      <p>
        Tout utilisateur peut signaler une annonce. Le club examine les signalements et prend les mesures appropriées.
      </p>
    </article>
  );
}
