import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * Sionohmair Insight Academy
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout global pour chaque test
  timeout: 30 * 1000,
  
  // Nombre de tentatives en cas d'échec
  retries: process.env.CI ? 2 : 0,
  
  // Nombre de workers (tests parallèles)
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter pour les résultats
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  
  // Configuration globale pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Trace en cas d'échec
    trace: 'on-first-retry',
    
    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Vidéo en cas d'échec
    video: 'retain-on-failure',
    
    // Timeout pour les actions (click, fill, etc.)
    actionTimeout: 10 * 1000,
    
    // Timeout pour la navigation
    navigationTimeout: 30 * 1000,
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Décommenter pour tester sur d'autres navigateurs
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Tests mobile
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Serveur de développement (optionnel)
  // webServer: {
  //   command: 'pnpm dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
