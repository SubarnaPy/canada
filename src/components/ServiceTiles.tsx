import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight
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
  const [viewMode, setViewMode] = useState<"grid" | "compact" | "list">("grid");

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

      {/* Services Grid */}
      {services.length === 0 ? (
        <EmptyState
          type="no-results"
        />
      ) : (
        <div className={`max-w-7xl mx-auto ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            : viewMode === "list"
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        }`}>
          {services.map((service) => {
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
      {services.length > 0 && (
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
