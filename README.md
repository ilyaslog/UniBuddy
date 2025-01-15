# 🌟 UniBuddy - Plateforme de Tutorat Intelligent 🌟

## 🚀 Introduction
Bienvenue dans **UniBuddy**, une plateforme web interactive alimentée par l’**intelligence artificielle** (IA).  
Elle offre les fonctionnalités suivantes :
- 💬 **Chat interactif** avec un assistant IA spécialisé selon votre domaine académique.
- 📂 **Téléversement et analyse de fichiers PDF** pour enrichir vos conversations.
- 📝 **Génération automatique de quiz et résumés** basés sur les discussions.

---

## 🎯 Fonctionnalités Principales
### 👤 Gestion des Utilisateurs et Sessions
- 🔑 Créez un compte personnalisé.
- 📚 Sélectionnez une spécialité académique par session.

### 🤖 Interaction avec l’Assistant IA
- 🗨️ Chat intelligent adapté à votre spécialité.
- 📄 Analyse des fichiers PDF pour extraire du contenu pertinent.

### ✍️ Génération de Quiz et Résumés
- 🎯 Quiz automatiques basés sur les conversations.
- ✏️ Résumés des discussions pour les points essentiels.

### ☁️ Gestion des Fichiers (Azure Blob Storage)
- 📤 Téléversez et stockez vos fichiers en toute sécurité.
- 📥 Téléchargez des fichiers pour analyse.

---

## 🛠️ Architecture Technique
- **Backend** : 🌐 Flask pour gérer les endpoints API.
- **IA** : 🧠 GPT-3.5-turbo pour générer des réponses, quiz et résumés.
- **Stockage** : 🗃️ Azure Blob Storage pour gérer les fichiers.
- **PDF** : 📑 pdfplumber pour extraire du texte des fichiers PDF.

---

## 🧩 Installation et Lancement

### 📋 Prérequis
- 🐍 **Python 3.9+**
- ☁️ **Azure Storage Account**
- 🔑 **OpenAI API Key**

### ⚙️ Installation
1. Clonez le dépôt :
```bash
   git clone <repository_url>
   cd UniBuddy
 ```
2.	Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
3.	Configurez les variables d’environnement :
Créez un fichier .env :
   ```bash
AZURE_STORAGE_CONNECTION_STRING=<votre_connexion_azure>
OPENAI_API_KEY=<votre_clé_api_openai>
.....
```
4.	Installez le serveur React:
   ```bash
   npm install lucide-react@0.263.1
   ```
5.	Installez l'ODBC Driver:
   ```bash
  https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver16
   ```
### ▶️ Lancement

Démarrez l’application avec la commande suivante :
```bash
python app.py
```
L’application sera disponible sur http://127.0.0.1:5000 🌐.
- Sur un autre centre de commande (terminal).
Démarrez l’UI avec la commande suivante :
   ```bash
   npm run dev
   ```
---

## 🌟 Points Forts
- 🎨 **Personnalisation** : Assistance IA adaptée à chaque spécialité académique.
- 🤝 **Interactivité**: Chat enrichi par les fichiers téléversés.
- 🤖 **Automatisation** : Quiz et résumés générés automatiquement.
- 📈 **Scalabilité** : Gestion efficace des fichiers via Azure Blob Storage.
 
## 🛠️ Améliorations Futures

### 🔒 Sécurité :
- Utilisation de variables d’environnement pour protéger les clés API.
- Validation renforcée des entrées utilisateur.

### ⚡ Performance :
- Streaming pour les fichiers PDF volumineux.
- Optimisation des appels OpenAI.

### 💡 Expérience Utilisateur :
- Notifications pour informer des erreurs et réussites.
---
## 👥 Auteurs

- Ilyas HIMIT
- Fadi BAHTAT
- Saad BENMOUSSA
- Haytam EL HILALI

## 📧 Contacts :

- 📩 himitilyas@gmail.com
- 📩 saad.benmoussa@uir.ac.ma
- 📩 Haytam.elhilali@uir.ac.ma
- 📩 Fadi.bahtat@uir.ac.ma
  
  ---
🌟 Merci d’utiliser UniBuddy !
