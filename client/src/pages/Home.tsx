import { useAuth } from "@/_core/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import LanguageSelector from "@/components/LanguageSelector";
import { NavLink } from "@/components/NavLink";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data: user } = trpc.auth.me.useQuery();
  const isAuthenticated = !!user;
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  return (
    <div className="min-h-screen">
      <SEO
        title={t('hero.title')}
        description={t('hero.description')}
        keywords={['clarté', 'communication', 'conversion', 'PFPMA', 'insight', 'sprint de clarté', 'méthodologie Sionohmair', 'Bruno Coldold']}
      />
      
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <NavLink href="/">
            <div className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
              <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
            </div>
          </NavLink>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <NavLink href="/content-analyzer" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.analyzer')}</NavLink>
            <NavLink href="/copy-generator" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.generator')}</NavLink>
            <NavLink href="/avatar-builder" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.avatarClient')}</NavLink>
            <NavLink href="/script-analyzer" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.scripts')}</NavLink>
            <NavLink href="/frameworks" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.frameworks')}</NavLink>
            <NavLink href="/chat-ia" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.chatIA')}</NavLink>
            <NavLink href="/templates" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.templates')}</NavLink>
            <NavLink href="/exemples" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.examples')}</NavLink>
            <NavLink href="/editor" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.editor')}</NavLink>
            <NavLink href="/guide" className="text-sm font-medium hover:text-accent transition-colors">{t('nav.guide')}</NavLink>
            <NavLink href="/pricing" className="text-sm font-medium hover:text-accent transition-colors">{t('common.pricing')}</NavLink>
            <NavLink href="/blog" className="text-sm font-medium hover:text-accent transition-colors">{t('common.blog')}</NavLink>
            <NavLink href="/about" className="text-sm font-medium hover:text-accent transition-colors">{t('common.about')}</NavLink>
            {isAuthenticated && (
              <NavLink href="/subscription" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                {t('nav.mySubscription')}
                <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full">
                  {t('nav.freeTrial')}
                </span>
              </NavLink>
            )}
            {!isAuthenticated && (
              <Button asChild variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold">
                <a href={`/${language}/subscription`} className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t('hero.cta')}
                </a>
              </Button>
            )}
            {isAuthenticated && (
              <Button asChild variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={`/${language}/content-analyzer`}>{t('nav.analyzeContent')}</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Problème */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
                {t('hero.problem.badge')}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: t('hero.problem.title') }} />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: t('hero.problem.description') }} />
              <p className="text-lg text-accent font-semibold mt-4">
                {t('hero.problem.truth')}
              </p>
            </div>

            {/* Solution */}
            <div className="space-y-4 pt-8">
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                {t('hero.solution.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: t('hero.solution.title') }} />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('hero.solution.description')}
              </p>
              <div className="mt-6 p-6 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-2xl font-bold text-accent mb-2">{t('hero.alphaFactor.title')}</p>
                <p className="text-lg" dangerouslySetInnerHTML={{ __html: t('hero.alphaFactor.description') }} />
                <p className="text-sm text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: t('hero.alphaFactor.law') }} />
              </div>
            </div>

            {/* Preuves */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card className="border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">{t('hero.alphaFactor.stat1')}</CardTitle>
                  <CardDescription>{t('hero.alphaFactor.stat1Label')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">{t('hero.alphaFactor.stat2')}</CardTitle>
                  <CardDescription>{t('hero.alphaFactor.stat2Label')}</CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-accent">{t('hero.alphaFactor.stat3')}</CardTitle>
                  <CardDescription>{t('hero.alphaFactor.stat3Label')}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section Outils */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('home.toolsSection.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="w-12 h-12 text-accent mb-4" />
                <CardTitle>{t('home.toolsSection.analyzer.title')}</CardTitle>
                <CardDescription>{t('home.toolsSection.analyzer.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/${language}/content-analyzer`}>
                    {t('home.toolsSection.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 text-accent mb-4" />
                <CardTitle>{t('home.toolsSection.generator.title')}</CardTitle>
                <CardDescription>{t('home.toolsSection.generator.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/${language}/copy-generator`}>
                    {t('home.toolsSection.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-accent mb-4" />
                <CardTitle>{t('home.toolsSection.persona.title')}</CardTitle>
                <CardDescription>{t('home.toolsSection.persona.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/${language}/avatar-builder`}>
                    {t('home.toolsSection.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Analyse */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">{t('home.analyzeSection.title')}</h2>
            <p className="text-xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('home.analyzeSection.description') }} />
            <p className="text-lg">{t('home.analyzeSection.free')}</p>
            <Button asChild size="lg" className="mt-6">
              <Link href={`/${language}/content-analyzer`}>
                {t('home.toolsSection.cta')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Code PFPMA */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{t('home.pfpmaCode.title')}</h2>
              <p className="text-lg text-muted-foreground">{t('home.pfpmaCode.subtitle')}</p>
            </div>

            <div className="space-y-8">
              {/* Problème */}
              <Card className="border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-destructive">{t('home.pfpmaCode.problem.letter')}</span>
                    </div>
                    <CardTitle className="text-2xl">{t('home.pfpmaCode.problem.title')}</CardTitle>
                  </div>
                  <CardDescription className="mt-4">{t('home.pfpmaCode.problem.description')}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 italic">{t('home.pfpmaCode.problem.example')}</p>
                </CardHeader>
              </Card>

              {/* Formule */}
              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">{t('home.pfpmaCode.formula.letter')}</span>
                    </div>
                    <CardTitle className="text-2xl">{t('home.pfpmaCode.formula.title')}</CardTitle>
                  </div>
                  <CardDescription className="mt-4">{t('home.pfpmaCode.formula.description')}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 italic">{t('home.pfpmaCode.formula.example')}</p>
                </CardHeader>
              </Card>

              {/* Preuve */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-500">{t('home.pfpmaCode.proof.letter')}</span>
                    </div>
                    <CardTitle className="text-2xl">{t('home.pfpmaCode.proof.title')}</CardTitle>
                  </div>
                  <CardDescription className="mt-4">{t('home.pfpmaCode.proof.description')}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 italic">{t('home.pfpmaCode.proof.example')}</p>
                </CardHeader>
              </Card>

              {/* Méthode */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-500">{t('home.pfpmaCode.method.letter')}</span>
                    </div>
                    <CardTitle className="text-2xl">{t('home.pfpmaCode.method.title')}</CardTitle>
                  </div>
                  <CardDescription className="mt-4">{t('home.pfpmaCode.method.description')}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 italic">{t('home.pfpmaCode.method.example')}</p>
                </CardHeader>
              </Card>

              {/* Action */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-500">{t('home.pfpmaCode.action.letter')}</span>
                    </div>
                    <CardTitle className="text-2xl">{t('home.pfpmaCode.action.title')}</CardTitle>
                  </div>
                  <CardDescription className="mt-4">{t('home.pfpmaCode.action.description')}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-2 italic">{t('home.pfpmaCode.action.example')}</p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Offre de lancement */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-accent/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-4">
              {t('home.launchOffer.badge')}
            </div>
            <h2 className="text-4xl font-bold">{t('home.launchOffer.title')}</h2>
            <p className="text-xl">{t('home.launchOffer.features')}</p>
            <p className="text-lg text-muted-foreground">{t('home.launchOffer.description')}</p>
            <div className="bg-background/50 backdrop-blur p-6 rounded-xl space-y-4 mt-8">
              <p className="text-lg font-semibold">{t('home.launchOffer.noCard')}</p>
              <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('home.launchOffer.pricing') }} />
              <p className="text-sm text-muted-foreground">{t('home.launchOffer.plans')}</p>
              <p className="text-sm text-muted-foreground">{t('home.launchOffer.reminders')}</p>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href={`/${language}/subscription`}>
                {t('hero.cta')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">{t('home.newsletter.title')}</h2>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-10 w-auto" />
                <span className="font-bold">Sionohmair</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('footer.description')}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-sm">
                <li><NavLink href="/services">{t('common.services')}</NavLink></li>
                <li><NavLink href="/blog">{t('common.blog')}</NavLink></li>
                <li><NavLink href="/about">{t('common.about')}</NavLink></li>
                <li><NavLink href="/contact">{t('common.contact')}</NavLink></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('common.tools')}</h3>
              <ul className="space-y-2 text-sm">
                <li><NavLink href="/content-analyzer">{t('nav.analyzer')}</NavLink></li>
                <li><NavLink href="/copy-generator">{t('nav.generator')}</NavLink></li>
                <li><NavLink href="/avatar-builder">{t('nav.avatarClient')}</NavLink></li>
                <li><NavLink href="/frameworks">{t('nav.frameworks')}</NavLink></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm">
                <li><NavLink href="/privacy">{t('footer.privacyPolicy')}</NavLink></li>
                <li><NavLink href="/terms">{t('footer.termsOfService')}</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
