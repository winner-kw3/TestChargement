import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  nom: string;
  created_at: string;
};

export type Transport = {
  id: string;
  nom: string;
  created_at: string;
};

export type Produit = {
  id: string;
  nom: string;
  created_at: string;
};

export type Chargement = {
  id: string;
  client_id: string;
  transport_id: string;
  created_at: string;
  clients?: Client;
  transports?: Transport;
  chargement_produits?: ChargementProduit[]
};

export type ChargementProduit = {
  id: string;
  chargement_id: string;
  produit_id: string;
  quantite: number;
  created_at: string;
  produits: Produit;
};
