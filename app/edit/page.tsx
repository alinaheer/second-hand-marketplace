"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { generateListingDetails, saveListing } from "@/lib/actions"

interface ListingDetails {
  title: string
  description: string
  price: string
  condition: string
  category: string
}

export default function EditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const imagesParam = searchParams.get("images")

  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [listing, setListing] = useState<ListingDetails>({
    title: "",
    description: "",
    price: "",
    condition: "gebraucht",
    category: "sonstiges",
  })

  useEffect(() => {
    if (imagesParam) {
      try {
        const parsedImages = JSON.parse(decodeURIComponent(imagesParam))
        setImages(parsedImages)

        // Generate listing details based on images
        generateDetails(parsedImages)
      } catch (err) {
        console.error("Error parsing images:", err)
        setError("Die Bilddaten konnten nicht geladen werden.")
        setIsLoading(false)
        setIsGenerating(false)
      }
    } else {
      setError("Keine Bilder gefunden. Bitte laden Sie zuerst Bilder hoch!")
      setIsLoading(false)
      setIsGenerating(false)
    }
  }, [imagesParam])

  const generateDetails = async (imageUrls: string[]) => {
    setIsGenerating(true)

    try {
      const details = await generateListingDetails(imageUrls)
      setListing(details)
    } catch (err) {
      console.error("Error generating details:", err)
      setError("Die Anzeigendetails konnten nicht automatisch generiert werden.")

      // Set some default values
      setListing({
        title: "Neuer Artikel",
        description: "Beschreiben Sie Ihren Artikel hier...",
        price: "0",
        condition: "gebraucht",
        category: "sonstiges",
      })
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setListing((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setListing((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Save the listing
      const listingId = await saveListing({
        ...listing,
        images,
      })

      // Redirect to the listing page
      router.push(`/dashboard`)
    } catch (err) {
      console.error("Error saving listing:", err)
      setError("Die Anzeige konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.")
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Bilder werden geladen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md">{error}</div>
        <Button className="mt-4" onClick={() => router.push("/upload")}>
          Zurück zum Upload
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Anzeige bearbeiten</h1>

      {isGenerating ? (
        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-lg">Anzeigendetails werden generiert...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Wir analysieren Ihre Bilder, um automatisch eine Beschreibung zu erstellen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Bilder</h2>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Bild ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input id="title" name="title" value={listing.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preis (€)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={listing.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Zustand</Label>
                  <Select value={listing.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zustand auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neu">Neu</SelectItem>
                      <SelectItem value="wie_neu">Wie neu</SelectItem>
                      <SelectItem value="sehr_gut">Sehr gut</SelectItem>
                      <SelectItem value="gut">Gut</SelectItem>
                      <SelectItem value="gebraucht">Gebraucht</SelectItem>
                      <SelectItem value="defekt">Defekt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select value={listing.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elektronik">Elektronik</SelectItem>
                      <SelectItem value="kleidung">Kleidung</SelectItem>
                      <SelectItem value="moebel">Möbel</SelectItem>
                      <SelectItem value="haushalt">Haushalt</SelectItem>
                      <SelectItem value="freizeit">Freizeit</SelectItem>
                      <SelectItem value="sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              value={listing.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Anzeige speichern
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
