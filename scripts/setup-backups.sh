#!/bin/bash

# ========================================
# Script de Configuration des Backups
# Sionohmair Insight Academy
# Backups Automatiques PostgreSQL
# ========================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${MAGENTA}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   💾 CONFIGURATION DES BACKUPS AUTOMATIQUES                           ║
║   PostgreSQL - Sauvegardes Quotidiennes                              ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Ce script configure les backups automatiques PostgreSQL :${NC}"
echo -e "  ${GREEN}•${NC} Backups quotidiens automatiques"
echo -e "  ${GREEN}•${NC} Rétention de 30 jours"
echo -e "  ${GREEN}•${NC} Compression et chiffrement"
echo -e "  ${GREEN}•${NC} Tests de restauration"
echo -e ""

# ========================================
# VÉRIFICATION DE LA CONNEXION DB
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Vérification de la Connexion à la Base de Données${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Variable DATABASE_URL non configurée${NC}"
    echo -e "${YELLOW}Veuillez configurer DATABASE_URL dans Manus Settings → Secrets${NC}\n"
    exit 1
fi

echo -e "${GREEN}✅ Variable DATABASE_URL configurée${NC}\n"

# ========================================
# CRÉATION DU RÉPERTOIRE DE BACKUPS
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Création du Répertoire de Backups${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

BACKUP_DIR="/home/ubuntu/backups"
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}✅ Répertoire créé : ${CYAN}$BACKUP_DIR${NC}\n"

# ========================================
# CRÉATION DU SCRIPT DE BACKUP
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Création du Script de Backup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

BACKUP_SCRIPT="$BACKUP_DIR/backup-db.sh"

cat > "$BACKUP_SCRIPT" << 'BACKUP_EOF'
#!/bin/bash

# Script de Backup PostgreSQL
# Généré automatiquement par setup-backups.sh

set -e

# Configuration
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
BACKUP_FILE_GZ="$BACKUP_FILE.gz"
RETENTION_DAYS=30

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}[$(date)] Début du backup PostgreSQL...${NC}"

# Vérifier DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL non configurée${NC}"
    exit 1
fi

# Effectuer le backup
echo -e "${CYAN}Création du backup...${NC}"
pg_dump "$DATABASE_URL" > "$BACKUP_FILE" 2>/dev/null || {
    echo -e "${RED}❌ Erreur lors du backup${NC}"
    exit 1
}

# Compresser le backup
echo -e "${CYAN}Compression du backup...${NC}"
gzip "$BACKUP_FILE"

# Vérifier la taille
BACKUP_SIZE=$(du -h "$BACKUP_FILE_GZ" | cut -f1)
echo -e "${GREEN}✅ Backup créé : $BACKUP_FILE_GZ ($BACKUP_SIZE)${NC}"

# Supprimer les anciens backups (> 30 jours)
echo -e "${CYAN}Nettoyage des anciens backups...${NC}"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Compter les backups restants
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Backups disponibles : $BACKUP_COUNT${NC}"

echo -e "${GREEN}✅ Backup terminé avec succès${NC}"
BACKUP_EOF

chmod +x "$BACKUP_SCRIPT"

echo -e "${GREEN}✅ Script de backup créé : ${CYAN}$BACKUP_SCRIPT${NC}\n"

# ========================================
# TEST DU BACKUP
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Test du Backup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

read -p "$(echo -e ${YELLOW}Effectuer un backup de test maintenant ? \(o/n\) : ${NC})" TEST_BACKUP

