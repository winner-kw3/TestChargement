'use client';

import { useEffect, useState } from 'react';
import { supabase, type Chargement } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function ChargementsPage() {
  const [chargements, setChargements] = useState<Chargement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChargements();
  }, []);

  const loadChargements = async () => {
  try {
    const { data, error } = await supabase
      .from('chargements')
      .select(
        `
        *,
        clients(id, nom),
        transports(id, nom),
        chargement_produits(
          quantite,
          produits(id, nom)
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    setChargements(data || []);
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  } finally {
    setLoading(false);
  }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Package className="w-10 h-10 text-blue-600" />
              Chargements
            </h1>
            <p className="text-slate-600 mt-2">
              Gérez vos chargements et leurs produits associés
            </p>
          </div>
          <Link href="/chargements/nouveau">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau chargement
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle>Liste des chargements</CardTitle>
            <CardDescription>
              Tous les chargements enregistrés dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : chargements.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">
                  Aucun chargement pour le moment
                </p>
                <p className="text-slate-400 mt-2">
                  Cliquez sur "Nouveau chargement" pour commencer
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Transporteur</TableHead>
                    <TableHead>Produits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chargements.map((chargement) => (
                    <TableRow key={chargement.id}>
                      <TableCell className="font-medium">
                        {formatDate(chargement.created_at)}
                      </TableCell>
                      <TableCell>{chargement.clients?.nom}</TableCell>
                      <TableCell>{chargement.transports?.nom}</TableCell>
                      <TableCell>
                      {chargement.chargement_produits?.map((cp) => (
                        <div key={cp.produits.id}>
                          {cp.produits.nom} ({cp.quantite})
                        </div>
                      ))}
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
