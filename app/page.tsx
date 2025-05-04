import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, ShoppingBag, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-6 w-6" />
            <span>SecondChance</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/upload" className="text-sm font-medium hover:underline">
              Verkaufen
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Verkaufen leicht gemacht
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Laden Sie einfach Bilder Ihrer Gegenstände hoch und wir erstellen automatisch eine Anzeige für Sie.
                  Überprüfen Sie die Details und veröffentlichen Sie mit nur wenigen Klicks.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/upload">
                    <Button size="lg" className="gap-2">
                      Jetzt verkaufen <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                      Meine Anzeigen
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border bg-background">
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div className="aspect-square rounded-md bg-muted/70"></div>
                  <div className="aspect-square rounded-md bg-muted/50"></div>
                  <div className="aspect-square rounded-md bg-muted/60"></div>
                  <div className="aspect-square rounded-md bg-muted/40"></div>
                </div>
                <div className="p-4 border-t">
                  <div className="h-4 w-3/4 rounded-md bg-muted mb-2"></div>
                  <div className="h-3 w-1/2 rounded-md bg-muted/70"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">So funktioniert's</h2>
                <p className="text-muted-foreground md:text-xl">
                  In nur drei einfachen Schritten können Sie Ihre Gegenstände verkaufen
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-12 pt-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">1. Bilder hochladen</h3>
                <p className="text-muted-foreground">
                  Laden Sie Fotos Ihres Gegenstands hoch. Je mehr Bilder, desto besser!
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Settings className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">2. Anzeige überprüfen</h3>
                <p className="text-muted-foreground">
                  Wir generieren automatisch eine Beschreibung. Sie können alle Details anpassen.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">3. Veröffentlichen</h3>
                <p className="text-muted-foreground">
                  Veröffentlichen Sie Ihre Anzeige und erreichen Sie potenzielle Käufer.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:gap-4 items-center justify-between">
            <p className="text-xs text-muted-foreground md:text-sm">© 2024 SecondChance. Alle Rechte vorbehalten.</p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-xs text-muted-foreground hover:underline md:text-sm">
                Datenschutz
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:underline md:text-sm">
                AGB
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:underline md:text-sm">
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