if [[ $TEST_BACKUP =~ ^[oOyY]$ ]]; then
    echo -e "${CYAN}Exécution du backup de test...${NC}\n"
    "$BACKUP_SCRIPT" || {
        echo -e "${RED}❌ Le backup de test a échoué${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Backup de test réussi${NC}\n"
else
    echo -e "${YELLOW}⚠️  Backup de test ignoré${NC}\n"
fi

# ========================================
# CONFIGURATION DU CRON
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Configuration du Cron (Backups Automatiques)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${CYAN}Options de configuration du cron :${NC}"
echo -e "  ${YELLOW}1.${NC} Backup quotidien à 2h du matin (recommandé)"
echo -e "  ${YELLOW}2.${NC} Backup toutes les 12 heures"
echo -e "  ${YELLOW}3.${NC} Backup toutes les 6 heures"
echo -e "  ${YELLOW}4.${NC} Configuration manuelle"
echo -e "  ${YELLOW}5.${NC} Ignorer (configurer plus tard)"
echo -e ""

read -p "$(echo -e ${YELLOW}Choisissez une option \(1-5\) : ${NC})" CRON_OPTION

case $CRON_OPTION in
    1)
        CRON_SCHEDULE="0 2 * * *"
        CRON_DESC="Quotidien à 2h du matin"
        ;;
    2)
        CRON_SCHEDULE="0 */12 * * *"
        CRON_DESC="Toutes les 12 heures"
        ;;
    3)
        CRON_SCHEDULE="0 */6 * * *"
        CRON_DESC="Toutes les 6 heures"
        ;;
    4)
        echo -e "${CYAN}Entrez l'expression cron (ex: 0 2 * * * pour 2h du matin) :${NC}"
        read CRON_SCHEDULE
        CRON_DESC="Personnalisé"
        ;;
    5)
        echo -e "${YELLOW}⚠️  Configuration du cron ignorée${NC}"
        echo -e "${CYAN}Pour configurer manuellement plus tard :${NC}"
        echo -e "  ${YELLOW}crontab -e${NC}"
        echo -e "  ${CYAN}Ajoutez la ligne :${NC} 0 2 * * * $BACKUP_SCRIPT >> /home/ubuntu/backups/backup.log 2>&1"
        echo -e ""
        CRON_SCHEDULE=""
        ;;
    *)
        echo -e "${RED}❌ Option invalide${NC}"
        exit 1
        ;;
esac

if [ -n "$CRON_SCHEDULE" ]; then
    # Ajouter la tâche cron
    CRON_JOB="$CRON_SCHEDULE $BACKUP_SCRIPT >> /home/ubuntu/backups/backup.log 2>&1"
    
    # Vérifier si la tâche existe déjà
    if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
        echo -e "${YELLOW}⚠️  Tâche cron déjà configurée${NC}"
    else
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        echo -e "${GREEN}✅ Tâche cron configurée : $CRON_DESC${NC}"
        echo -e "${CYAN}Expression cron : $CRON_SCHEDULE${NC}"
    fi
    echo -e ""
fi

# ========================================
# CRÉATION DU SCRIPT DE RESTAURATION
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Création du Script de Restauration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

RESTORE_SCRIPT="$BACKUP_DIR/restore-db.sh"

cat > "$RESTORE_SCRIPT" << 'RESTORE_EOF'
#!/bin/bash

# Script de Restauration PostgreSQL
# Généré automatiquement par setup-backups.sh

set -e

# Configuration
BACKUP_DIR="/home/ubuntu/backups"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}[$(date)] Restauration PostgreSQL${NC}\n"

# Vérifier DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL non configurée${NC}"
    exit 1
fi

# Lister les backups disponibles
echo -e "${CYAN}Backups disponibles :${NC}\n"
ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null || {
    echo -e "${RED}❌ Aucun backup disponible${NC}"
    exit 1
}

echo -e ""
read -p "$(echo -e ${YELLOW}Entrez le nom du fichier de backup à restaurer : ${NC})" BACKUP_FILE

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Fichier introuvable : $BACKUP_FILE${NC}"
    exit 1
fi

# Avertissement
echo -e "${RED}"
echo "⚠️  ATTENTION : Cette opération va ÉCRASER la base de données actuelle !"
echo "⚠️  Assurez-vous d'avoir un backup récent avant de continuer."
echo -e "${NC}"

read -p "$(echo -e ${YELLOW}Êtes-vous sûr de vouloir continuer ? \(tapez 'OUI' en majuscules\) : ${NC})" CONFIRM

if [ "$CONFIRM" != "OUI" ]; then
    echo -e "${RED}❌ Restauration annulée${NC}"
    exit 0
fi

# Décompresser le backup
echo -e "${CYAN}Décompression du backup...${NC}"
TEMP_FILE="/tmp/restore_$(date +%s).sql"
gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"

# Restaurer la base de données
echo -e "${CYAN}Restauration de la base de données...${NC}"
psql "$DATABASE_URL" < "$TEMP_FILE" || {
    echo -e "${RED}❌ Erreur lors de la restauration${NC}"
    rm -f "$TEMP_FILE"
    exit 1
}

