import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { AIChat } from "@/components/AIChat";

const aiAgents = [
  {
    id: "immigration",
    name: "Immigration Pro AI",
    specialty: "Express Entry & PR Applications",
    description: "Expert guidance on visa applications, PR pathways, and immigration documentation",
    interactions: "12.5K",
    availability: "24/7",
    color: "from-blue-500 to-cyan-500",
    icon: "🛂",
  },
  {
    id: "career",
    name: "Career Navigator AI",
    specialty: "Job Search & Resume Building",
    description: "AI-powered resume optimization, job matching, and interview preparation",
    interactions: "9.8K",
    availability: "24/7",
    color: "from-purple-500 to-pink-500",
    icon: "💼",
  },
  {
    id: "business",
    name: "Business Startup AI",
    specialty: "Business Registration & Planning",
    description: "Comprehensive startup guidance, business plans, and regulatory compliance",
    interactions: "15.2K",
    availability: "24/7",
    color: "from-green-500 to-emerald-500",
    icon: "🚀",
  },
  {
    id: "settlement",
    name: "Settlement Assistant AI",
    specialty: "Housing, Healthcare & Banking",
    description: "Complete settlement support for housing, healthcare, banking, and daily essentials",
    interactions: "11.3K",
    availability: "24/7",
    color: "from-orange-500 to-red-500",
    icon: "🏡",
  },
  {
    id: "legal",
    name: "Legal Advisor AI",
    specialty: "Canadian Law & Rights",
    description: "Legal guidance on tenant rights, employment law, and consumer protection",
    interactions: "8.7K",
    availability: "24/7",
    color: "from-indigo-500 to-blue-500",
    icon: "⚖️",
  },
  {
    id: "finance",
    name: "Financial Planner AI",
    specialty: "Banking & Credit Building",
    description: "Financial advice on banking, credit, taxes, and investment planning",
    interactions: "10.2K",
    availability: "24/7",
    color: "from-emerald-500 to-teal-500",
    icon: "💰",
  },
  {
    id: "education",
    name: "Education Counselor AI",
    specialty: "Schools & Universities",
    description: "Guidance on school applications, credential assessment, and student visas",
    interactions: "7.9K",
    availability: "24/7",
    color: "from-amber-500 to-yellow-500",
    icon: "🎓",
  },
  {
    id: "health",
    name: "Healthcare Navigator AI",
    specialty: "OHIP & Medical Services",
    description: "Healthcare system guidance, finding doctors, and mental health support",
    interactions: "9.4K",
    availability: "24/7",
    color: "from-rose-500 to-pink-500",
    icon: "🏥",
  },
];

export const AIAgents = () => {
  const [selectedAgent, setSelectedAgent] = useState<typeof aiAgents[0] | null>(null);

  const handleChatClick = (agent: typeof aiAgents[0]) => {
    console.log("Chat clicked for agent:", agent.name);
    setSelectedAgent(agent);
  };

  return (
    <section className="container px-4 py-20 bg-gradient-to-b from-[#0B0E11] to-[#181A20]">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-[#F0B90B] animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            AI-Powered Assistance
          </h2>
        </div>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Get instant help from specialized AI agents, available 24/7
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {aiAgents.slice(0, 6).map((agent, index) => (
          <Card
            key={agent.name}
            className="group relative overflow-hidden bg-gradient-to-br from-[#181A20] to-[#0B0E11] border-[#F0B90B]/20 hover:border-[#F0B90B]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(240,185,11,0.2)] hover:-translate-y-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className="relative p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#F0B90B] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-[#F0B90B]/80">
                    {agent.specialty}
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/60 leading-relaxed mb-6">
                {agent.description}
              </p>

              <Button
                className="w-full bg-[#F0B90B] hover:bg-[#F3BA2F] text-[#0B0E11] font-semibold group-hover:shadow-lg transition-all"
                onClick={() => handleChatClick(agent)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Chat
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button size="lg" className="bg-gradient-to-r from-[#F0B90B] to-[#F3BA2F] hover:from-[#F3BA2F] hover:to-[#F0B90B] text-[#0B0E11] font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
          <Bot className="h-6 w-6 mr-2" />
          View All {aiAgents.length} AI Agents
          <ArrowRight className="h-6 w-6 ml-2" />
        </Button>
      </div>

      {selectedAgent && (
        <AIChat
          open={!!selectedAgent}
          onOpenChange={(open) => !open && setSelectedAgent(null)}
          agentName={selectedAgent.name}
          agentType={selectedAgent.id}
          agentIcon={selectedAgent.icon}
          agentColor={selectedAgent.color}
        />
      )}
    </section>
  );
};
