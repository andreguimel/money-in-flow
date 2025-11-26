import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { DemoVideoModal } from "@/components/DemoVideoModal";

export const VideoDemo = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Veja o Mordomo em ação
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Assista à demonstração completa e descubra como o Mordomo pode transformar a gestão das suas finanças
          </p>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
            <img 
              src="https://cdn.jsdelivr.net/gh/mathuzabr/img-packtypebot/mordomo.jpg" 
              alt="Dashboard do Mordomo"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                onClick={() => setIsDemoModalOpen(true)}
              >
                <Play className="mr-2 w-6 h-6" />
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DemoVideoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </section>
  );
};
