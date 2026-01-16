import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Plus } from 'lucide-react'
import api from '@/lib/api'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchClients = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/clients-list', {
        params: {
          page,
          limit: 10,
          search: searchTerm
        }
      })

      if (response.data.success) {
        setClients(response.data.data)
        setPagination(response.data.pagination)
      } else {
        setError('Failed to fetch clients')
      }
    } catch (err) {
      console.error('Error fetching clients:', err)
      setError(err.response?.data?.message || 'Failed to fetch clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients(1, search)
  }, [search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    fetchClients(1, searchInput)
  }

  const handlePageChange = (newPage) => {
    fetchClients(newPage, search)
  }

  const handleAddClient = async (e) => {
    e.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    try {
      const response = await api.post('/api/clients', formData)

      if (response.data.success) {
        setIsAddModalOpen(false)
        setFormData({
          client_name: '',
          contact_email: '',
          contact_phone: '',
          address: ''
        })
        // Refresh the clients list
        fetchClients(pagination.currentPage, search)
      } else {
        setFormError(response.data.message || 'Failed to create client')
      }
    } catch (err) {
      console.error('Error creating client:', err)
      setFormError(err.response?.data?.message || 'Failed to create client')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setFormError('')
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Clients</h2>
          <p className="text-muted-foreground">
            Manage your clients and their information ({pagination.totalCount} total)
          </p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64 pl-10 pr-4"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading clients...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {error}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No clients found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.client_id}>
                    <TableCell className="font-medium">
                      {client.client_name}
                    </TableCell>
                    <TableCell>{client.contact_email || '-'}</TableCell>
                    <TableCell>{client.contact_phone || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {client.address || '-'}
                    </TableCell>
                    <TableCell>
                      {client.creator?.name || client.creator?.email || '-'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {client.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Client Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client information below. Client name is required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient}>
            <div className="space-y-4 py-4">
              {formError && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {formError}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="client_name" className="text-sm font-medium">
                  Client Name <span className="text-destructive">*</span>
                </label>
                <Input
                  id="client_name"
                  name="client_name"
                  placeholder="Enter client name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact_email" className="text-sm font-medium">
                  Contact Email
                </label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="client@example.com"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact_phone" className="text-sm font-medium">
                  Contact Phone
                </label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setFormData({
                    client_name: '',
                    contact_email: '',
                    contact_phone: '',
                    address: ''
                  })
                  setFormError('')
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
