import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
      <CTA />
      
      {/* View All Proposals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Sample Proposals</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse through our collection of professionally crafted proposals to see the system in action.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/proposals">
              <Button size="lg" variant="hero" className="shadow-elegant">
                View All Proposals
              </Button>
            </Link>
            <Link to="/api-docs">
              <Button size="lg" variant="outline">
                API Documentation
              </Button>
            </Link>
            <Link to="/settings/api-keys">
              <Button size="lg" variant="secondary">
                Manage API Keys
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
};

export default Index;
