import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Sparkles, ArrowLeft, TrendingUp, BookOpen, Lightbulb, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { APP_LOGO } from "@/const";
import { useTranslation } from "react-i18next";

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

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { i18n } = useTranslation();
  const language = i18n.language as 'fr' | 'en' | 'es' | 'de';
  
  const { data: posts, isLoading } = trpc.blog.getPublishedPosts.useQuery({
    category: selectedCategory,
    language: language,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 bg-background/98 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-3">
              <img src={APP_LOGO} alt="Sionohmair Insight Academy" className="h-12 w-auto" />
              <span className="font-bold text-xl hidden md:inline">Sionohmair Insight Academy</span>
            </a>
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </a>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Blog & Études de Cas
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez comment la méthodologie Sionohmair transforme la communication
              en science de la performance. Résultats mesurables, témoignages clients,
              et insights exclusifs.
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 pt-6">
              <Button
                variant={selectedCategory === undefined ? "default" : "outline"}
                onClick={() => setSelectedCategory(undefined)}
              >
                Tous les articles
              </Button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            )}

            {!isLoading && (!posts || posts.length === 0) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun article</h3>
                  <p className="text-muted-foreground">
                    Aucun article n'est disponible pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}

            {posts && posts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const categoryConfig = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG["insights"];
                  const CategoryIcon = categoryConfig.icon;

                  return (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                          {post.coverImage && (
                            <div className="aspect-video overflow-hidden rounded-t-lg">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={categoryConfig.color}>
                                <CategoryIcon className="h-3 w-3 mr-1" />
                                {categoryConfig.label}
                              </Badge>
                              {post.publishedAt && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                            <CardTitle className="group-hover:text-accent transition-colors">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3">
                              {post.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {post.category === 'case-study' && (
                              <div className="flex gap-4 text-sm mb-4">
                                {post.scoreBefore !== null && post.scoreAfter !== null && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Score:</span>
                                    <span className="font-bold text-red-600">{post.scoreBefore}/20</span>
                                    <ArrowRight className="h-4 w-4" />
                                    <span className="font-bold text-green-600">{post.scoreAfter}/20</span>
                                  </div>
                                )}
                                {post.roi && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">ROI:</span>
                                    <span className="font-bold text-accent">{post.roi}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <Button variant="ghost" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                              Lire l'article
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
