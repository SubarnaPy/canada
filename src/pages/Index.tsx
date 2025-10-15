import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ServiceTiles } from "@/components/ServiceTiles";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AIChatWidget } from "@/components/AIChatWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Users, Zap, Award } from "lucide-react";

const Index = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hasSeenDisclaimer", "true");
    setShowDisclaimer(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Header />
      <Hero />
      <ServiceTiles />
      <HowItWorks />
      
      {/* Features Section */}
      <section className="container px-4 py-20 bg-gradient-to-b from-[#181A20] to-[#0B0E11] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#F0B90B]/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="text-center mb-16 relative z-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose <span className="text-[#F0B90B]">Canadian Nexus</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Your trusted partner for a successful Canadian journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center relative z-10">
          {/* Feature 1 */}
          <div className="order-2 md:order-1 space-y-6 animate-slide-in-left">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#F0B90B] to-[#F3BA2F] flex items-center justify-center shadow-xl">
                <Shield className="h-8 w-8 text-[#0B0E11]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Verified Experts</h3>
                <p className="text-[#F0B90B]">100% Trusted Professionals</p>
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              All our service providers are thoroughly vetted and certified. We partner only with licensed immigration consultants, legal advisors, and industry experts to ensure you receive the highest quality guidance.
            </p>
          </div>
          <div className="order-1 md:order-2 relative group animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/20 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all animate-glow-pulse"></div>
            <div className="relative h-80 rounded-3xl overflow-hidden border-2 border-[#F0B90B]/30 group-hover:border-[#F0B90B]/50 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80" 
                alt="Verified Experts" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/50 to-transparent"></div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="relative group animate-slide-in-left" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all"></div>
            <div className="relative h-80 rounded-3xl overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500/50 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80" 
                alt="Success Stories" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/50 to-transparent"></div>
            </div>
          </div>
          <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">10,000+ Success Stories</h3>
                <p className="text-blue-400">Helping Dreams Come True</p>
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Join thousands of satisfied clients who have successfully navigated their Canadian immigration, settlement, and career journey with our expert guidance and comprehensive support services.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="order-2 space-y-6 animate-slide-in-left" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">24/7 Support</h3>
                <p className="text-purple-400">Always Here for You</p>
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Get instant assistance anytime, anywhere. Our dedicated support team and AI-powered chatbot are available round the clock to answer your questions and guide you through every step of your journey.
            </p>
          </div>
          <div className="order-1 relative group animate-slide-in-right" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all"></div>
            <div className="relative h-80 rounded-3xl overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80" 
                alt="24/7 Support" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/50 to-transparent"></div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="relative group animate-slide-in-left" style={{ animationDelay: '600ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all"></div>
            <div className="relative h-80 rounded-3xl overflow-hidden border-2 border-green-500/30 group-hover:border-green-500/50 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" 
                alt="Award-Winning Service" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11]/50 to-transparent"></div>
            </div>
          </div>
          <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-xl">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Award-Winning Service</h3>
                <p className="text-green-400">Excellence Recognized</p>
              </div>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              Recognized as one of Canada's leading immigration and settlement platforms. Our commitment to excellence and client satisfaction has earned us multiple industry awards and certifications.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AIChatWidget />

      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-md bg-[#181A20] border-[#F0B90B]/20">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#F0B90B]/20">
                <AlertTriangle className="h-6 w-6 text-[#F0B90B]" />
              </div>
              <DialogTitle className="text-xl text-white">
                Disclaimer & Positioning
              </DialogTitle>
            </div>
            <DialogDescription className="text-left space-y-3 pt-2 text-white/70">
              <p>
                We are <strong className="text-[#F0B90B]">not</strong> a certified immigration or legal agent.
              </p>
              <p>
                Our platform connects newcomers with the top verified
                consultants in each city — immigration, legal, career, business,
                financial, and healthcare.
              </p>
              <p>
                We focus on curating trusted experts so you can confidently
                choose the right service provider.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleAccept} className="w-full sm:w-auto bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]">
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
