import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft } from 'lucide-react';

const Transfers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Internal Transfers</h1>
        <p className="text-muted-foreground mt-1">
          Move stock between warehouses and locations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Transfer functionality coming soon. Move inventory between locations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transfers;
