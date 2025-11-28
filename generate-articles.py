#!/usr/bin/env python3
"""
Script pour générer les métadonnées des articles blog avec structure APTEA + PFPMA
"""

articles = [
    {
        "id": 13,
        "slug": "email-marketing-127k",
        "title": "Comment 1 Email a Généré €127K en 48h (Template Inclus)",
        "seo_title": "Email Marketing : 1 Email = €127K en 48h | Sionohmair",
        "description": "Découvrez l'email qui a généré €127K en 48h. Structure PFPMA complète, template inclus, et framework pour reproduire ce résultat.",
        "keywords": "email marketing, PFPMA, conversion email, template email, séquence email, automation marketing",
        "category": "Email Marketing",
    },
    {
        "id": 14,
        "slug": "seo-50k-visiteurs",
        "title": "Comment Passer de 0 à 50K Visiteurs/Mois en 6 Mois (Sans Budget Pub)",
        "seo_title": "SEO : 0 à 50K Visiteurs en 6 Mois Sans Pub | Sionohmair",
        "description": "Stratégie SEO complète pour passer de 0 à 50K visiteurs/mois en 6 mois. Méthode PFPMA testée sur 50+ sites.",
        "keywords": "SEO, trafic organique, référencement naturel, content marketing, PFPMA, stratégie SEO",
        "category": "SEO & Trafic",
    },
    {
        "id": 15,
        "slug": "funnel-automatise",
        "title": "Comment Automatiser 90% de Vos Ventes (Funnel Complet Révélé)",
        "seo_title": "Funnel de Vente : Automatiser 90% des Ventes | Sionohmair",
        "description": "Funnel de vente automatisé qui génère €47K/mois en pilote automatique. Architecture complète + outils + méthode PFPMA.",
        "keywords": "funnel de vente, automation marketing, vente automatisée, PFPMA, marketing automation, conversion",
        "category": "Sales Funnel",
    },
    {
        "id": 16,
        "slug": "personal-branding-90-jours",
        "title": "Comment Devenir Influent dans Votre Secteur en 90 Jours (Sans Être Extraverti)",
        "seo_title": "Personal Branding : Devenir Influent en 90 Jours | Sionohmair",
        "description": "Stratégie personal branding pour devenir influent en 90 jours. Framework PFPMA testé par 200+ entrepreneurs introvertis.",
        "keywords": "personal branding, influence, LinkedIn, thought leadership, PFPMA, stratégie contenu",
        "category": "Personal Branding",
    },
    {
        "id": 17,
        "slug": "productivite-ia-20h",
        "title": "Comment Gagner 20h/Semaine avec l'IA (Workflows Complets Inclus)",
        "seo_title": "Productivité IA : Gagner 20h/Semaine | Sionohmair",
        "description": "Workflows IA pour gagner 20h/semaine. 15 use cases concrets, outils testés, méthode PFPMA pour automatiser votre travail.",
        "keywords": "productivité IA, automation IA, workflows IA, GPT-4, PFPMA, gain de temps",
        "category": "Productivité & IA",
    },
    {
        "id": 18,
        "slug": "pricing-doubler-prix",
        "title": "Comment Doubler Vos Prix Sans Perdre de Clients (Stratégie Complète)",
        "seo_title": "Pricing : Doubler Ses Prix Sans Perdre de Clients | Sionohmair",
        "description": "Stratégie pricing pour doubler vos prix sans perdre de clients. Framework PFPMA testé sur 100+ businesses.",
        "keywords": "pricing strategy, augmentation prix, valeur perçue, PFPMA, positionnement, stratégie tarifaire",
        "category": "Pricing & Positioning",
    },
    {
        "id": 19,
        "slug": "storytelling-vendre",
        "title": "Comment Vendre Sans Vendre Grâce au Storytelling (Framework Complet)",
        "seo_title": "Storytelling : Vendre Sans Vendre | Sionohmair",
        "description": "Framework storytelling pour vendre sans vendre. Structure APTEA + PFPMA + 20 templates d'histoires qui convertissent.",
        "keywords": "storytelling, vente storytelling, APTEA, PFPMA, Copy Mastery, narration marketing",
        "category": "Storytelling & Vente",
    },
    {
        "id": 20,
        "slug": "business-automatise",
        "title": "Comment Construire un Business qui Tourne Seul (Architecture Complète)",
        "seo_title": "Business Automatisé : Tourner Seul 24/7 | Sionohmair",
        "description": "Architecture complète pour un business automatisé. Systèmes, outils, workflows PFPMA pour générer du revenu en pilote automatique.",
        "keywords": "business automatisé, revenu passif, automation, systèmes business, PFPMA, entrepreneuriat",
        "category": "Business Automation",
    },
]

for article in articles:
    print(f"{article['id']:02d}. {article['title']}")
    print(f"    SEO: {article['seo_title']}")
    print(f"    Category: {article['category']}")
    print()

print(f"\nTotal: {len(articles)} articles à créer")