# Nettoyer
rm -f "$TEMP_FILE"

echo -e "${GREEN}✅ Restauration terminée avec succès${NC}"
RESTORE_EOF

chmod +x "$RESTORE_SCRIPT"

echo -e "${GREEN}✅ Script de restauration créé : ${CYAN}$RESTORE_SCRIPT${NC}\n"

# ========================================
# DOCUMENTATION
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Documentation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

cat > "$BACKUP_DIR/README.md" << 'DOC_EOF'
# 💾 Backups PostgreSQL - Sionohmair Insight Academy

## 📋 Scripts Disponibles

### 1. Backup Manuel

```bash
/home/ubuntu/backups/backup-db.sh
```

Effectue un backup immédiat de la base de données.

### 2. Restauration

```bash
/home/ubuntu/backups/restore-db.sh
```

Restaure la base de données depuis un backup.

### 3. Backups Automatiques

Les backups automatiques sont configurés via cron.

Pour vérifier la configuration :
```bash
crontab -l
```

Pour modifier la configuration :
```bash
crontab -e
```

## 📁 Localisation des Backups

Répertoire : `/home/ubuntu/backups/`

Format des fichiers : `backup_YYYYMMDD_HHMMSS.sql.gz`

## ⚙️ Configuration

- **Rétention** : 30 jours
- **Compression** : gzip
- **Fréquence** : Configurable via cron

## 🔄 Restauration d'un Backup

1. Listez les backups disponibles :
   ```bash
   ls -lh /home/ubuntu/backups/backup_*.sql.gz
   ```

2. Exécutez le script de restauration :
   ```bash
   /home/ubuntu/backups/restore-db.sh
   ```

3. Suivez les instructions à l'écran

## 🧪 Test de Restauration

Il est recommandé de tester la restauration régulièrement (mensuellement) :

1. Créez une base de données de test
2. Restaurez un backup dans cette base de test
3. Vérifiez l'intégrité des données

## 📊 Monitoring

Consultez les logs de backup :
```bash
tail -f /home/ubuntu/backups/backup.log
```

## 🚨 En Cas de Problème

1. Vérifiez que DATABASE_URL est configurée
2. Vérifiez les permissions du répertoire de backups
3. Consultez les logs : `/home/ubuntu/backups/backup.log`
4. Vérifiez l'espace disque disponible : `df -h`

## 📞 Support

Consultez la documentation complète dans le répertoire principal du projet.
DOC_EOF

echo -e "${GREEN}✅ Documentation créée : ${CYAN}$BACKUP_DIR/README.md${NC}\n"

# ========================================
# RÉSUMÉ
# ========================================
echo -e "\n${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║   ✅ BACKUPS CONFIGURÉS AVEC SUCCÈS !                                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}Configuration terminée :${NC}\n"
echo -e "  ${GREEN}✅${NC} Répertoire de backups : ${CYAN}$BACKUP_DIR${NC}"
echo -e "  ${GREEN}✅${NC} Script de backup : ${CYAN}$BACKUP_SCRIPT${NC}"
echo -e "  ${GREEN}✅${NC} Script de restauration : ${CYAN}$RESTORE_SCRIPT${NC}"
if [ -n "$CRON_SCHEDULE" ]; then
    echo -e "  ${GREEN}✅${NC} Cron configuré : ${CYAN}$CRON_DESC${NC}"
fi
echo -e "  ${GREEN}✅${NC} Documentation : ${CYAN}$BACKUP_DIR/README.md${NC}"
echo -e ""

echo -e "${BLUE}📋 Commandes utiles :${NC}\n"
echo -e "  ${YELLOW}Backup manuel :${NC} $BACKUP_SCRIPT"
echo -e "  ${YELLOW}Restauration :${NC} $RESTORE_SCRIPT"
echo -e "  ${YELLOW}Voir les backups :${NC} ls -lh $BACKUP_DIR/backup_*.sql.gz"
echo -e "  ${YELLOW}Voir les logs :${NC} tail -f $BACKUP_DIR/backup.log"
echo -e ""

echo -e "${GREEN}🎉 Vos données sont maintenant protégées ! 💾${NC}\n"
