# 💬 Configuration Crisp Chat

## Étapes de Configuration

### 1. Créer un Compte Crisp
1. Aller sur [crisp.chat](https://crisp.chat)
2. Créer un compte gratuit (jusqu'à 2 agents)
3. Créer un nouveau site web

### 2. Récupérer le Website ID
1. Dans le dashboard Crisp, aller dans **Settings** → **Website Settings**
2. Copier le **Website ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### 3. Configurer le Website ID dans le Projet
1. Ouvrir le fichier `client/index.html`
2. Remplacer `CRISP_WEBSITE_ID_PLACEHOLDER` par votre Website ID réel
3. Exemple :
   ```javascript
   window.CRISP_WEBSITE_ID="12345678-1234-1234-1234-123456789abc";
   ```

### 4. Personnalisation (Optionnel)

#### Couleur du Widget
Dans le dashboard Crisp :
1. **Settings** → **Chatbox & Email**
2. **Chatbox Appearance** → Choisir la couleur (recommandé: #F97316 pour matcher le thème orange)

#### Messages Automatiques
1. **Settings** → **Chatbox & Email**
2. **Chatbox Triggers** → Créer des messages automatiques :
   - **Bienvenue** : "Bonjour ! 👋 Besoin d'aide pour clarifier votre message ?"
   - **Après 30s** : "Une question sur le Sprint de Clarté ? Je suis là pour vous aider !"
   - **Sur page Sprint** : "Intéressé par le Sprint de Clarté ? Posez-moi vos questions !"

#### Disponibilité
1. **Settings** → **Team Availability**
2. Configurer les heures de disponibilité
3. Message hors ligne : "Nous sommes actuellement hors ligne. Laissez-nous un message et nous vous répondrons rapidement !"

### 5. Intégrations Avancées (Optionnel)

#### Email
- Connecter votre email pour recevoir les messages hors ligne
- **Settings** → **Email Integration**

#### Slack
- Recevoir les messages Crisp dans Slack
- **Settings** → **Integrations** → **Slack**

#### CRM
- Synchroniser avec HubSpot, Salesforce, etc.
- **Settings** → **Integrations**

## Fonctionnalités Disponibles

### Chat en Direct
- ✅ Réponses en temps réel
- ✅ Historique des conversations
- ✅ Fichiers et images
- ✅ Emojis et GIFs

### Automatisation
- ✅ Messages automatiques déclenchés
- ✅ Chatbot simple (plan payant)
- ✅ Réponses pré-enregistrées

### Analytics
- ✅ Nombre de conversations
- ✅ Temps de réponse moyen
- ✅ Satisfaction client
- ✅ Pages visitées par utilisateur

### Mobile
- ✅ Application iOS/Android pour les agents
- ✅ Notifications push
- ✅ Réponses depuis mobile

## Avantages pour Sionohmair Insight Academy

### Augmentation des Conversions
- **+15-20%** de conversions grâce au support instantané
- Réponses immédiates aux objections
- Accompagnement personnalisé

### Qualification des Leads
- Identifier les leads chauds en temps réel
- Comprendre les besoins précis
- Orienter vers l'offre adaptée (Sprint, N3, IA)

### Réduction du Temps de Vente
- Réponses instantanées vs emails (24-48h)
- Résolution rapide des questions
- Prise de rendez-vous directe

### Insights Clients
- Questions fréquentes → améliorer le site
- Objections récurrentes → ajuster le message
- Besoins non couverts → nouvelles offres

## Meilleures Pratiques

### Temps de Réponse
- **< 2 minutes** : Excellent (taux de conversion maximal)
- **2-5 minutes** : Bon
- **> 5 minutes** : Risque de perte du lead

### Ton et Style
- **Professionnel mais chaleureux**
- Utiliser le prénom du visiteur si disponible
- Poser des questions ouvertes
- Reformuler pour confirmer la compréhension

### Réponses Types

**Question sur le prix :**
> "Le Sprint de Clarté est à 400€. C'est un investissement qui se rentabilise rapidement grâce à l'augmentation de vos conversions. Voulez-vous que je vous explique le processus en détail ?"

**Hésitation :**
> "Je comprends votre hésitation. Beaucoup de nos clients avaient les mêmes doutes au début. Puis-je vous partager quelques témoignages de personnes dans votre situation ?"

**Question technique :**
> "Excellente question ! Le Sprint de Clarté se déroule sur 7 jours avec 3 étapes clés : Diagnostic, Élimination, Amplification. Voulez-vous que je vous envoie le détail par email ?"

### Qualification Rapide
Poser ces 3 questions :
1. "Quel est votre principal défi en communication actuellement ?"
2. "Avez-vous déjà essayé d'autres solutions ?"
3. "Quel est votre objectif principal (conversions, clarté, impact) ?"

### Transition vers la Vente
- Proposer un appel de découverte
- Envoyer le lien Calendly
- Offrir un diagnostic gratuit
- Partager une étude de cas similaire

## Suivi et Optimisation

### KPIs à Suivre
- **Taux de réponse** : % de visiteurs qui initient un chat
- **Temps de première réponse** : Rapidité de l'agent
- **Taux de résolution** : % de conversations résolues
- **Taux de conversion** : % de chats → clients

### Analyse Hebdomadaire
- Quelles pages génèrent le plus de chats ?
- Quelles questions reviennent le plus ?
- Quels agents performent le mieux ?
- Quels horaires sont les plus actifs ?

### Amélioration Continue
- Créer des réponses pré-enregistrées pour les questions fréquentes
- Former les agents sur les objections récurrentes
- Ajuster les messages automatiques selon les performances
- Tester différents emplacements du widget

## Support

- **Documentation** : [help.crisp.chat](https://help.crisp.chat)
- **Support Crisp** : Chat dans le dashboard
- **Communauté** : [community.crisp.chat](https://community.crisp.chat)

---

**Dernière mise à jour** : Janvier 2025
