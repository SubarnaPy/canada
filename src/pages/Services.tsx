import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Filter, Star, Share2, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const allServices = [
  {
    id: 1,
    title: "Complete Settlement Package",
    category: "Settlement & Integration",
    description: "Step-by-step guidance for new immigrants with paperwork help",
    price: "$299",
    duration: "Full package",
    rating: 4.9,
    reviews: 187,
    verified: true,
    consultant: "EXPERT 1",
    features: [
      "Paperwork and local registrations",
      "Housing orientation",
      "Healthcare system navigation",
      "School enrollment guidance",
      "Banking setup assistance"
    ]
  },
  {
    id: 2,
    title: "Resume & LinkedIn Optimization",
    category: "Jobs & Career Coaching",
    description: "Professional resume and LinkedIn profile tailored to Canadian employers",
    price: "$125",
    duration: "2 sessions",
    rating: 4.8,
    reviews: 243,
    verified: true,
    consultant: "EXPERT 2",
    features: [
      "ATS-optimized resume",
      "LinkedIn profile makeover",
      "Cover letter templates",
      "Job search strategy guide"
    ]
  },
  {
    id: 3,
    title: "Career Coaching & Interview Prep",
    category: "Jobs & Career Coaching",
    description: "1-on-1 coaching with interview preparation and networking support",
    price: "$150/hour",
    duration: "Hourly",
    rating: 5.0,
    reviews: 156,
    verified: true,
    consultant: "EXPERT 3",
    features: [
      "Mock interviews",
      "Behavioral question prep",
      "Salary negotiation tactics",
      "Networking strategies"
    ]
  },
  {
    id: 4,
    title: "Business Registration & Setup",
    category: "Startup & Business",
    description: "Complete business registration and structuring in Canada",
    price: "$500",
    duration: "Full package",
    rating: 4.9,
    reviews: 89,
    verified: true,
    consultant: "EXPERT 4",
    features: [
      "Business entity selection",
      "Registration process",
      "GST/HST setup",
      "Business bank account"
    ]
  },
  {
    id: 5,
    title: "Startup Market Research",
    category: "Startup & Business",
    description: "Market research and go-to-market strategy guidance",
    price: "$350",
    duration: "3 sessions",
    rating: 4.7,
    reviews: 67,
    verified: true,
    consultant: "EXPERT 5",
    features: [
      "Market analysis",
      "Competitor research",
      "GTM strategy",
      "Pricing recommendations"
    ]
  },
  {
    id: 6,
    title: "Immigration Consultant Matching",
    category: "Immigration Agency Referral",
    description: "Connect with certified RCIC immigration consultants",
    price: "$Free matching",
    duration: "Consultation",
    rating: 5.0,
    reviews: 312,
    verified: true,
    consultant: "EXPERT 6",
    features: [
      "Vetted RCIC consultants",
      "Free initial consultation",
      "Compliance guaranteed",
      "Documentation support"
    ]
  },
  {
    id: 7,
    title: "Housing Search Assistance",
    category: "Local & Household Support",
    description: "Find affordable housing with local expert guidance",
    price: "$75/hour",
    duration: "Hourly",
    rating: 4.8,
    reviews: 134,
    verified: true,
    consultant: "EXPERT 7",
    features: [
      "Neighborhood research",
      "Apartment viewings",
      "Lease negotiation",
      "Utilities setup help"
    ]
  },
  {
    id: 8,
    title: "Canadian Banking Setup",
    category: "Financial Setup",
    description: "Complete banking setup with credit building guidance",
    price: "$99",
    duration: "Single session",
    rating: 4.9,
    reviews: 198,
    verified: true,
    consultant: "EXPERT 8",
    features: [
      "Bank account opening",
      "Credit card application",
      "Credit score education",
      "Banking fee optimization"
    ]
  },
  {
    id: 9,
    title: "Tax ID & Filing Guidance",
    category: "Financial Setup",
    description: "SIN registration and first-year tax filing support",
    price: "$175",
    duration: "Full support",
    rating: 5.0,
    reviews: 145,
    verified: true,
    consultant: "EXPERT 9",
    features: [
      "SIN application help",
      "Tax residency guidance",
      "First tax return filing",
      "Deduction optimization"
    ]
  },
  {
    id: 10,
    title: "Work Permit & Labor Law",
    category: "Legal & Compliance",
    description: "Guidance on work permits, tenant rights, and labor laws",
    price: "$200/hour",
    duration: "Hourly",
    rating: 4.8,
    reviews: 87,
    verified: true,
    consultant: "EXPERT 10",
    features: [
      "Work permit guidance",
      "Tenant rights education",
      "Employment law basics",
      "Legal referrals"
    ]
  },
  {
    id: 11,
    title: "Provincial Health Card Setup",
    category: "Healthcare & Insurance",
    description: "Navigate Canada's healthcare system and get provincial coverage",
    price: "$50",
    duration: "Consultation",
    rating: 4.7,
    reviews: 223,
    verified: true,
    consultant: "EXPERT 11",
    features: [
      "Health card application",
      "System orientation",
      "Doctor registration",
      "Emergency services info"
    ]
  },
  {
    id: 12,
    title: "School Admissions Support",
    category: "Education & Skill Upgrade",
    description: "Complete school enrollment and credential evaluation",
    price: "$150",
    duration: "Full package",
    rating: 4.9,
    reviews: 167,
    verified: true,
    consultant: "EXPERT 12",
    features: [
      "School research",
      "Application assistance",
      "Document translation",
      "Registration support"
    ]
  },
  {
    id: 13,
    title: "Professional Reskilling Path",
    category: "Education & Skill Upgrade",
    description: "Diploma equivalency and career upgrade pathways",
    price: "$200",
    duration: "3 sessions",
    rating: 5.0,
    reviews: 98,
    verified: true,
    consultant: "EXPERT 13",
    features: [
      "Credential assessment",
      "Career pathway planning",
      "Course recommendations",
      "Certification guidance"
    ]
  },
  {
    id: 14,
    title: "Newcomer Community Network",
    category: "Networking & Community",
    description: "Connect with cultural communities and find mentorship",
    price: "$Free",
    duration: "Ongoing",
    rating: 4.8,
    reviews: 456,
    verified: true,
    consultant: "EXPERT 14",
    features: [
      "Meetup invitations",
      "Mentor matching",
      "Cultural events",
      "Volunteer opportunities"
    ]
  },
  {
    id: 15,
    title: "Airport Pickup & Setup",
    category: "Relocation & Logistics",
    description: "Complete arrival support with temporary accommodation",
    price: "$350",
    duration: "Full package",
    rating: 4.9,
    reviews: 234,
    verified: true,
    consultant: "EXPERT 15",
    features: [
      "Airport pickup",
      "Temporary accommodation",
      "SIM card setup",
      "Essential shopping tour"
    ]
  },
  {
    id: 16,
    title: "Digital ID & Apps Setup",
    category: "Digital Transition",
    description: "Complete digital transition with ID applications and essential apps",
    price: "$99",
    duration: "2 sessions",
    rating: 4.7,
    reviews: 189,
    verified: true,
    consultant: "EXPERT 16",
    features: [
      "Provincial ID application",
      "Driver's license guidance",
      "Essential apps setup",
      "Cyber-safety training"
    ]
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof allServices[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high" | "popular">("popular");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Settlement & Integration",
    "Jobs & Career Coaching",
    "Startup & Business",
    "Immigration Agency Referral",
    "Local & Household Support",
    "Financial Setup",
    "Legal & Compliance",
    "Healthcare & Insurance",
    "Education & Skill Upgrade",
    "Networking & Community",
    "Relocation & Logistics",
    "Digital Transition"
  ];

  // Filter and search logic
  const filteredServices = allServices
    .filter(service => {
      // Category filter
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      
      // Search filter
      const matchesSearch = searchQuery.trim() === "" || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sort logic
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB2 = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceB2 - priceA2;
        case "popular":
        default:
          return b.reviews - a.reviews;
      }
    });

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("popular");
  };

  const handleShareClick = (service: typeof allServices[0]) => {
    setSelectedService(service);
    setShareDialogOpen(true);
  };

  const generateReferralLink = (serviceId: number) => {
    return `${window.location.origin}/services/${serviceId}?ref=user123`;
  };

  const handleCopyLink = async () => {
    if (!selectedService) return;
    const link = generateReferralLink(selectedService.id);
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Your referral link has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11] border-b border-[#F0B90B]/10">
          <div className="container px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
              Complete Service Ecosystem
            </h1>
            <p className="text-white/60 text-center mb-8 max-w-2xl mx-auto">
              16+ services covering every aspect of your Canadian journey - from arrival to full integration
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    placeholder="Search services, consultants, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#181A20] border-[#F0B90B]/10 text-white placeholder:text-white/40 focus:border-[#F0B90B]/30"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="md:w-auto border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 p-4 bg-[#181A20] border border-[#F0B90B]/10 rounded-lg space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Sort By */}
                    <div className="flex-1">
                      <label className="text-sm text-white/60 mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#F0B90B]/10 text-white rounded-md focus:border-[#F0B90B]/30 focus:outline-none"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchQuery || selectedCategory !== "All" || sortBy !== "popular") && (
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      selectedCategory === category 
                        ? 'bg-[#F0B90B] text-[#0B0E11] border-[#F0B90B] hover:bg-[#F3BA2F]' 
                        : 'bg-[#181A20] text-[#F0B90B] border-[#F0B90B]/20 hover:bg-[#F0B90B]/10 hover:border-[#F0B90B]/30'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container px-4 py-12">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-white/60">
              Showing <span className="text-[#F0B90B] font-semibold">{filteredServices.length}</span> of <span className="text-white font-semibold">{allServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
            
            {/* Quick Sort on Mobile */}
            <div className="sm:hidden w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#181A20] border border-[#F0B90B]/10 text-white text-sm rounded-md focus:border-[#F0B90B]/30 focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="p-6 bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/10 hover:border-[#F0B90B]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(240,185,11,0.1)] group flex flex-col"
              >
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs shrink-0 bg-[#181A20] text-white/70 border-[#F0B90B]/20">
                      {service.category}
                    </Badge>
                    {service.verified && (
                      <Badge className="text-xs bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20 shrink-0">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#F0B90B] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-3">
                      {service.description}
                    </p>
                    <p className="text-xs text-white/40">
                      by {service.consultant}
                    </p>
                  </div>

                  {/* Features */}
                  {"features" in service && (
                    <ul className="space-y-1 text-xs text-white/60">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#F0B90B] mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Rating & Price */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#F0B90B]/10">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#F0B90B] text-[#F0B90B]" />
                      <span className="font-semibold text-sm text-white">{service.rating}</span>
                      <span className="text-xs text-white/40">
                        ({service.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#F0B90B]">{service.price}</div>
                      {"duration" in service && (
                        <div className="text-xs text-white/40">{service.duration}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold" 
                      size="sm"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleShareClick(service)} className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Affiliate CTA */}
                  <div className="pt-2 border-t border-[#F0B90B]/10">
                    <button 
                      onClick={() => handleShareClick(service)}
                      className="text-xs text-white/60 hover:text-[#F0B90B] transition-colors w-full text-left"
                    >
                      Share & Earn Commission →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-[#181A20] border border-[#F0B90B]/10 mb-6">
                <Search className="h-12 w-12 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
              <p className="text-white/60 mb-6">
                {searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : `No services available in ${selectedCategory}`}
              </p>
              <Button
                onClick={handleClearFilters}
                className="bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Load More - only show if filtered results */}
          {filteredServices.length > 0 && filteredServices.length >= 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10">
                Load More Services
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#181A20] border-[#F0B90B]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Share & Earn Commission</DialogTitle>
            <DialogDescription className="text-white/60">
              Share this service and earn commission on every booking through your link!
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4">
              {/* Service Preview */}
              <div className="p-3 bg-[#0B0E11] border border-[#F0B90B]/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-1 text-white">{selectedService.title}</h4>
                <p className="text-xs text-white/60">by {selectedService.consultant}</p>
              </div>

              {/* Referral Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Your Referral Link</label>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={generateReferralLink(selectedService.id)}
                    className="bg-[#0B0E11] border-[#F0B90B]/10 text-white text-sm"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleCopyLink}
                    className="shrink-0 bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11]"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Share on Social Media</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this service: ${generateReferralLink(selectedService.id)}`)}`, '_blank')}
                  >
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(generateReferralLink(selectedService.id))}&text=${encodeURIComponent(selectedService.title)}`, '_blank')}
                  >
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#F0B90B]/30 text-[#F0B90B] hover:bg-[#F0B90B]/10"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateReferralLink(selectedService.id))}`, '_blank')}
                  >
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Commission Info */}
              <div className="p-3 bg-[#F0B90B]/10 border border-[#F0B90B]/20 rounded-lg">
                <p className="text-xs text-[#F0B90B]">
                  💰 Earn 10% commission on every successful booking through your link!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
