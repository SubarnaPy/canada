import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Shield, Lock, CheckCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("🎉 Successfully subscribed to our newsletter!");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
    
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    //   method: 'POST',
    //   body: JSON.stringify({ email })
    // });
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    toast.success(`Language changed to ${lang === 'en' ? 'English' : 'Français'}`);
    // TODO: Implement actual language switching logic
  };
  return <footer className="border-t border-border bg-card" role="contentinfo" aria-label="Site footer">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
                <span className="text-xl font-bold">ConnectCanada.io</span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-10">Settle smart support services Canada</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for navigating life in Canada with confidence.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Settlement
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Jobs & Career
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Business Startup
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Legal Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Affiliate Program
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Consultant
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-8 p-6 md:p-8 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border border-[#F0B90B]/20 rounded-xl">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-[#F0B90B]" />
                <h3 className="text-xl font-bold text-white">Stay Updated</h3>
              </div>
              <p className="text-sm text-white/70">
                Get the latest news, resources, and exclusive offers for newcomers to Canada.
              </p>
            </div>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                className="flex-1 bg-[#0B0E11] border-[#2b3139] text-white placeholder:text-white/40 focus:border-[#F0B90B] min-h-[44px]"
                aria-label="Email address for newsletter"
                required
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold min-h-[44px] min-w-[44px] hover:scale-105 transition-all"
                aria-label="Subscribe to newsletter"
              >
                {isSubscribing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Trust Badges & Language Selector */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" title="SSL Secured">
              <Lock className="h-5 w-5 text-green-500" />
              <span className="hidden sm:inline">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" title="Privacy Protected">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="hidden sm:inline">Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" title="Verified Consultants">
              <CheckCircle className="h-5 w-5 text-[#F0B90B]" />
              <span className="hidden sm:inline">Verified Consultants</span>
            </div>
            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
              <span className="text-xs text-muted-foreground">Secure Payments</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-[#181A20] border border-[#2b3139] text-white text-sm rounded-lg px-3 py-2 focus:border-[#F0B90B] focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50 cursor-pointer min-h-[44px]"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 ConnectCanada.io. All rights reserved.</p>
          <p className="text-xs mt-1"> 2025 • Designed & Developed by Kyptronix LLP
        </p>
        </div>
      </div>
    </footer>;
};