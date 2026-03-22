import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { CodeShowcase } from "@/components/landing/code-showcase";
import { Features } from "@/components/landing/features";
import { Benchmarks } from "@/components/landing/benchmarks";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="min-h-screen pt-[73px]">
        <Hero />
        <CodeShowcase />
        <Features />
        <Benchmarks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
