"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadImages } from "@/lib/actions"

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)

      // Validate file types
      const invalidFiles = selectedFiles.filter((file) => !file.type.startsWith("image/"))

      if (invalidFiles.length > 0) {
        setError("Bitte nur Bilddateien hochladen.")
        return
      }

      // Add new files to existing files
      const newFiles = [...files, ...selectedFiles]
      setFiles(newFiles)

      // Create previews for new files
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setPreviews([...previews, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]

    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      setError("Bitte laden Sie mindestens ein Bild hoch.")
      return
    }

    setIsUploading(true)

    try {
      // Upload images to Vercel Blob
      const imageUrls = await uploadImages(files)

      // Navigate to the edit page with the image URLs
      router.push(`/edit?images=${encodeURIComponent(JSON.stringify(imageUrls))}`)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Beim Hochladen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.")
      setIsUploading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Bilder hochladen</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="mb-2 text-lg font-semibold">Bilder hier ablegen oder klicken zum Auswählen</p>
              <p className="text-sm text-muted-foreground mb-4">JPG, PNG oder GIF, maximal 10 MB pro Datei</p>
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                Dateien auswählen
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-6">{error}</div>}

        {previews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Vorschau ({previews.length} Bilder)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt={`Vorschau ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading || files.length === 0}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird hochgeladen...
              </>
            ) : (
              "Weiter"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
