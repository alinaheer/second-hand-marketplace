"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Edit, Eye, Trash2 } from "lucide-react"
import { getUserListings, deleteListing } from "@/lib/actions"

interface Listing {
  id: string
  title: string
  price: string
  images: string[]
  status: "active" | "pending" | "sold"
  createdAt: string
}

export default function DashboardPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    setIsLoading(true)
    try {
      const data = await getUserListings()
      setListings(data)
    } catch (err) {
      console.error("Error loading listings:", err)
      setError("Die Anzeigen konnten nicht geladen werden.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Möchten Sie diese Anzeige wirklich löschen?")) {
      try {
        await deleteListing(id)
        setListings(listings.filter((listing) => listing.id !== id))
      } catch (err) {
        console.error("Error deleting listing:", err)
        setError("Die Anzeige konnte nicht gelöscht werden.")
      }
    }
  }

  const filteredListings = activeTab === "all" ? listings : listings.filter((listing) => listing.status === activeTab)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Aktiv</Badge>
      case "pending":
        return <Badge variant="outline">In Bearbeitung</Badge>
      case "sold":
        return <Badge variant="secondary">Verkauft</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Anzeigen werden geladen...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Meine Anzeigen</h1>
        <Link href="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Neue Anzeige
          </Button>
        </Link>
      </div>

      {error && <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-6">{error}</div>}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="active">Aktiv</TabsTrigger>
          <TabsTrigger value="pending">In Bearbeitung</TabsTrigger>
          <TabsTrigger value="sold">Verkauft</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Keine Anzeigen gefunden.</p>
          <Link href="/upload">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Neue Anzeige erstellen
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={listing.images[0] || "/placeholder.svg?height=300&width=400"}
                    alt={listing.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">{getStatusBadge(listing.status)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{listing.title}</h3>
                  <p className="font-medium">{listing.price} €</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Erstellt am {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Ansehen
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
