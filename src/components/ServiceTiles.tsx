import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { 
  Home, 
  Briefcase, 
  Rocket, 
  Scale, 
  Shield, 
  GraduationCap,
  DollarSign,
  FileText,
  Heart,
  Users,
  Truck,
  Smartphone,
  ArrowRight,
  Loader2,
  Search,
  X,
  Filter,
  Grid3x3,
  LayoutGrid,
  Eye,
  GitCompare,
  List
} from "lucide-react";
import { CanadaLoader } from "@/components/CanadaLoader";
import { EmptyState } from "@/components/EmptyState";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icon mapping - maps icon names from database to Lucide components
const iconMap: Record<string, any> = {
  Home,
  Briefcase,
  Rocket,
  Scale,
  Shield,
  GraduationCap,
  DollarSign,
  FileText,
  Heart,
  Users,
  Truck,
  Smartphone,
};

// Interface for Service
interface Service {
  serviceId: number;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  price?: string;
}

// COMMENTED OUT - Now fetching from backend API
/*
const services = [
  {
    id: 1,
    title: "Complete Settlement Package",
    description: "Step-by-step guidance for new immigrants with paperwork help",
    icon: Home,
  },
  {
    id: 2,
    title: "Resume & LinkedIn Optimization",
    description: "Professional resume and LinkedIn profile tailored to Canadian employers",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Career Coaching & Interview Prep",
    description: "1-on-1 coaching with interview preparation and networking support",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Business Registration & Setup",
    description: "Complete business registration and structuring in Canada",
    icon: Rocket,
  },
  {
    id: 5,
    title: "Startup Market Research",
    description: "Market research and go-to-market strategy guidance",
    icon: Rocket,
  },
  {
    id: 6,
    title: "Immigration Consultant Matching",
    description: "Connect with certified RCIC immigration consultants",
    icon: FileText,
  },
  {
    id: 7,
    title: "Housing Search Assistance",
    description: "Find affordable housing with local expert guidance",
    icon: Home,
  },
  {
    id: 8,
    title: "Canadian Banking Setup",
    description: "Complete banking setup with credit building guidance",
    icon: DollarSign,
  },
  {
    id: 9,
    title: "Tax ID & Filing Guidance",
    description: "SIN registration and first-year tax filing support",
    icon: DollarSign,
  },
  {
    id: 10,
    title: "Work Permit & Labor Law",
    description: "Guidance on work permits, tenant rights, and labor laws",
    icon: Scale,
  },
  {
    id: 11,
    title: "Provincial Health Card Setup",
    description: "Navigate Canada's healthcare system and get provincial coverage",
    icon: Heart,
  },
  {
    id: 12,
    title: "School Admissions Support",
    description: "Complete school enrollment and credential evaluation",
    icon: GraduationCap,
  },
  {
    id: 13,
    title: "Professional Reskilling Path",
    description: "Diploma equivalency and career upgrade pathways",
    icon: GraduationCap,
  },
  {
    id: 14,
    title: "Newcomer Community Network",
    description: "Connect with cultural communities and find mentorship",
    icon: Users,
  },
  {
    id: 15,
    title: "Airport Pickup & Setup",
    description: "Complete arrival support with temporary accommodation",
    icon: Truck,
  },
  {
    id: 16,
    title: "Digital ID & Apps Setup",
    description: "Complete digital transition with ID applications and essential apps",
    icon: Smartphone,
  },
];
*/

