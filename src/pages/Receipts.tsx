import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckIcon } from 'lucide-react';

const Receipts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
        <p className="text-muted-foreground mt-1">
          Track incoming goods from vendors
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            Receipt Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Receipt functionality coming soon. Create and manage incoming stock from suppliers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipts;
