import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/SEO';
import { Sparkles, Quote, TrendingUp, Users, ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';

interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  industry: string;
  testimonial: string;
  videoUrl?: string;
  scoreAvant: number;
  scoreApres: number;
  roi: string;
  service: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: 'Sophie Martin',
    clientRole: 'CEO',
    clientCompany: 'TechFlow Solutions',
    industry: 'SaaS B2B',
    testimonial: 'Avant Sionohmair, notre landing page avait un taux de conversion de 2%. Après le Sprint de Clarté, nous sommes passés à 7% en seulement 3 semaines. Le ROI est absolument incroyable. La méthodologie PFPMA a transformé notre approche de la communication.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    scoreAvant: 8,
    scoreApres: 18,
    roi: '+250%',
    service: 'Sprint de Clarté',
  },
  {
    id: 2,
    clientName: 'Marc Dubois',
    clientRole: 'Directeur Marketing',
    clientCompany: 'LearnFast Academy',
    industry: 'EdTech',
    testimonial: 'Le diagnostic de clarté a révélé 3 frictions majeures dans notre tunnel de conversion que nous ne voyions pas. En 7 jours, nous avons reçu un plan d\'action complet avec des recommandations IA ultra-précises. Les inscriptions ont bondi de 117%.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    scoreAvant: 11,
    scoreApres: 19,
    roi: '+117%',
    service: 'Sprint de Clarté',
  },
  {
    id: 3,
    clientName: 'Julie Renard',
    clientRole: 'Fondatrice',
    clientCompany: 'GreenTech Innovations',
    industry: 'CleanTech',
    testimonial: 'L\'Architecture de l\'Insight (Niveau 2) nous a permis de structurer toute notre communication produit. Les 5 Artefacts de Clarté sont devenus notre référentiel interne. Chaque message est maintenant calibré selon PFPMA. Notre taux de closing a doublé.',
    scoreAvant: 9,
    scoreApres: 17,
    roi: '+200%',
    service: 'Architecture de l\'Insight',
  },
  {
    id: 4,
    clientName: 'Thomas Bernard',
    clientRole: 'VP Sales',
    clientCompany: 'CloudSecure Pro',
    industry: 'Cybersécurité',
    testimonial: 'Le Partenariat Stratégique (Niveau 3) a été un game-changer. La Roadmap 12 mois nous a guidés trimestre par trimestre. Le NFT Architecte de la Clarté est une preuve tangible de notre expertise. Nos clients nous perçoivent différemment maintenant.',
    scoreAvant: 12,
    scoreApres: 20,
    roi: '+180%',
    service: 'Partenariat Stratégique',
  },
];

const INDUSTRIES = ['Tous', 'SaaS B2B', 'EdTech', 'CleanTech', 'Cybersécurité'];

export default function Testimonials() {
  const [selectedIndustry, setSelectedIndustry] = useState('Tous');
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const filteredTestimonials = selectedIndustry === 'Tous'
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.industry === selectedIndustry);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <SEO
        title="Témoignages Clients"
        description="Découvrez comment nos clients ont transformé leur communication avec la méthodologie Sionohmair. +250% de conversion, +117% d'inscriptions, +200% de closing."
        keywords={['témoignages', 'résultats', 'ROI', 'études de cas', 'transformation', 'PFPMA']}
      />

      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg">Sionohmair Insight Academy</span>
            </div>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/blog" className="text-sm hover:text-accent transition-colors">Blog</Link>
            <Link href="/services" className="text-sm hover:text-accent transition-colors">Services</Link>
            <Link href="/contact">
              <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <Users className="h-4 w-4 mr-2" />
              Témoignages Clients
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Ils ont transformé leur communication avec{' '}
              <span className="text-accent">Sionohmair</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez les résultats mesurables de nos clients : scores de clarté, ROI, et transformations AVANT/APRÈS.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="pb-12">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map(industry => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? 'default' : 'outline'}
                onClick={() => setSelectedIndustry(industry)}
                className={selectedIndustry === industry ? 'bg-accent text-accent-foreground' : ''}
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="pb-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map(testimonial => (
              <Card key={testimonial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Vidéo */}
                  {testimonial.videoUrl && (
                    <div className="relative aspect-video bg-secondary/20">
                      {playingVideo === testimonial.id ? (
                        <iframe
                          src={testimonial.videoUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center cursor-pointer group"
                          onClick={() => setPlayingVideo(testimonial.id)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                          <div className="relative z-10 bg-accent text-accent-foreground rounded-full p-6 group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8" fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{testimonial.scoreAvant}/20</div>
                        <div className="text-xs text-muted-foreground">Score AVANT</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{testimonial.scoreApres}/20</div>
                        <div className="text-xs text-muted-foreground">Score APRÈS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{testimonial.roi}</div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                    </div>

                    {/* Témoignage */}
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-accent/20" />
                      <p className="text-muted-foreground italic pl-6">
                        {testimonial.testimonial}
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="font-semibold">{testimonial.clientName}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.clientRole}, {testimonial.clientCompany}
                        </div>
                      </div>
                      <Badge variant="outline">{testimonial.industry}</Badge>
                    </div>

                    {/* Service */}
                    <div className="text-sm text-muted-foreground">
                      Service : <span className="font-semibold text-foreground">{testimonial.service}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à transformer votre communication ?
            </h2>
            <p className="text-lg opacity-90">
              Rejoignez les dizaines d'entreprises qui ont déjà éliminé les 3 frictions avec Sionohmair.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sprint-clarte">
                <Button size="lg" variant="secondary" className="group">
                  Démarrer le Sprint de Clarté (990 €)
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                  Discuter avec Bruno
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-secondary/20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
