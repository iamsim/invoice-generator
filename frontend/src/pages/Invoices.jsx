import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Invoices() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Invoices</h2>
        <p className="text-muted-foreground">
          View and manage all invoices
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoices Management</CardTitle>
          <CardDescription>
            View and manage all invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Invoices management interface will be implemented here.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
