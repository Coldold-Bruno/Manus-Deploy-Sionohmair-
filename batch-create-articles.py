#!/usr/bin/env python3
"""
Script pour créer les structures des articles avec APTEA + PFPMA
"""

# Articles 05-10 (réécriture) + 13-20 (création)
articles_to_create = [
    # Articles 05-10 (réécriture des existants)
    {
        "id": "05",
        "file": "05-nlp-transformers.md",
        "title": "Comment le NLP a Généré €2,3M de Revenus en Automatisant le Support Client",
        "hook": "3h47 du matin, le CEO reçoit un email : 'Notre support client coûte €180K/mois et les clients sont furieux'",
        "problem": "89% des entreprises perdent des millions en support client inefficace",
        "transformation": "Framework NLP + Transformers pour automatiser 87% du support",
        "evidence": "€2,3M économisés, satisfaction client +67%, temps de réponse -94%",
        "action": "Plan 60 jours pour automatiser votre support avec NLP",
    },
    {
        "id": "06",
        "file": "06-computer-vision-revolution.md",
        "title": "Comment la Computer Vision a Économisé €4,7M en Détectant les Défauts de Production",
        "hook": "L'usine perd €50K/jour en produits défectueux. Le directeur qualité est désespéré",
        "problem": "73% des défauts de production passent inaperçus jusqu'au client final",
        "transformation": "Système de computer vision pour détecter 99,7% des défauts en temps réel",
        "evidence": "€4,7M économisés, taux de rebut -89%, réclamations clients -94%",
        "action": "Plan 90 jours pour déployer la computer vision dans votre usine",
    },
    {
        "id": "07",
        "file": "07-python-data-science.md",
        "title": "Comment Python a Transformé un Analyste Excel en Data Scientist à €120K/an",
        "hook": "Marc, 34 ans, analyste Excel à €45K/an. 18 mois plus tard : Data Scientist à €120K",
        "problem": "67% des analystes sont bloqués dans Excel alors que le marché cherche des data scientists",
        "transformation": "Roadmap Python complète : de zéro à data scientist en 6 mois",
        "evidence": "Marc a multiplié son salaire par 2,7 en 18 mois. Voici comment",
        "action": "Plan 180 jours pour devenir data scientist (même sans background tech)",
    },
    {
        "id": "08",
        "file": "08-cloud-ai-deployment.md",
        "title": "Comment le Cloud a Réduit Nos Coûts IA de 73% (Et Accéléré le Déploiement de 10x)",
        "hook": "Notre facture AWS : €47K/mois. Après optimisation : €12,7K/mois. Même performance",
        "problem": "82% des entreprises surpayent leur infrastructure cloud de 50-300%",
        "transformation": "Framework d'optimisation cloud pour l'IA (AWS, GCP, Azure)",
        "evidence": "€412K économisés/an, déploiement 10x plus rapide, scalabilité infinie",
        "action": "Plan 30 jours pour optimiser vos coûts cloud IA",
    },
    {
        "id": "09",
        "file": "09-career-ai-engineer.md",
        "title": "Comment Devenir AI Engineer à €100K+ en 12 Mois (Sans Diplôme en IA)",
        "hook": "Julie, 29 ans, prof de maths à €32K/an. 12 mois plus tard : AI Engineer à €105K",
        "problem": "Pénurie de 500K AI engineers en Europe. Salaires moyens €80-150K",
        "transformation": "Roadmap complète : de zéro à AI Engineer en 12 mois",
        "evidence": "Julie a multiplié son salaire par 3,3. Voici sa méthode exacte",
        "action": "Plan 365 jours pour devenir AI Engineer (step-by-step)",
    },
    {
        "id": "10",
        "file": "10-future-ai-trends.md",
        "title": "Les 7 Tendances IA qui Vont Créer 100K Emplois en 2025 (Et Comment en Profiter)",
        "hook": "2025 sera l'année de l'explosion de l'IA. 7 tendances créent 100K jobs. Êtes-vous prêt ?",
        "problem": "94% des professionnels ne sont pas préparés aux opportunités IA de 2025",
        "transformation": "Les 7 tendances IA à maîtriser absolument en 2025",
        "evidence": "Salaires moyens €70-180K, demande explosive, compétition faible (encore)",
        "action": "Plan 90 jours pour vous positionner sur ces tendances",
    },
    
    # Articles 13-20 (création)
    {
        "id": "13",
        "file": "13-email-marketing-127k.md",
        "title": "Comment 1 Email a Généré €127K en 48h (Template Inclus)",
        "hook": "Jeudi 14h23, j'envoie 1 email à 12 847 abonnés. Samedi 14h23 : €127K de ventes",
        "problem": "91% des emails marketing génèrent <€0,50 par email envoyé",
        "transformation": "Framework PFPMA pour emails qui convertissent à 8-15%",
        "evidence": "€127K en 48h, taux d'ouverture 47%, taux de clic 23%, conversion 12%",
        "action": "Template exact + plan 7 jours pour reproduire ce résultat",
    },
    {
        "id": "14",
        "file": "14-seo-50k-visiteurs.md",
        "title": "Comment Passer de 0 à 50K Visiteurs/Mois en 6 Mois (Sans Budget Pub)",
        "hook": "Janvier 2024 : 0 visiteur. Juillet 2024 : 50 347 visiteurs/mois. Budget pub : 0€",
        "problem": "87% des sites stagnent à <1K visiteurs/mois et brûlent leur budget en pub",
        "transformation": "Stratégie SEO PFPMA : 0 à 50K visiteurs organiques en 6 mois",
        "evidence": "50K visiteurs, 0€ de pub, €47K de revenus/mois, méthode reproductible",
        "action": "Plan 180 jours pour exploser votre trafic organique",
    },
    {
        "id": "15",
        "file": "15-funnel-automatise.md",
        "title": "Comment Automatiser 90% de Vos Ventes (Funnel Complet Révélé)",
        "hook": "Mon funnel génère €47K/mois en pilote automatique. Je travaille 4h/semaine dessus",
        "problem": "94% des entrepreneurs sont esclaves de leur business (70h/semaine)",
        "transformation": "Architecture complète d'un funnel automatisé qui tourne seul",
        "evidence": "€47K/mois, 4h/semaine, 90% automatisé, scalable à l'infini",
        "action": "Plan 60 jours pour construire votre funnel automatisé",
    },
    {
        "id": "16",
        "file": "16-personal-branding-90-jours.md",
        "title": "Comment Devenir Influent dans Votre Secteur en 90 Jours (Sans Être Extraverti)",
        "hook": "Thomas, introverti, 0 follower. 90 jours plus tard : 12K followers, 3 clients à €50K",
        "problem": "89% des experts restent invisibles alors que des médiocres deviennent influents",
        "transformation": "Framework personal branding pour introvertis (90 jours)",
        "evidence": "Thomas : 0 à 12K followers, €150K de contrats, 4h/semaine",
        "action": "Plan 90 jours pour devenir influent (même si vous êtes introverti)",
    },
    {
        "id": "17",
        "file": "17-productivite-ia-20h.md",
        "title": "Comment Gagner 20h/Semaine avec l'IA (Workflows Complets Inclus)",
        "hook": "Je travaillais 70h/semaine. Aujourd'hui : 35h/semaine. Même output. Merci l'IA",
        "problem": "82% des entrepreneurs travaillent 60-80h/semaine sur des tâches automatisables",
        "transformation": "15 workflows IA pour gagner 20h/semaine (testés et validés)",
        "evidence": "20h économisées/semaine, productivité x2, stress -67%",
        "action": "Plan 30 jours pour automatiser votre travail avec l'IA",
    },
    {
        "id": "18",
        "file": "18-pricing-doubler-prix.md",
        "title": "Comment Doubler Vos Prix Sans Perdre de Clients (Stratégie Complète)",
        "hook": "J'ai doublé mes prix. Résultat : -30% de clients, +140% de revenus, +300% de marge",
        "problem": "91% des entrepreneurs sous-évaluent leurs prix de 50-200%",
        "transformation": "Framework pricing pour doubler vos prix sans perdre (trop) de clients",
        "evidence": "Prix x2, revenus +140%, marge +300%, clients premium",
        "action": "Plan 60 jours pour doubler vos prix stratégiquement",
    },
    {
        "id": "19",
        "file": "19-storytelling-vendre.md",
        "title": "Comment Vendre Sans Vendre Grâce au Storytelling (Framework Complet)",
        "hook": "J'ai arrêté de 'vendre'. J'ai commencé à raconter des histoires. Conversions x7",
        "problem": "94% des commerciaux 'vendent' et repoussent les clients",
        "transformation": "Framework storytelling APTEA pour vendre sans vendre",
        "evidence": "Conversions x7, objections -89%, closing rate 67% (vs 9% avant)",
        "action": "20 templates d'histoires qui vendent + plan 30 jours",
    },
    {
        "id": "20",
        "file": "20-business-automatise.md",
        "title": "Comment Construire un Business qui Tourne Seul (Architecture Complète)",
        "hook": "Mon business génère €83K/mois. Je travaille 8h/semaine. Voici l'architecture exacte",
        "problem": "97% des entrepreneurs sont prisonniers de leur business",
        "transformation": "Architecture complète d'un business automatisé (systèmes + outils)",
        "evidence": "€83K/mois, 8h/semaine, 95% automatisé, scalable",
        "action": "Plan 180 jours pour construire votre business automatisé",
    },
]

print(f"Total articles à créer : {len(articles_to_create)}")
print("\nListe des articles :")
for article in articles_to_create:
    print(f"{article['id']}. {article['title']}")

