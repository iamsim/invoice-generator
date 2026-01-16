import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function InvoiceElements() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Invoice Elements</h2>
        <p className="text-muted-foreground">
          Manage invoice elements like line items, taxes, discounts, headers, and footers
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Elements Management</CardTitle>
          <CardDescription>
            View and manage all invoice elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Invoice elements management interface will be implemented here.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
