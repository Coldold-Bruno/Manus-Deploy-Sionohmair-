import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

/**
 * PAGE CGV FORMATION - Conditions Générales de Vente de la Formation Sprint de Clarté
 */

export default function CGVFormation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Conditions Générales de Vente</h1>
              <p className="text-muted-foreground mt-1">Formation Sprint de Clarté</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/formation">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>CGV - Formation Sprint de Clarté</CardTitle>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'accès et l'utilisation de la formation en ligne
              "Sprint de Clarté" proposée par Sionohmair Insight Academy.
            </p>

            <h2>2. Description de la Formation</h2>
            <p>
              La formation "Sprint de Clarté" est une formation interactive en ligne composée de :
            </p>
            <ul>
              <li>9 modules pédagogiques (11h15 de contenu vidéo et interactif)</li>
              <li>27 exercices pratiques avec validation automatique</li>
              <li>Déblocage progressif des modules (1 module débloqué après validation du précédent)</li>
              <li>Système de badges de gamification (8 badges disponibles)</li>
              <li>Certificat "Architecte de la Clarté" délivré à la fin de la formation</li>
              <li>Manuel PFPMA (PDF téléchargeable)</li>
              <li>Templates de rédaction (Word/Excel)</li>
            </ul>

            <h2>3. Prix et Modalités de Paiement</h2>
            <p>
              <strong>Prix :</strong> 790 € TTC (TVA applicable selon la législation en vigueur)
            </p>
            <p>
              <strong>Paiement :</strong> Le paiement s'effectue en ligne par carte bancaire via Stripe (plateforme de paiement sécurisée).
            </p>
            <p>
              Le paiement est exigible immédiatement lors de la commande. L'accès à la formation est activé automatiquement après validation du paiement.
            </p>

            <h2>4. Durée d'Accès</h2>
            <p>
              <strong>Accès limité à 90 jours (3 mois) à compter de la date d'achat.</strong>
            </p>
            <p>
              Le client dispose de 90 jours calendaires pour terminer la formation. Passé ce délai, l'accès à la plateforme est automatiquement révoqué, sans possibilité de prolongation ou de remboursement.
            </p>
            <p>
              <strong>Aucune extension de durée ne sera accordée, sauf cas de force majeure dûment justifié et accepté par Sionohmair Insight Academy.</strong>
            </p>

            <h2>5. Politique de Remboursement</h2>
            <p>
              <strong>Aucun remboursement ne sera effectué après l'achat de la formation, conformément à l'article L221-28 du Code de la consommation (exception au droit de rétractation pour les contenus numériques fournis immédiatement).</strong>
            </p>
            <p>
              En achetant la formation, le client reconnaît expressément :
            </p>
            <ul>
              <li>Avoir pris connaissance de la durée d'accès limitée à 90 jours</li>
              <li>Renoncer à son droit de rétractation de 14 jours</li>
              <li>Accepter que l'accès soit fourni immédiatement après le paiement</li>
              <li>Accepter qu'aucun remboursement ne sera possible, même en cas de non-utilisation ou d'insatisfaction</li>
            </ul>

            <h2>6. Obligations du Client</h2>
            <p>Le client s'engage à :</p>
            <ul>
              <li>Utiliser la formation de manière personnelle et non commerciale</li>
              <li>Ne pas partager son accès avec des tiers</li>
              <li>Ne pas copier, reproduire, ou diffuser le contenu de la formation sans autorisation écrite</li>
              <li>Respecter les droits de propriété intellectuelle de Sionohmair Insight Academy</li>
            </ul>

            <h2>7. Propriété Intellectuelle</h2>
            <p>
              Tous les contenus de la formation (vidéos, textes, exercices, templates, PDF) sont la propriété exclusive de Sionohmair Insight Academy et sont protégés par le droit d'auteur.
            </p>
            <p>
              Le client dispose d'un droit d'usage personnel et non cessible. Toute reproduction, distribution, ou exploitation commerciale est strictement interdite.
            </p>

            <h2>8. Protection des Données Personnelles (RGPD)</h2>
            <p>
              Les données personnelles collectées (nom, email, progression dans la formation) sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p>
              <strong>Finalités du traitement :</strong>
            </p>
            <ul>
              <li>Gestion de l'accès à la formation</li>
              <li>Suivi de la progression pédagogique</li>
              <li>Délivrance du certificat de fin de formation</li>
              <li>Support technique et pédagogique</li>
            </ul>
            <p>
              <strong>Durée de conservation :</strong> Les données sont conservées pendant la durée d'accès (90 jours) + 3 ans pour les obligations légales.
            </p>
            <p>
              <strong>Droits du client :</strong> Droit d'accès, de rectification, d'effacement, et de portabilité des données. Pour exercer ces droits, contactez : contact@sionohmair.com
            </p>

            <h2>9. Support et Assistance</h2>
            <p>
              Un support technique est disponible par email (contact@sionohmair.com) pour toute question relative à l'accès ou au fonctionnement de la plateforme.
            </p>
            <p>
              <strong>Délai de réponse :</strong> 48h ouvrées maximum.
            </p>
            <p>
              <strong>Le support pédagogique (aide sur les exercices) n'est pas inclus dans cette formation.</strong>
            </p>

            <h2>10. Disponibilité de la Plateforme</h2>
            <p>
              Sionohmair Insight Academy s'efforce de maintenir la plateforme accessible 24h/24, 7j/7. Cependant, des interruptions temporaires peuvent survenir pour maintenance ou raisons techniques.
            </p>
            <p>
              En cas d'indisponibilité prolongée (plus de 48h consécutives), la durée d'accès sera prolongée d'autant.
            </p>

            <h2>11. Limitation de Responsabilité</h2>
            <p>
              Sionohmair Insight Academy ne saurait être tenu responsable :
            </p>
            <ul>
              <li>De l'impossibilité d'accéder à la formation en raison de problèmes techniques liés au matériel ou à la connexion internet du client</li>
              <li>Des résultats obtenus par le client après application des méthodes enseignées</li>
              <li>De la non-complétion de la formation dans le délai de 90 jours</li>
            </ul>

            <h2>12. Modification des CGV</h2>
            <p>
              Sionohmair Insight Academy se réserve le droit de modifier les présentes CGV à tout moment. Les modifications s'appliquent aux achats effectués après leur publication.
            </p>
            <p>
              Les clients ayant acheté la formation avant une modification restent soumis aux CGV en vigueur au moment de leur achat.
            </p>

            <h2>13. Droit Applicable et Juridiction</h2>
            <p>
              Les présentes CGV sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
            <p>
              Conformément à l'article L612-1 du Code de la consommation, le client peut recourir gratuitement à un médiateur de la consommation en cas de litige non résolu.
            </p>

            <h2>14. Contact</h2>
            <p>
              <strong>Sionohmair Insight Academy</strong><br />
              Email : contact@sionohmair.com<br />
              Site web : https://sionohmair-insight-academy.manus.space
            </p>

            <hr className="my-8" />

            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Acceptation des CGV</p>
              <p className="text-sm">
                En achetant la formation "Sprint de Clarté", le client reconnaît avoir pris connaissance des présentes CGV et les accepte sans réserve.
              </p>
              <p className="text-sm mt-2">
                <strong>Le client reconnaît expressément :</strong>
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✅ Avoir lu et compris les conditions d'accès (90 jours maximum)</li>
                <li>✅ Renoncer à son droit de rétractation de 14 jours</li>
                <li>✅ Accepter qu'aucun remboursement ne sera possible</li>
                <li>✅ S'engager à respecter les droits de propriété intellectuelle</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
