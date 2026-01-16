import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Clients() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Clients</h2>
        <p className="text-muted-foreground">
          Manage your clients and their information
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Clients Management</CardTitle>
          <CardDescription>
            View and manage all clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Clients management interface will be implemented here.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
