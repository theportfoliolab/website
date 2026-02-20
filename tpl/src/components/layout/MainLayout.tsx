// src/components/layout/MainLayout.tsx
import * as React from "react"
import { Header } from "@/components/ui/header"
import Footer from "@/components/ui/footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}