export const ServiceTiles = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");
  
  // New features state
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [quickViewService, setQuickViewService] = useState<Service | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Fetching services from backend...');
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/services`);
        console.log(`📥 Response Status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        console.log(`✅ Successfully fetched ${data.length} services from backend!`);
        console.log('📦 Services:', data.map((s: Service) => ({ id: s.serviceId, title: s.title, icon: s.icon })));
        
        setServices(data);
      } catch (err) {
        console.error('❌ Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Toggle favorite with optimistic UI
  const toggleFavorite = (serviceId: number) => {
    // Immediate visual feedback
    const serviceCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (serviceCard) {
      serviceCard.classList.add('optimistic-success');
      setTimeout(() => serviceCard.classList.remove('optimistic-success'), 300);
    }

    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );

    // Simulate API call (replace with actual API in production)
    // await fetch(`${API_BASE_URL}/favorites`, { method: 'POST', body: JSON.stringify({ serviceId }) });
  };

  // Toggle compare with optimistic UI
  const toggleCompare = (serviceId: number) => {
    // Immediate visual feedback
    const serviceCard = document.querySelector(`[data-service-id="${serviceId}"]`);
    if (serviceCard) {
      serviceCard.classList.add('optimistic-success');
      setTimeout(() => serviceCard.classList.remove('optimistic-success'), 300);
    }

    setCompareList(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else if (prev.length < 3) {
        return [...prev, serviceId];
      }
      return prev; // Max 3 items
    });
  };

  // Extract unique categories from services
  const categories = ["all", ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || 
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 1000]);
  };

  // Loading state
  if (loading) {
    return (
      <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
        <div className="flex items-center justify-center">
          <CanadaLoader />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
        <EmptyState
          type="error"
          title="Failed to Load Services"
          description={error}
          onReset={() => window.location.reload()}
          resetLabel="Try Again"
        />
      </section>
    );
  }

  return (
    <section className="container px-4 py-12 md:py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-white">
          Complete Service Ecosystem
        </h2>
        <p className="text-base md:text-lg text-[#848e9c] max-w-2xl mx-auto px-4">
          Everything you need for a successful Canadian journey - from arrival to integration
        </p>
      </div>

      {/* Interactive Controls Section */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#848e9c]" />
          <Input
            type="text"
            placeholder="Search services by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-6 bg-[#181A20] border-[#2b3139] text-white placeholder:text-[#848e9c] focus:border-[#F0B90B] focus:ring-[#F0B90B]/20 rounded-xl text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#848e9c] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Filter className="h-4 w-4 text-[#848e9c] hidden sm:block" />
            <span className="text-sm text-[#848e9c] hidden sm:inline">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer capitalize px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90"
                      : "bg-[#181A20] text-[#848e9c] border border-[#2b3139] hover:border-[#F0B90B]/50 hover:text-white"
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <TooltipProvider>
            <div className="flex items-center gap-2 bg-[#181A20] border border-[#2b3139] rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-[#F0B90B] text-black scale-110"
                        : "text-[#848e9c] hover:text-white hover:scale-105"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("compact")}
                    className={`p-2 rounded transition-all duration-300 ${
                      viewMode === "compact"
                        ? "bg-[#F0B90B] text-black scale-110"
                        : "text-[#848e9c] hover:text-white hover:scale-105"
                    }`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Compact View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-[#F0B90B] text-black scale-110"
                        : "text-[#848e9c] hover:text-white hover:scale-105"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>List View</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* Results Counter & Compare Badge */}
        <div className="flex items-center justify-between text-sm text-[#848e9c]">
          <div className="flex items-center gap-4">
            <span>
              Showing <strong className="text-[#F0B90B]">{filteredServices.length}</strong> of{" "}
              <strong className="text-white">{services.length}</strong> services
            </span>
            {compareList.length > 0 && (
              <Badge className="bg-[#F0B90B] text-black hover:bg-[#F3BA2F]">
                <GitCompare className="h-3 w-3 mr-1" />
                {compareList.length} to compare
              </Badge>
            )}
          </div>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={handleClearFilters}
              className="text-[#F0B90B] hover:text-[#F0B90B]/80 transition-colors flex items-center gap-1 hover:scale-105"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <Dialog open={!!quickViewService} onOpenChange={(open) => !open && setQuickViewService(null)}>
        <DialogContent className="bg-[#181A20] border-[#F0B90B]/20 text-white max-w-2xl">
          {quickViewService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#F0B90B]">
                  {quickViewService.title}
                </DialogTitle>
                <DialogDescription className="text-[#848e9c]">
                  {quickViewService.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {quickViewService.category && (
                  <Badge className="bg-[#F0B90B]/20 text-[#F0B90B]">
                    {quickViewService.category}
                  </Badge>
                )}
                {quickViewService.price && (
                  <p className="text-2xl font-bold text-[#F0B90B]">{quickViewService.price}</p>
                )}
                <Link to={`/services/${quickViewService.serviceId}`}>
                  <Button className="w-full bg-[#F0B90B] hover:bg-[#F3BA2F] text-black">
                    View Full Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <EmptyState
          type="no-results"
          onReset={handleClearFilters}
        />
      ) : (
        <div className={`max-w-7xl mx-auto ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : viewMode === "list"
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        }`}>
          {filteredServices.map((service) => {
            // Get icon component from icon name, fallback to Briefcase
            const Icon = service.icon ? iconMap[service.icon] || Briefcase : Briefcase;
            
            if (viewMode === "compact") {
              return (
                <Card
                  key={service.serviceId}
                  data-service-id={service.serviceId}
                  className="group card-padding-sm bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(252,213,53,0.1)] cursor-pointer"
                >
                  <Link to={`/services/${service.serviceId}`} className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[#F0B90B]/10 flex-shrink-0">
                      <Icon className="h-5 w-5 text-[#F0B90B]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold mb-1 text-white group-hover:text-[#F0B90B] transition-colors truncate">
                        {service.title}
                      </h3>
                      <p className="text-[#848e9c] text-xs line-clamp-2">
                        {service.description}
                      </p>
                      {service.category && (
                        <Badge className="mt-2 text-xs bg-[#F0B90B]/20 text-[#F0B90B] border-0">
                          {service.category}
                        </Badge>
                      )}
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#848e9c] group-hover:text-[#F0B90B] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </Card>
              );
            }

            return (
              <Card
                key={service.serviceId}
                data-service-id={service.serviceId}
                className="group card-padding-md bg-[#181A20] border-[#2b3139] hover:border-[#F0B90B]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(252,213,53,0.15)] cursor-pointer flex flex-col"
              >
                <Link to={`/services/${service.serviceId}`} className="space-y-3 md:space-y-4 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 md:p-3 rounded-xl bg-[#F0B90B]/10 w-fit">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-[#F0B90B]" />
                    </div>
                    {service.category && (
                      <Badge className="text-xs bg-[#F0B90B]/20 text-[#F0B90B] border-0 capitalize">
                        {service.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold mb-2 text-white group-hover:text-[#F0B90B] transition-colors line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-[#848e9c] text-xs md:text-sm line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {service.price && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#2b3139]">
                      <DollarSign className="h-4 w-4 text-[#F0B90B]" />
                      <span className="text-sm font-semibold text-white">{service.price}</span>
                    </div>
                  )}

                  <Button 
                    variant="ghost" 
                    className="w-full justify-between text-[#848e9c] group-hover:text-[#F0B90B] p-0 hover:bg-transparent mt-auto"
                    size="sm"
                  >
                    <span className="text-xs md:text-sm">Learn More</span>
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      {/* View All Services Button */}
      {filteredServices.length > 0 && (
        <div className="text-center mt-8 md:mt-12">
          <Link to="/services">
            <Button 
              size="lg" 
              className="bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(252,213,53,0.3)] transition-all"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};
