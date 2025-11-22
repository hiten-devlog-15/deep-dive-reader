import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckIcon } from 'lucide-react';

const Deliveries = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
        <p className="text-muted-foreground mt-1">
          Manage outgoing goods to customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Delivery Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Delivery functionality coming soon. Process and track customer shipments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Deliveries;
