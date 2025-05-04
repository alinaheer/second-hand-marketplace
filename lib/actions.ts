"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

// Mock database for listings
let mockListings: any[] = [
  {
    id: "1",
    title: "Vintage Lederjacke",
    description: "Schöne Vintage Lederjacke aus echtem Leder. Größe M, kaum getragen, sehr guter Zustand.",
    price: "89.99",
    images: ["/placeholder.svg?height=400&width=300"],
    status: "active",
    createdAt: "2024-04-28T10:30:00Z",
  },
  {
    id: "2",
    title: "Holztisch aus Eiche",
    description: "Massiver Esstisch aus Eichenholz. 180x90cm, leichte Gebrauchsspuren.",
    price: "120",
    images: ["/placeholder.svg?height=400&width=300"],
    status: "active",
    createdAt: "2024-04-25T14:15:00Z",
  },
  {
    id: "3",
    title: "Smartphone Samsung Galaxy S21",
    description: "Samsung Galaxy S21, 128GB, schwarz. Mit Originalverpackung und Zubehör.",
    price: "350",
    images: ["/placeholder.svg?height=400&width=300"],
    status: "sold",
    createdAt: "2024-04-20T09:45:00Z",
  },
]

// Upload images to Vercel Blob
export async function uploadImages(files: File[]) {
  const imageUrls = []

  for (const file of files) {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    imageUrls.push(blob.url)
  }

  return imageUrls
}

// Generate listing details based on images
export async function generateListingDetails(imageUrls: string[]) {
  // In a real application, this would call an AI service to analyze the images
  // For now, we'll simulate a delay and return mock data
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock AI-generated details
  return {
    title: "Gebrauchter Artikel",
    description:
      "Dies ist ein gebrauchter Artikel in gutem Zustand. Der Artikel zeigt leichte Gebrauchsspuren, ist aber voll funktionsfähig. Ideal für jemanden, der ein gutes Preis-Leistungs-Verhältnis sucht.",
    price: "25.00",
    condition: "gebraucht",
    category: "sonstiges",
  }
}

// Save a new listing
export async function saveListing(listingData: any) {
  // In a real application, this would save to a database
  // For now, we'll add to our mock data
  const newListing = {
    id: `${mockListings.length + 1}`,
    ...listingData,
    status: "active",
    createdAt: new Date().toISOString(),
  }

  mockListings.push(newListing)

  // Wait a bit to simulate saving
  await new Promise((resolve) => setTimeout(resolve, 1000))

  revalidatePath("/dashboard")
  return newListing.id
}

// Get user listings
export async function getUserListings() {
  // In a real application, this would fetch from a database
  // For now, we'll return our mock data
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return mockListings
}

// Delete a listing
export async function deleteListing(id: string) {
  // In a real application, this would delete from a database
  // For now, we'll remove from our mock data
  mockListings = mockListings.filter((listing) => listing.id !== id)

  // Wait a bit to simulate deletion
  await new Promise((resolve) => setTimeout(resolve, 500))

  revalidatePath("/dashboard")
  return true
}
