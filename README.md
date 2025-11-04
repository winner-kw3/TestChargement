# Test_Chargement

## Installer les dépendances

1. Ouvrir un terminal à la racine du projet :

   - git clone https://github.com/winner-kw3/TestChargement.git
   - cd TestChargement

2. Installer les dépendances :
   npm install

## Configurer Supabase (création du projet & clés)

1. Créer un projet sur https://app.supabase.com

2. Dans le projet Supabase -> Connect -> App Frameworks,
   Choisir Framework Next.js récupérer :
   - URL du projet -> `NEXT_PUBLIC_SUPABASE_URL`
   - ANON KEY (public) -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Coller ces valeurs dans `.env` (ou créer `.env`) et coller ces valeurs.

## Schéma de base de données (SQL)

Exécuter ces requêtes SQL dans l'éditeur SQL de Supabase pour créer les tables utilisées par l'app.

```sql
-- Tables principales
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chargements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  transport_id uuid NOT NULL REFERENCES transports(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chargement_produits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chargement_id uuid NOT NULL REFERENCES chargements(id) ON DELETE CASCADE,
  produit_id uuid NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  quantite integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);



INSERT INTO clients (nom) VALUES
  ('Client_A'),
  ('Client_B'),
  ('Client_C');

INSERT INTO transports (nom) VALUES
  ('Transport_A'),
  ('Transport_B'),
  ('Transport_C');

INSERT INTO produits (nom) VALUES
  ('Produit_A'),
  ('Produit_B'),
  ('Produit_C'),
  ('Produit_D');
```

## lancer le projet

1. Lancer le serveur de développement :
   npm run dev

2. Ouvrir http://localhost:3000
