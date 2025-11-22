import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Move History</h1>
        <p className="text-muted-foreground mt-1">
          View all stock movements and transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            Movement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            History view coming soon. Track all inventory movements and changes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
