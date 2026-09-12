# bayard-website

Site vitrine Next.js (App Router, TypeScript, Tailwind CSS), déployé sur Scalingo. Gestionnaire de paquets : Yarn.

Commandes utiles :

```bash
yarn dev      # serveur de développement
yarn build    # build de production
yarn lint     # ESLint
```

## Workflow agent : pstack / poteto-mode

Ce dépôt utilise le plugin Claude Code `pstack` (déclaré dans `.claude/settings.json`). Pour toute tâche d'ingénierie non triviale (feature, bug, refactor, perf), passe par le skill `pstack:poteto-mode`, qui route ensuite vers les skills spécialisés (`pstack:tdd`, `pstack:architect`, `pstack:how`, `pstack:why`, `pstack:arena`, `pstack:interrogate`). Les questions pures et les modifications d'une ligne n'en ont pas besoin.

Modèles par rôle pour les skills pstack :

@.claude/pstack-models.md
