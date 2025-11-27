// Templates d'emails pour les notifications de fin d'essai et inscription

export const subscriptionEmailTemplates = {
  // Email J-7 : Il reste 7 jours d'essai gratuit
  trial_7_days_remaining: {
    subject: "Il vous reste 7 jours d'essai gratuit 🎁",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Sionohmair Insight Academy</h1>
        
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">Il vous reste 7 jours d'essai gratuit !</h2>
          <p style="font-size: 18px; margin: 0;">Profitez encore de tous les outils Content Marketing</p>
        </div>

        <p>Bonjour,</p>

        <p>Nous espérons que vous appréciez votre essai gratuit de Sionohmair Insight Academy ! 🚀</p>

        <p><strong>Votre essai gratuit se termine dans 7 jours.</strong> Après cette période, vous pourrez souscrire à l'abonnement mensuel de <strong>36€/mois</strong> pour continuer à profiter de tous les outils :</p>

        <ul style="line-height: 1.8;">
          <li>✅ Analyseur de contenu en 5 dimensions</li>
          <li>✅ Générateur de copy avec 8 frameworks (PFPMA, APTEA, AIDA, PAS, etc.)</li>
          <li>✅ Persona Builder pour créer vos avatars clients</li>
          <li>✅ Analyseur de scripts marketing</li>
          <li>✅ Chat IA personnalisé</li>
          <li>✅ Templates de scripts prêts à l'emploi</li>
          <li>✅ Éditeur de copy en temps réel</li>
          <li>✅ Et bien plus encore...</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://votre-domaine.com/pricing" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Voir les tarifs
          </a>
        </div>

        <p><strong>Besoin d'aide ?</strong> Notre équipe est là pour vous accompagner. Consultez notre <a href="https://votre-domaine.com/guide">guide d'utilisation</a> ou contactez-nous directement.</p>

        <p>À bientôt,<br>L'équipe Sionohmair Insight Academy</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Vous recevez cet email car vous avez commencé un essai gratuit sur Sionohmair Insight Academy.
        </p>
      </div>
    `
  },

  // Email J-3 : Il reste 3 jours d'essai gratuit
  trial_3_days_remaining: {
    subject: "⏰ Il vous reste 3 jours d'essai gratuit",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Sionohmair Insight Academy</h1>
        
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">⏰ Plus que 3 jours !</h2>
          <p style="font-size: 18px; margin: 0;">Votre essai gratuit se termine bientôt</p>
        </div>

        <p>Bonjour,</p>

        <p>Votre essai gratuit de 30 jours se termine dans <strong>3 jours</strong>.</p>

        <p>Pour continuer à utiliser Sionohmair Insight Academy et tous ses outils de Content Marketing & Copywriting, vous pouvez souscrire à l'abonnement mensuel de <strong>36€/mois</strong>.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Ce que vous conservez avec l'abonnement :</h3>
          <ul style="line-height: 1.8; margin-bottom: 0;">
            <li>Accès illimité à tous les outils</li>
            <li>Toutes les mises à jour futures incluses</li>
            <li>Support prioritaire</li>
            <li>Annulation possible à tout moment</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://votre-domaine.com/subscription" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
            S'abonner maintenant (36€/mois)
          </a>
        </div>

        <p style="text-align: center; color: #6b7280;">
          Pas d'engagement • Annulez quand vous voulez
        </p>

        <p>À bientôt,<br>L'équipe Sionohmair Insight Academy</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Vous recevez cet email car votre essai gratuit se termine bientôt.
        </p>
      </div>
    `
  },

  // Email J-1 : Dernier jour d'essai gratuit
  trial_1_day_remaining: {
    subject: "🚨 Dernier jour d'essai gratuit !",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Sionohmair Insight Academy</h1>
        
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">🚨 Dernier jour !</h2>
          <p style="font-size: 18px; margin: 0;">Votre essai gratuit se termine demain</p>
        </div>

        <p>Bonjour,</p>

        <p><strong>C'est votre dernier jour d'essai gratuit !</strong></p>

        <p>Demain, votre accès à Sionohmair Insight Academy sera suspendu si vous ne souscrivez pas à l'abonnement mensuel de <strong>36€/mois</strong>.</p>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚠️ Important :</strong> Vos données (avatars clients, analyses, copies générées) seront conservées pendant 6 mois. Vous pourrez les récupérer si vous vous réabonnez plus tard.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://votre-domaine.com/subscription" style="background: #ef4444; color: white; padding: 18px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 18px;">
            S'abonner maintenant pour continuer
          </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #6b7280;">
          36€/mois • Annulez quand vous voulez • Aucun engagement
        </p>

        <p><strong>Vous avez des questions ?</strong> Contactez-nous à <a href="mailto:support@sionohmair.com">support@sionohmair.com</a></p>

        <p>À bientôt,<br>L'équipe Sionohmair Insight Academy</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Vous recevez cet email car votre essai gratuit se termine demain.
        </p>
      </div>
    `
  },

  // Email J-0 : Essai gratuit terminé
  trial_ended: {
    subject: "Votre essai gratuit est terminé - Abonnez-vous pour continuer",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Sionohmair Insight Academy</h1>
        
        <div style="background: #f3f4f6; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0; color: #374151;">Votre essai gratuit est terminé</h2>
          <p style="font-size: 16px; margin: 0; color: #6b7280;">Abonnez-vous pour continuer à utiliser la plateforme</p>
        </div>

        <p>Bonjour,</p>

        <p>Votre essai gratuit de 30 jours est maintenant terminé. Nous espérons que vous avez apprécié découvrir Sionohmair Insight Academy !</p>

        <p>Pour continuer à utiliser tous les outils de Content Marketing & Copywriting, abonnez-vous dès maintenant pour <strong>36€/mois</strong>.</p>

        <div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Ce que vous obtenez avec l'abonnement :</h3>
          <ul style="line-height: 1.8; margin-bottom: 0; color: #1e3a8a;">
            <li>✅ Accès illimité à tous les outils</li>
            <li>✅ Analyseur de contenu + Générateur de copy</li>
            <li>✅ Persona Builder + Analyseur de scripts</li>
            <li>✅ Chat IA + Templates + Éditeur en temps réel</li>
            <li>✅ Toutes les mises à jour futures incluses</li>
            <li>✅ Support prioritaire</li>
            <li>✅ Annulation possible à tout moment</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://votre-domaine.com/subscription" style="background: #2563eb; color: white; padding: 18px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 18px;">
            S'abonner maintenant (36€/mois)
          </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #6b7280;">
          Pas d'engagement • Annulez quand vous voulez
        </p>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>💾 Vos données sont conservées :</strong> Vos avatars clients, analyses et copies générées sont conservés pendant 6 mois. Si vous vous réabonnez, vous les retrouverez intacts.
          </p>
        </div>

        <p><strong>Vous avez des questions ?</strong> Notre équipe est là pour vous aider : <a href="mailto:support@sionohmair.com">support@sionohmair.com</a></p>

        <p>À bientôt,<br>L'équipe Sionohmair Insight Academy</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Vous recevez cet email car votre essai gratuit est terminé.
        </p>
      </div>
    `
  },

  // Email de bienvenue après inscription
  welcome_after_subscription: {
    subject: "🎉 Bienvenue dans Sionohmair Insight Academy !",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; text-align: center;">Sionohmair Insight Academy</h1>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0 0 10px 0;">🎉 Bienvenue !</h2>
          <p style="font-size: 18px; margin: 0;">Vous êtes maintenant membre de Sionohmair Insight Academy</p>
        </div>

        <p>Bonjour,</p>

        <p>Merci de vous être abonné à Sionohmair Insight Academy ! Nous sommes ravis de vous compter parmi nos membres. 🚀</p>

        <h2 style="color: #2563eb;">Guide complet d'utilisation de la plateforme</h2>

        <h3>🎯 1. Analyseur de Contenu</h3>
        <p>Analysez vos contenus marketing en 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie. Obtenez un score global et des recommandations actionnables.</p>
        <p><strong>Comment l'utiliser :</strong> Collez votre texte, sélectionnez le type de contenu (article, email, page de vente), choisissez votre avatar client, et cliquez sur "Analyser".</p>

        <h3>✍️ 2. Générateur de Copy</h3>
        <p>Générez des textes de vente optimisés avec 8 frameworks de copywriting : PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST.</p>
        <p><strong>Comment l'utiliser :</strong> Choisissez un framework, sélectionnez votre avatar client, entrez vos mots-clés et votre produit/service, puis générez.</p>

        <h3>👤 3. Persona Builder</h3>
        <p>Créez des avatars clients détaillés (démographiques, psychographiques, comportement) pour personnaliser vos analyses et générations.</p>
        <p><strong>Comment l'utiliser :</strong> Remplissez le formulaire avec les informations de votre client idéal, sauvegardez, et utilisez-le dans les autres outils.</p>

        <h3>📊 4. Analyseur de Scripts</h3>
        <p>Identifiez automatiquement les frameworks utilisés dans vos scripts marketing et obtenez un score de qualité pour chaque méthode.</p>
        <p><strong>Comment l'utiliser :</strong> Collez votre script, l'IA détecte les frameworks utilisés et vous donne des recommandations d'amélioration.</p>

        <h3>📚 5. Bibliothèque de Frameworks</h3>
        <p>Consultez la documentation complète des 8 frameworks de copywriting avec théorie, structure, exemples et métriques de performance.</p>

        <h3>💬 6. Chat IA</h3>
        <p>Discutez avec l'IA pour obtenir des conseils personnalisés sur votre copywriting. Sélectionnez un avatar client pour des réponses adaptées.</p>

        <h3>📝 7. Templates de Scripts</h3>
        <p>Accédez à 7 templates pré-écrits (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB) que vous pouvez copier et personnaliser.</p>

        <h3>🎨 8. Galerie AVANT/APRÈS</h3>
        <p>Consultez des exemples réels de scripts optimisés avec les métriques de conversion AVANT/APRÈS (+340% à +1300%).</p>

        <h3>✏️ 9. Éditeur en Temps Réel</h3>
        <p>Rédigez votre copy avec des suggestions IA en direct, détection automatique des frameworks, et score de qualité en temps réel.</p>

        <h3>📊 10. Dashboard Utilisateur</h3>
        <p>Consultez l'historique de vos analyses, copies générées, avatars créés, et statistiques d'utilisation.</p>

        <div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">🚀 Pour bien démarrer :</h3>
          <ol style="line-height: 1.8; color: #1e3a8a;">
            <li>Créez votre premier avatar client dans le Persona Builder</li>
            <li>Analysez un de vos contenus existants avec l'Analyseur</li>
            <li>Générez une nouvelle copy avec le Générateur</li>
            <li>Consultez le Guide d'utilisation pour des tutoriels détaillés</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://votre-domaine.com/guide" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
            Consulter le Guide
          </a>
          <a href="https://votre-domaine.com/dashboard-user" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Accéder au Dashboard
          </a>
        </div>

        <p><strong>Besoin d'aide ?</strong> Notre chatbot est disponible 24/7 sur toutes les pages, ou contactez-nous à <a href="mailto:support@sionohmair.com">support@sionohmair.com</a></p>

        <p>Bon copywriting ! 🚀<br>L'équipe Sionohmair Insight Academy</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Vous recevez cet email car vous vous êtes abonné à Sionohmair Insight Academy.
        </p>
      </div>
    `
  }
};
