import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Warehouse } from 'lucide-react';

const Warehouses = () => {
  const { data: warehouses, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
        <p className="text-muted-foreground mt-1">
          Manage your warehouse locations
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : warehouses && warehouses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Card key={warehouse.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                  </div>
                  <Badge variant={warehouse.is_active ? 'default' : 'secondary'}>
                    {warehouse.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Code:</span>
                    <span className="ml-2 font-mono">{warehouse.code}</span>
                  </div>
                  {warehouse.address && (
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-muted-foreground mt-1">
                        {warehouse.address}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No warehouses configured</h3>
          <p className="text-muted-foreground">
            Warehouses will be managed by administrators
          </p>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
