import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Users, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 py-24 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Proposal Generation
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Create Winning{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Proposals
            </span>{" "}
            in Minutes
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your business proposals with our intelligent platform. 
            Generate beautiful, professional proposals that convert prospects into clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6">
              Start Creating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline-hero" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-card/50 backdrop-blur border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Professional Templates</h3>
              <p className="text-muted-foreground">
                Choose from dozens of industry-specific templates designed to impress.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with real-time editing and feedback.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">
                Track engagement and optimize your proposals for better results.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;