# Test_Chargement

Résumé rapide pour lancer le projet et configurer Supabase.

## Prérequis
- Node.js 18+ (ou version compatible avec Next.js 13.5.1)
- npm ou yarn
- Compte Supabase (https://app.supabase.com)

## Installer et lancer le projet
1. Ouvrir un terminal à la racine du projet :
   cd f:\Test_Chargement\TestChargement

2. Installer les dépendances :
   npm install

3. Copier l'exemple d'environnement et remplir les clés Supabase :
   - Copier `.env.local.example` en `.env.local` (ou créer `.env` si vous préférez)
   - Remplir `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clé anonyme)

   Windows PowerShell :
   ```
   copy .env.local.example .env.local
   ```

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
2. Dans le projet Supabase -> Settings -> API, récupérer :
   - URL du projet -> `NEXT_PUBLIC_SUPABASE_URL`
   - ANON KEY (public) -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Coller ces valeurs dans `.env.local` (ou `.env`).

Important : la clé anonyme est utilisée côté client pour des opérations publiques (select, insert si autorisé). Ne mettez jamais la clé `service_role` dans les fichiers distribués côté client.

## Schéma de base de données (SQL)
Exécuter ces requêtes SQL dans l'éditeur SQL de Supabase pour créer les tables utilisées par l'app.

```sql
-- Tables principales
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  created_at timestamptz default now()
);

create table if not exists transports (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  created_at timestamptz default now()
);

create table if not exists produits (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  created_at timestamptz default now()
);

create table if not exists chargements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  transport_id uuid references transports(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists chargement_produits (
  id uuid primary key default gen_random_uuid(),
  chargement_id uuid references chargements(id) on delete cascade,
  produit_id uuid references produits(id) on delete set null,
  quantite integer not null default 1,
  created_at timestamptz default now()
);
```

## Politiques d'accès (RLS) — Dev rapide
Supabase active RLS par défaut. Pour développement, vous pouvez créer des politiques permissives. Exemples (dev only) :

```sql
-- Activer RLS (si nécessaire)
alter table clients enable row level security;
alter table transports enable row level security;
alter table produits enable row level security;
alter table chargements enable row level security;
alter table chargement_produits enable row level security;

-- Politique: lecture publique (SELECT)
create policy "public_select" on clients   for select using (true);
create policy "public_select" on transports for select using (true);
create policy "public_select" on produits  for select using (true);
create policy "public_select" on chargements for select using (true);
create policy "public_select" on chargement_produits for select using (true);

-- Politique: insertion publique (INSERT) si vous voulez autoriser la création depuis le client
create policy "public_insert" on clients   for insert with check (true);
create policy "public_insert" on transports for insert with check (true);
create policy "public_insert" on produits  for insert with check (true);
create policy "public_insert" on chargements for insert with check (true);
create policy "public_insert" on chargement_produits for insert with check (true);
```

Remarques :
- Ces politiques sont très permissives — uniquement pour développement/test.
- En production, préférez des politiques basées sur auth.role() et user id, ou utilisez le `service_role` côté serveur pour opérations administratives.

## Vérifier l'intégration dans le projet
- Le client Supabase est créé dans [lib/supabase.ts](lib/supabase.ts) et utilise `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Les composants/pages du dossier `app/chargements` utilisent ces tables (voir [app/chargements/page.tsx](app/chargements/page.tsx) et [app/chargements/nouveau/page.tsx](app/chargements/nouveau/page.tsx)).

## Astuces / dépannage
- Si vous voyez des erreurs d'authentification, vérifier les valeurs dans `.env.local`.
- Pour un warning webpack lié à @supabase/realtime-js, voir la config possible dans `next.config.js` (option avancée).