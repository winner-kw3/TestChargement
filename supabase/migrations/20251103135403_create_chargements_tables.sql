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