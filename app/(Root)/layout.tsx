import Header from "@/components/shared/header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <div className="flex  h-screen flex-col">
        <Analytics />
        <Header/>
        <main className="flex-1 wrapper">{children}</main>
        <Footer/>
      </div>
    )

}