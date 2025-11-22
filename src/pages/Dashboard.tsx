import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TruckIcon, ArrowRightLeft } from 'lucide-react';

const Dashboard = () => {
  const { data: products } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: lowStockItems } = useQuery({
    queryKey: ['low-stock'],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('products')
        .select('id, reorder_level');
      
      if (!products) return 0;

      let lowCount = 0;
      for (const product of products) {
        const { data: stock } = await supabase
          .from('stock')
          .select('quantity')
          .eq('product_id', product.id);
        
        const totalStock = stock?.reduce((sum, s) => sum + s.quantity, 0) || 0;
        if (totalStock <= product.reorder_level) {
          lowCount++;
        }
      }
      
      return lowCount;
    },
  });

  const { data: pendingReceipts } = useQuery({
    queryKey: ['pending-receipts'],
    queryFn: async () => {
      const { count } = await supabase
        .from('stock_movements')
        .select('*', { count: 'exact', head: true })
        .eq('movement_type', 'receipt')
        .in('status', ['draft', 'waiting']);
      return count || 0;
    },
  });

  const { data: pendingDeliveries } = useQuery({
    queryKey: ['pending-deliveries'],
    queryFn: async () => {
      const { count } = await supabase
        .from('stock_movements')
        .select('*', { count: 'exact', head: true })
        .eq('movement_type', 'delivery')
        .in('status', ['draft', 'waiting', 'ready']);
      return count || 0;
    },
  });

  const kpis = [
    {
      title: 'Total Products',
      value: products || 0,
      icon: Package,
      color: 'text-primary',
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems || 0,
      icon: AlertTriangle,
      color: 'text-warning',
    },
    {
      title: 'Pending Receipts',
      value: pendingReceipts || 0,
      icon: TruckIcon,
      color: 'text-success',
    },
    {
      title: 'Pending Deliveries',
      value: pendingDeliveries || 0,
      icon: ArrowRightLeft,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your inventory operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Recent stock movements and operations will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
