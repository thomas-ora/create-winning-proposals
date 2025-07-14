import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Palette, 
  Globe, 
  BarChart3, 
  Clock, 
  Lock,
  Smartphone,
  Zap
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Templates",
      description: "AI-powered templates that adapt to your industry and client needs automatically."
    },
    {
      icon: Palette,
      title: "Custom Branding",
      description: "Seamlessly integrate your brand colors, fonts, and logo into every proposal."
    },
    {
      icon: Globe,
      title: "Unique URLs",
      description: "Share proposals with custom, trackable URLs for professional delivery."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor proposal views, time spent, and engagement metrics instantly."
    },
    {
      icon: Clock,
      title: "Quick Generation",
      description: "Generate complete proposals in under 5 minutes with our streamlined process."
    },
    {
      icon: Lock,
      title: "Secure Sharing",
      description: "Password protection and access controls keep your proposals confidential."
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect viewing experience across all devices and screen sizes."
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Connect with your CRM and other tools via our robust API platform."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Win More Deals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to streamline your proposal process and increase your close rate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-card/50 backdrop-blur border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;