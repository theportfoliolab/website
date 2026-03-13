// src/components/layout/MainLayout.tsx
import * as React from "react"
import { Header } from "@/components/ui/header"
import Footer from "@/components/ui/footer"

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-md md:pt-lg pb-md md:pb-lg bg-secondary-light-bg dark:bg-secondary-dark-bg text-primary-light-fg dark:text-primary-dark-fg">
                {children}
            </main>
            <Footer />
        </div>
    )
}
