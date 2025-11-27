-- Phase 69: Système NFT de Gratitude Économique

-- Table des NFT sources (formations gratuites, ressources, templates)
CREATE TABLE IF NOT EXISTS nft_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('formation', 'resource', 'template', 'coaching', 'other') DEFAULT 'other',
  initial_value DECIMAL(10, 2) DEFAULT 0.00,
  current_value DECIMAL(10, 2) DEFAULT 0.00,
  total_contributions DECIMAL(10, 2) DEFAULT 0.00,
  beneficiaries_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des bénéficiaires de NFT (utilisateurs ayant reçu gratuitement)
CREATE TABLE IF NOT EXISTS nft_beneficiaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nft_source_id INT NOT NULL,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_contributed DECIMAL(10, 2) DEFAULT 0.00,
  last_contribution_at TIMESTAMP NULL,
  contribution_status ENUM('pending', 'active', 'completed', 'exempt') DEFAULT 'pending',
  gratitude_level ENUM('none', 'low', 'medium', 'high', 'exceptional') DEFAULT 'none',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (nft_source_id) REFERENCES nft_sources(id) ON DELETE CASCADE,
  UNIQUE KEY unique_beneficiary (user_id, nft_source_id)
);

-- Table des contributions (redevances versées)
CREATE TABLE IF NOT EXISTS nft_contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  beneficiary_id INT NOT NULL,
  nft_source_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL COMMENT 'Pourcentage du bénéfice reversé',
  reported_revenue DECIMAL(10, 2) NOT NULL COMMENT 'Revenu déclaré par le bénéficiaire',
  payment_method ENUM('stripe', 'bank_transfer', 'other') DEFAULT 'stripe',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_date TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (beneficiary_id) REFERENCES nft_beneficiaries(id) ON DELETE CASCADE,
  FOREIGN KEY (nft_source_id) REFERENCES nft_sources(id) ON DELETE CASCADE
);

-- Table des enquêtes de recouvrement (suivi des bénéfices générés)
CREATE TABLE IF NOT EXISTS nft_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  beneficiary_id INT NOT NULL,
  inquiry_type ENUM('initial', 'quarterly', 'annual', 'on_demand') DEFAULT 'quarterly',
  inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reported_revenue DECIMAL(10, 2) DEFAULT 0.00,
  evidence_provided TEXT COMMENT 'Preuves fournies (captures, factures, etc.)',
  calculated_contribution DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('pending', 'reviewed', 'approved', 'disputed') DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by INT NULL,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (beneficiary_id) REFERENCES nft_beneficiaries(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes pour optimiser les requêtes
CREATE INDEX idx_nft_beneficiaries_user ON nft_beneficiaries(user_id);
CREATE INDEX idx_nft_beneficiaries_source ON nft_beneficiaries(nft_source_id);
CREATE INDEX idx_nft_contributions_beneficiary ON nft_contributions(beneficiary_id);
CREATE INDEX idx_nft_contributions_status ON nft_contributions(payment_status);
CREATE INDEX idx_nft_inquiries_beneficiary ON nft_inquiries(beneficiary_id);
CREATE INDEX idx_nft_inquiries_status ON nft_inquiries(status);
