"use client"

import { useState, useEffect } from "react"
import { Users, Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "@/components/feature-layout"

interface Contact {
  id: number
  name: string
  relation: string
  phone: string
}

export default function SafeContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Sarah Johnson", relation: "Mother", phone: "+1 (555) 123-4567" },
    { id: 2, name: "Michael Chen", relation: "Brother", phone: "+1 (555) 987-6543" },
    { id: 3, name: "Jessica Patel", relation: "Friend", phone: "+1 (555) 456-7890" },
  ])

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('safeContacts')
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    }
  }, [])

  const addContact = (newContact: Omit<Contact, 'id'>) => {
    const updatedContacts = [...contacts, { id: contacts.length + 1, ...newContact }]
    setContacts(updatedContacts)
    localStorage.setItem('safeContacts', JSON.stringify(updatedContacts))
  }

  const deleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id)
    setContacts(updatedContacts)
    localStorage.setItem('safeContacts', JSON.stringify(updatedContacts))
  }

  return (
    <FeatureLayout
      title="Safe Contacts"
      description="Manage your emergency contacts who will be notified during emergencies"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">My Emergency Contacts</h2>
          <p className="text-gray-500">People who will be notified during an emergency</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>Add someone who will be notified during an emergency.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const formData = new FormData(form)
                const name = formData.get("name") as string
                const relation = formData.get("relation") as string
                const phone = formData.get("phone") as string
                addContact({ name, relation, phone })
                document.querySelector("dialog")?.close()
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="relation">Relationship</Label>
                  <Input id="relation" name="relation" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Contact</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Emergency Contacts</CardTitle>
          <CardDescription>People who will be notified during an emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.relation} • {contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Services</CardTitle>
            <CardDescription>Local authorities and emergency services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Services</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">911</p>
                  </div>
                </div>
                <Button variant="outline">Call</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5.2 19.1-1.4 1.3c-.6.7-1.6.7-2.2.1C.5 19.5 0 18.2 0 17V5c0-1.3.5-2.6 1.6-3.5.6-.6 1.6-.6 2.2.1l1.4 1.3c.6.6.6 1.6 0 2.2L3.7 6.3c-.2.2-.3.5-.3.8v7.8c0 .3.1.6.3.8l1.5 1.2c.6.6.6 1.6 0 2.2zM8 13a1 1 0 0 1 0-2h3v-1h-2a1 1 0 0 1 0-2h2V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H8z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Local Police Department</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 234-5678</p>
                  </div>
                </div>
                <Button variant="outline">Call</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-orange-600"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                      <path d="M9 22v-4h6v4"></path>
                      <path d="M8 6h.01"></path>
                      <path d="M16 6h.01"></path>
                      <path d="M12 6h.01"></path>
                      <path d="M12 10h.01"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M16 10h.01"></path>
                      <path d="M8 14h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M12 14h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Women's Helpline</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+1 (800) 799-7233</p>
                  </div>
                </div>
                <Button variant="outline">Call</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureLayout>
  )
}
