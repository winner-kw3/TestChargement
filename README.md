# Test_Chargement


## Prérequis
- Node.js 18+ (ou version compatible avec Next.js 13.5.1)
- npm ou yarn
- Compte Supabase (https://app.supabase.com)

## Installer et lancer le projet
1. Ouvrir un terminal à la racine du projet :
   cd TestChargement

2. Installer les dépendances :
   npm install

3. Copier l'exemple d'environnement et remplir les clés Supabase :
   - Copier `.env.local.example` en `.env.local` (ou créer `.env` si vous préférez)
   - Remplir `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé anonyme)


4. Lancer le serveur de développement :
   npm run dev

5. Ouvrir http://localhost:3000

Les fichiers centraux :
- [lib/supabase.ts](lib/supabase.ts) — création du client Supabase utilisé par l'app
- [app/chargements/page.tsx](app/chargements/page.tsx) — écran de listing
- [.env.local.example](.env.local.example) — exemple de variables d'environnement
- [package.json](package.json)

## Configurer Supabase (création du projet & clés)
1. Créer un projet sur https://app.supabase.com
2. Dans le projet Supabase - Settings - API, récupérer :
   - URL du projet -> `NEXT_PUBLIC_SUPABASE_URL`
   - ANON KEY (public) -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Coller ces valeurs dans `.env.local` (ou `.env`).



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
