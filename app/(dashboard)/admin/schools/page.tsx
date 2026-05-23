'use client'

import { useState, useMemo } from 'react'
import { getSchools, approveSchool, rejectSchool, updateSchool, deleteSchool, createSchool } from '@/app/actions/school'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Building2, Plus, Edit2, Trash2, CheckCircle2, XCircle, Clock, Search } from 'lucide-react'
import { useEffect } from 'react'

interface School {
  id: string
  registrationNo: string
  schoolName: string
  schoolEmail: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  adminName: string
  adminEmail: string
  message: string
  status: 'Pending' | 'Approved' | 'Rejected'
  date: string
}

interface FormState {
  mode: 'view' | 'create' | 'edit'
  school: Partial<School> | null
}

export default function SchoolsManagementPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All')
  const [formState, setFormState] = useState<FormState>({ mode: 'view', school: null })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load schools on component mount
  useEffect(() => {
    loadSchools()
  }, [])

  async function loadSchools() {
    setLoading(true)
    try {
      const data = await getSchools()
      setSchools(data || [])
    } catch (error) {
      console.error('Failed to load schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch = school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.schoolEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === 'All' || school.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [schools, searchTerm, filterStatus])

  const stats = {
    total: schools.length,
    pending: schools.filter(s => s.status === 'Pending').length,
    approved: schools.filter(s => s.status === 'Approved').length,
    rejected: schools.filter(s => s.status === 'Rejected').length,
  }

  async function handleApprove(id: string) {
    try {
      await approveSchool(id)
      setSchools(schools.map(s => s.id === id ? { ...s, status: 'Approved' } : s))
    } catch (error) {
      console.error('Failed to approve school:', error)
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectSchool(id)
      setSchools(schools.map(s => s.id === id ? { ...s, status: 'Rejected' } : s))
    } catch (error) {
      console.error('Failed to reject school:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this school? This action cannot be undone.')) return

    try {
      await deleteSchool(id)
      setSchools(schools.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete school:', error)
    }
  }

  async function handleSubmitForm() {
    setFormErrors({})
    setIsSubmitting(true)

    try {
      const data = {
        registrationNo: formState.school?.registrationNo || '',
        schoolName: formState.school?.schoolName,
        schoolEmail: formState.school?.schoolEmail,
        phone: formState.school?.phone,
        address: formState.school?.address,
        city: formState.school?.city,
        state: formState.school?.state,
        zip: formState.school?.zip,
        adminName: formState.school?.adminName,
        adminEmail: formState.school?.adminEmail,
        message: formState.school?.message,
        status: formState.school?.status,
      }

      let result
      if (formState.mode === 'create') {
        const createData = { ...data, password: 'DefaultPass123' }
        result = await createSchool(createData)
      } else if (formState.mode === 'edit' && formState.school?.id) {
        result = await updateSchool(formState.school.id, data)
      }

      if (result?.error) {
        setFormErrors({ submit: result.error })
      } else {
        setFormState({ mode: 'view', school: null })
        await loadSchools()
      }
    } catch (error) {
      setFormErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openCreateForm = () => {
    setFormState({
      mode: 'create',
      school: {
        registrationNo: '',
        schoolName: '',
        schoolEmail: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        adminName: '',
        adminEmail: '',
        message: '',
        status: 'Pending',
      }
    })
  }

  const openEditForm = (school: School) => {
    setFormState({ mode: 'edit', school: { ...school } })
  }

  const closeForm = () => {
    setFormState({ mode: 'view', school: null })
    setFormErrors({})
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      case 'Pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="w-4 h-4" />
      case 'Rejected':
        return <XCircle className="w-4 h-4" />
      case 'Pending':
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg flex items-center gap-2">
              <Building2 className="w-8 h-8" />
              Schools Management
            </h1>
            <p className="text-muted-fg mt-2">Manage all registered schools and their approvals</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="w-4 h-4" />
            Add School
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium text-muted-fg">Total Schools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium text-muted-fg">Pending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium text-muted-fg">Approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium text-muted-fg">Rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-fg" />
                  <Input
                    placeholder="Search by school name, email, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-border rounded-md bg-bg dark:bg-surface-900 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Schools Table */}
        <Card>
          <CardHeader>
            <CardTitle>Schools ({filteredSchools.length})</CardTitle>
            <CardDescription>View and manage all schools in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-fg">Loading schools...</div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-12 text-muted-fg">
                {schools.length === 0 ? 'No schools registered yet.' : 'No schools match your search.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-surface-100 dark:bg-surface-900">
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">School</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">Contact</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">Admin</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">Location</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted-fg">Date</th>
                      <th className="px-6 py-3 text-right font-semibold text-muted-fg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school) => (
                      <tr key={school.id} className="border-b border-border/30 hover:bg-surface-100 dark:hover:bg-surface-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-fg">{school.schoolName}</div>
                          <div className="text-xs text-muted-fg">{school.schoolEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-fg">{school.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-fg">{school.adminName}</div>
                          <div className="text-xs text-muted-fg">{school.adminEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-fg">{school.city}, {school.state}</div>
                          <div className="text-xs text-muted-fg">{school.zip}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(school.status)}`}>
                            {getStatusIcon(school.status)}
                            {school.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-fg">{school.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {school.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  onClick={() => handleApprove(school.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => handleReject(school.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => openEditForm(school)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1"
                              onClick={() => handleDelete(school.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Modal */}
        {formState.mode !== 'view' && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg dark:bg-surface-900 border-border dark:border-surface-800">
              <CardHeader className="sticky top-0 bg-bg dark:bg-surface-900 border-b border-border dark:border-surface-800">
                <CardTitle>
                  {formState.mode === 'create' ? 'Add New School' : 'Edit School'}
                </CardTitle>
                <CardDescription>
                  {formState.mode === 'create' 
                    ? 'Create a new school account in the system' 
                    : 'Update school information'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitForm()
                  }}
                  className="space-y-4"
                >
                  {formErrors.submit && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded text-red-700 dark:text-red-300 text-sm">
                      {formErrors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="registrationNo">Registration No. *</Label>
                      <Input
                        id="registrationNo"
                        value={formState.school?.registrationNo || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, registrationNo: e.target.value }
                        })}
                        placeholder="SCH-2026-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        value={formState.school?.schoolName || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, schoolName: e.target.value }
                        })}
                        placeholder="Enter school name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolEmail">School Email *</Label>
                      <Input
                        id="schoolEmail"
                        type="email"
                        value={formState.school?.schoolEmail || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, schoolEmail: e.target.value }
                        })}
                        placeholder="school@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formState.school?.phone || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, phone: e.target.value }
                        })}
                        placeholder="10 digits only"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formState.school?.address || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, address: e.target.value }
                        })}
                        placeholder="Street address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formState.school?.city || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, city: e.target.value }
                        })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formState.school?.state || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, state: e.target.value }
                        })}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formState.school?.zip || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, zip: e.target.value }
                        })}
                        placeholder="6 digits"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminName">Admin Name *</Label>
                      <Input
                        id="adminName"
                        value={formState.school?.adminName || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, adminName: e.target.value }
                        })}
                        placeholder="Administrator full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminEmail">Admin Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={formState.school?.adminEmail || ''}
                        onChange={(e) => setFormState({
                          ...formState,
                          school: { ...formState.school, adminEmail: e.target.value }
                        })}
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message / Notes</Label>
                    <textarea
                      id="message"
                      value={formState.school?.message || ''}
                      onChange={(e) => setFormState({
                        ...formState,
                        school: { ...formState.school, message: e.target.value }
                      })}
                      placeholder="Any additional information about the school"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-600/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={formState.school?.status || 'Pending'}
                      onChange={(e) => setFormState({
                        ...formState,
                        school: { ...formState.school, status: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg dark:bg-surface-800 text-fg dark:text-fg-light focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-600/50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeForm}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save School'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
