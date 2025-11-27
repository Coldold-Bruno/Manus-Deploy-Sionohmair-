/**
 * Gestion des favoris côté client (localStorage)
 * Pour templates et exemples
 */

const FAVORITES_KEY = 'sionohmair_favorites';

interface Favorites {
  templates: string[];
  examples: string[];
}

/**
 * Récupérer tous les favoris
 */
export function getFavorites(): Favorites {
  if (typeof window === 'undefined') return { templates: [], examples: [] };
  
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) return { templates: [], examples: [] };
  
  try {
    return JSON.parse(stored);
  } catch {
    return { templates: [], examples: [] };
  }
}

/**
 * Sauvegarder les favoris
 */
function saveFavorites(favorites: Favorites) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/**
 * Ajouter un template aux favoris
 */
export function addTemplateFavorite(templateId: string) {
  const favorites = getFavorites();
  if (!favorites.templates.includes(templateId)) {
    favorites.templates.push(templateId);
    saveFavorites(favorites);
  }
}

/**
 * Retirer un template des favoris
 */
export function removeTemplateFavorite(templateId: string) {
  const favorites = getFavorites();
  favorites.templates = favorites.templates.filter(id => id !== templateId);
  saveFavorites(favorites);
}

/**
 * Vérifier si un template est en favoris
 */
export function isTemplateFavorite(templateId: string): boolean {
  const favorites = getFavorites();
  return favorites.templates.includes(templateId);
}

/**
 * Ajouter un exemple aux favoris
 */
export function addExampleFavorite(exampleId: string) {
  const favorites = getFavorites();
  if (!favorites.examples.includes(exampleId)) {
    favorites.examples.push(exampleId);
    saveFavorites(favorites);
  }
}

/**
 * Retirer un exemple des favoris
 */
export function removeExampleFavorite(exampleId: string) {
  const favorites = getFavorites();
  favorites.examples = favorites.examples.filter(id => id !== exampleId);
  saveFavorites(favorites);
}

/**
 * Vérifier si un exemple est en favoris
 */
export function isExampleFavorite(exampleId: string): boolean {
  const favorites = getFavorites();
  return favorites.examples.includes(exampleId);
}

/**
 * Basculer le statut favoris d'un template
 */
export function toggleTemplateFavorite(templateId: string): boolean {
  if (isTemplateFavorite(templateId)) {
    removeTemplateFavorite(templateId);
    return false;
  } else {
    addTemplateFavorite(templateId);
    return true;
  }
}

/**
 * Basculer le statut favoris d'un exemple
 */
export function toggleExampleFavorite(exampleId: string): boolean {
  if (isExampleFavorite(exampleId)) {
    removeExampleFavorite(exampleId);
    return false;
  } else {
    addExampleFavorite(exampleId);
    return true;
  }
}
