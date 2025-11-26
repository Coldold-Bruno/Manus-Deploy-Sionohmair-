import { useState } from "react";
import { X } from "lucide-react";

/**
 * Page Portfolio - Galerie des créations graphiques
 * Affiche toutes les créations de design validées (sans fautes d'orthographe)
 */

interface PortfolioItem {
  id: string;
  title: string;
  category: "logo" | "branding" | "social" | "packaging" | "other";
  image: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "logo-3d-dore",
    title: "Logo 3D Doré - Sionohmair Insight Academy",
    category: "logo",
    image: "/logo-3d-dore.jpg",
    description: "Logo 3D avec effet doré luxueux et spirale emblématique",
  },
  {
    id: "logo-3d-texte",
    title: "Logo 3D Texte - Sionohmair Insight Academy",
    category: "logo",
    image: "/logo-3d-texte.jpg",
    description: "Typographie 3D élégante avec effet relief",
  },
  {
    id: "logo-violet-jaune",
    title: "Logo Violet & Jaune - Sionohmair",
    category: "logo",
    image: "/logo-violet-jaune.jpg",
    description: "Identité visuelle moderne avec spirale jaune sur fond violet",
  },
  {
    id: "logo-abstract",
    title: "Logo Abstrait",
    category: "logo",
    image: "/logo-abstract.png",
    description: "Design abstrait minimaliste",
  },
  {
    id: "logo-combination",
    title: "Logo Combinaison",
    category: "logo",
    image: "/logo-combination.png",
    description: "Logo combinant texte et symbole",
  },
  {
    id: "bruno-digital",
    title: "Bruno - Digital Active Revolution",
    category: "branding",
    image: "/bruno-digital-active.jpg",
    description: "Identité de marque personnelle - Signature Image Design & Logos",
  },
  {
    id: "digital-active-v2",
    title: "Digital Active Revolution - New Gen V2",
    category: "branding",
    image: "/digital-active-v2.png",
    description: "Évolution de l'identité Digital Active Revolution",
  },
  {
    id: "rootsneg-journal",
    title: "RootsNeg - Journal Intime",
    category: "branding",
    image: "/rootsneg-journal.jpg",
    description: "Couverture de journal avec design urbain et silhouettes",
  },
  {
    id: "tarifs-logos",
    title: "Grille Tarifaire - Création de Logos",
    category: "branding",
    image: "/tarifs-logos.png",
    description: "Présentation des offres : Starter (25€), Intermédiaire (45€), Avancé (120€)",
  },
  {
    id: "linkedin-banner",
    title: "Bannière LinkedIn",
    category: "social",
    image: "/linkedin-banner.png",
    description: "Design de bannière professionnelle pour LinkedIn",
  },
  {
    id: "instagram-post",
    title: "Post Instagram",
    category: "social",
    image: "/instagram-post.png",
    description: "Création de contenu visuel pour Instagram",
  },
  {
    id: "website-header",
    title: "Header de Site Web",
    category: "social",
    image: "/website-header.png",
    description: "Design d'en-tête pour site web",
  },
  {
    id: "parfum-boite-1",
    title: "Packaging Parfum - Proposition 1",
    category: "packaging",
    image: "/parfum-boite-1.png",
    description: "Design de boîte de parfum élégante",
  },
  {
    id: "parfum-boite-2",
    title: "Packaging Parfum - Proposition 2",
    category: "packaging",
    image: "/parfum-boite-2.png",
    description: "Variante de design pour boîte de parfum",
  },
  {
    id: "parfum-manchon",
    title: "Manchon Parfum",
    category: "packaging",
    image: "/parfum-manchon.png",
    description: "Design de manchon pour flacon de parfum",
  },
  // Nouvelles créations - Lot 2
  {
    id: "design-abstract-1",
    title: "Design Abstrait Moderne",
    category: "other",
    image: "/design-abstract-1.png",
    description: "Composition graphique abstraite et contemporaine",
  },
  {
    id: "design-modern-1",
    title: "Visuel Moderne",
    category: "other",
    image: "/design-modern-1.webp",
    description: "Design épuré et minimaliste",
  },
  {
    id: "design-creative-1",
    title: "Création Artistique",
    category: "other",
    image: "/design-creative-1.webp",
    description: "Composition créative originale",
  },
  {
    id: "design-visual-1",
    title: "Composition Visuelle",
    category: "other",
    image: "/design-visual-1.webp",
    description: "Design visuel impactant",
  },
  {
    id: "design-graphic-1",
    title: "Création Graphique",
    category: "other",
    image: "/design-graphic-1.webp",
    description: "Design graphique professionnel",
  },
  {
    id: "design-pro-1",
    title: "Design Professionnel",
    category: "other",
    image: "/design-pro-1.png",
    description: "Création professionnelle haut de gamme",
  },
  {
    id: "design-marketing-1",
    title: "Visuel Marketing",
    category: "social",
    image: "/design-marketing-1.png",
    description: "Support marketing visuel percutant",
  },
  {
    id: "design-creative-2",
    title: "Composition Créative",
    category: "other",
    image: "/design-creative-2.png",
    description: "Design créatif innovant",
  },
  {
    id: "design-modern-2",
    title: "Design Moderne Avancé",
    category: "other",
    image: "/design-modern-2.webp",
    description: "Création moderne et sophistiquée",
  },
  {
    id: "design-visual-2",
    title: "Création Visuelle Premium",
    category: "other",
    image: "/design-visual-2.webp",
    description: "Design visuel premium",
  },
  {
    id: "design-graphic-2",
    title: "Design Graphique Avancé",
    category: "other",
    image: "/design-graphic-2.webp",
    description: "Composition graphique élaborée",
  },
  // Nouvelles créations - Lot 3
  {
    id: "logo-coach-premium",
    title: "Logo Coach Premium Vectum",
    category: "logo",
    image: "/logo-coach-premium.jpg",
    description: "Logo premium avec spirale dorée et effet 3D",
  },
  {
    id: "logo-coach-highres",
    title: "Logo Coach High-Resolution",
    category: "logo",
    image: "/logo-coach-highres.jpg",
    description: "Logo vectoriel haute résolution avec mains et lumière",
  },
  {
    id: "tarifs-digitale",
    title: "Grille Tarifaire - Digitale Active Revolution",
    category: "branding",
    image: "/tarifs-digitale-active.jpg",
    description: "Offres logos : Starter (25€), Intervelle (45€), Avancé (95€)",
  },
  {
    id: "citation-identite",
    title: "Citation - Un logo, c'est votre identité",
    category: "branding",
    image: "/citation-logo-identite.jpg",
    description: "Visuel inspirant sur l'importance de l'identité de marque",
  },
];

const categories = [
  { id: "all", label: "Tout" },
  { id: "logo", label: "Logos" },
  { id: "branding", label: "Branding" },
  { id: "social", label: "Réseaux Sociaux" },
  { id: "packaging", label: "Packaging" },
  { id: "other", label: "Autres Créations" },
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Portfolio de Créations
          </h1>
          <p className="text-lg text-slate-600">
            Découvrez nos réalisations en design graphique et branding
          </p>
        </div>
      </header>

      {/* Filtres */}
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Galerie */}
      <div className="container mx-auto pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
          >
            <X size={32} />
          </button>
          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedItem.title}
              </h2>
              <p className="text-slate-300">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
