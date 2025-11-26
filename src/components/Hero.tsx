
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  type: 'user' | 'system';
  text: string;
}

export const Hero = () => {
  const messages: Message[] = [
    {
      type: 'user',
      text: "Recebi 100 reais de freelancer"
    },
    {
      type: 'system',
      text: "✅ Receita registrada:\n📝 Recebi 100 em um trabalho freelancer\n💰 R$ 100,00\n🏷 Freelance"
    },
    {
      type: 'user',
      text: "Gastei 45 reais no mercado"
    },
    {
      type: 'system',
      text: "✅ Despesa registrada:\n📝 Compras no mercado\n💰 R$ 45,00\n🏷 Alimentação"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-orange-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4 mr-2" />
            Agora com assistente no WhatsApp
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gerencie suas
            <span className="text-orange-500 block">finanças de forma</span>
            simples e inteligente
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            O Mordomo é a plataforma completa para gerenciar suas finanças pessoais e empresariais. 
            Dashboard intuitivo, relatórios detalhados e agora com assistente no WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-4">
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto mb-16">
            <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <div className="font-semibold">Mordomo</div>
                <div className="text-xs text-white/80">online</div>
              </div>
            </div>

            <div className="bg-[#ECE5DD] p-4 min-h-[400px] space-y-3">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-[#DCF8C6] text-gray-900'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {message.text}
                    </p>
                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                      14:32 ✓✓
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">
                Digite sua mensagem...
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">R$</span>
              </div>
              <h3 className="font-semibold text-gray-900">Receitas Controladas</h3>
              <p className="text-gray-600">Organize todas suas fontes de renda</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Relatórios Inteligentes</h3>
              <p className="text-gray-600">Análises detalhadas dos seus gastos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">WhatsApp Integrado</h3>
              <p className="text-gray-600">Lance transações por mensagem</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
