'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  supabase,
  type Client,
  type Transport,
  type Produit,
} from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type LigneProduit = {
  id: string;
  produit_id: string;
  quantite: number;
};

export default function NouveauChargementPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [clientId, setClientId] = useState('');
  const [transportId, setTransportId] = useState('');
  const [lignesProduits, setLignesProduits] = useState<LigneProduit[]>([
    { id: '1', produit_id: '', quantite: 1 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsRes, transportsRes, produitsRes] = await Promise.all([
        supabase.from('clients').select('*').order('nom'),
        supabase.from('transports').select('*').order('nom'),
        supabase.from('produits').select('*').order('nom'),
      ]);

      console.log('Clients:', clientsRes);
      console.log('Transports:', transportsRes);
      console.log('Produits:', produitsRes);

      if (clientsRes.error) throw clientsRes.error;
      if (transportsRes.error) throw transportsRes.error;
      if (produitsRes.error) throw produitsRes.error;

      setClients(clientsRes.data || []);
      setTransports(transportsRes.data || []);
      setProduits(produitsRes.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const ajouterLigneProduit = () => {
    setLignesProduits([
      ...lignesProduits,
      { id: Date.now().toString(), produit_id: '', quantite: 1 },
    ]);
  };

  const supprimerLigneProduit = (id: string) => {
    if (lignesProduits.length > 1) {
      setLignesProduits(lignesProduits.filter((ligne) => ligne.id !== id));
    }
  };

  const updateLigneProduit = (
    id: string,
    field: 'produit_id' | 'quantite',
    value: string | number
  ) => {
    setLignesProduits(
      lignesProduits.map((ligne) =>
        ligne.id === id ? { ...ligne, [field]: value } : ligne
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !transportId) {
      toast.error('Veuillez sélectionner un client et un transporteur');
      return;
    }

    const produitsValides = lignesProduits.filter(
      (ligne) => ligne.produit_id && ligne.quantite > 0
    );

    if (produitsValides.length === 0) {
      toast.error('Veuillez ajouter au moins un produit');
      return;
    }

    setSaving(true);

    try {
      const { data: chargement, error: chargementError } = await supabase
        .from('chargements')
        .insert({
          client_id: clientId,
          transport_id: transportId,
        })
        .select()
        .single();

      if (chargementError) throw chargementError;

      const chargementProduitsData = produitsValides.map((ligne) => ({
        chargement_id: chargement.id,
        produit_id: ligne.produit_id,
        quantite: ligne.quantite,
      }));

      const { error: produitsError } = await supabase
        .from('chargement_produits')
        .insert(chargementProduitsData);

      if (produitsError) throw produitsError;

      toast.success('Chargement créé avec succès');
      router.push('/chargements');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la création du chargement');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/chargements">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">
            Nouveau chargement
          </h1>
          <p className="text-slate-600 mt-2">
            Créez un nouveau chargement avec ses produits associés
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-slate-200 mb-6">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>
                Sélectionnez le client et le transporteur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport">Transporteur *</Label>
                <Select value={transportId} onValueChange={setTransportId}>
                  <SelectTrigger id="transport">
                    <SelectValue placeholder="Sélectionnez un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {transports.map((transport) => (
                      <SelectItem key={transport.id} value={transport.id}>
                        {transport.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle>Produits</CardTitle>
              <CardDescription>
                Ajoutez les produits à charger avec leurs quantités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lignesProduits.map((ligne, index) => (
                <div
                  key={ligne.id}
                  className="flex items-end gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`produit-${ligne.id}`}>Produit *</Label>
                    <Select
                      value={ligne.produit_id}
                      onValueChange={(value) =>
                        updateLigneProduit(ligne.id, 'produit_id', value)
                      }
                    >
                      <SelectTrigger id={`produit-${ligne.id}`}>
                        <SelectValue placeholder="Sélectionnez un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {produits.map((produit) => (
                          <SelectItem key={produit.id} value={produit.id}>
                            {produit.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32 space-y-2">
                    <Label htmlFor={`quantite-${ligne.id}`}>Quantité *</Label>
                    <Input
                      id={`quantite-${ligne.id}`}
                      type="number"
                      min="1"
                      value={ligne.quantite}
                      onChange={(e) =>
                        updateLigneProduit(
                          ligne.id,
                          'quantite',
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => supprimerLigneProduit(ligne.id)}
                    disabled={lignesProduits.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={ajouterLigneProduit}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-6">
            <Link href="/chargements">
              <Button type="button" variant="outline" disabled={saving}>
                Annuler
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
