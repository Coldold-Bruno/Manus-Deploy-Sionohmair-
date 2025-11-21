import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, ArrowLeft, TrendingUp, BookOpen, Lightbulb, Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { Streamdown } from "streamdown";
import { SEO } from "@/components/SEO";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  "case-study": {
    label: "Étude de cas",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: TrendingUp,
  },
  "methodology": {
    label: "Méthodologie",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: BookOpen,
  },
  "insights": {
    label: "Insights",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: Lightbulb,
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = trpc.blog.getPostBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Article non trouvé</h3>
            <p className="text-muted-foreground mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button asChild>
              <Link href="/blog">
                <a>Retour au blog</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG["insights"];
  const CategoryIcon = categoryConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage || undefined}
        type="article"
        author={post.clientName || "Bruno Coldold"}
        publishedTime={post.publishedAt?.toISOString()}
        modifiedTime={post.updatedAt.toISOString()}
        keywords={[post.category, 'clarté', 'PFPMA', post.clientIndustry || 'business'].filter(Boolean) as string[]}
      />
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-accent" />
              <span className="font-bold text-xl">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/blog">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au blog
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Badge className={categoryConfig.color}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {categoryConfig.label}
              </Badge>
              {post.publishedAt && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>

            {post.coverImage && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Case Study Metrics */}
            {post.category === 'case-study' && (
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Résultats mesurables</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {post.scoreBefore !== null && post.scoreAfter !== null && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Score de Clarté</p>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-red-600">{post.scoreBefore}/20</span>
                          <ArrowRight className="h-5 w-5" />
                          <span className="text-2xl font-bold text-green-600">{post.scoreAfter}/20</span>
                        </div>
                        <p className="text-sm text-accent font-semibold mt-1">
                          +{post.scoreAfter - post.scoreBefore} points
                        </p>
                      </div>
                    )}
                    {post.roi && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">ROI</p>
                        <p className="text-2xl font-bold text-accent">{post.roi}</p>
                      </div>
                    )}
                    {post.clientIndustry && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Secteur</p>
                        <p className="text-lg font-semibold">{post.clientIndustry}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none">
                <Streamdown>{post.content}</Streamdown>
              </CardContent>
            </Card>

            {/* Testimonial */}
            {post.testimonial && (
              <Card className="mt-8 bg-gradient-to-r from-secondary/50 to-secondary/20 border-accent/20">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Témoignage client
                  </h3>
                  <blockquote className="text-lg italic border-l-4 border-accent pl-6">
                    "{post.testimonial}"
                  </blockquote>
                  {post.clientName && (
                    <p className="text-sm text-muted-foreground mt-4">
                      — {post.clientName}
                      {post.clientIndustry && `, ${post.clientIndustry}`}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {post.videoUrl && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-4">Vidéo témoignage</h3>
                  <div className="aspect-video">
                    <iframe
                      src={post.videoUrl}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="mt-12 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
              <CardContent className="p-8 text-center">
                <h3 className="font-bold text-2xl mb-4">
                  Prêt à transformer votre communication ?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Découvrez comment la méthodologie Sionohmair peut vous aider à
                  atteindre des résultats similaires.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/sprint-clarte">
                      <a>Réserver un Sprint de Clarté</a>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/services">
                      <a>Voir tous les services</a>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
