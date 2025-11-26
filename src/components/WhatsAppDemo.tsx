import { MessageCircle } from "lucide-react";

interface Message {
  type: 'user' | 'system';
  text: string;
}

interface Conversation {
  title: string;
  icon: string;
  messages: Message[];
}

export const WhatsAppDemo = () => {
  const conversations: Conversation[] = [
    {
      title: "Receita",
      icon: "💰",
      messages: [
        {
          type: 'user',
          text: "Recebi 100 reais de freelancer"
        },
        {
          type: 'system',
          text: "✅ Receita registrada:\n📝 Recebi 100 em um trabalho freelancer\n💰 R$ 100,00\n🏷 Freelance"
        }
      ]
    },
    {
      title: "Despesa",
      icon: "🛒",
      messages: [
        {
          type: 'user',
          text: "Gastei 45 reais no mercado"
        },
        {
          type: 'system',
          text: "✅ Despesa registrada:\n📝 Compras no mercado\n💰 R$ 45,00\n🏷 Alimentação"
        }
      ]
    },
    {
      title: "Lembrete",
      icon: "⏰",
      messages: [
        {
          type: 'user',
          text: "Me lembre de pagar a conta de luz dia 15"
        },
        {
          type: 'system',
          text: "✅ Lembrete criado:\n📝 Pagar conta de luz\n📅 15 do mês atual\n🏷 Moradia"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Assistente no WhatsApp
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Gerencie tudo por mensagem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Registre receitas, despesas e lembretes de forma natural, como se estivesse conversando
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conversations.map((conversation, idx) => (
            <div key={idx} className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {conversation.icon}
                </div>
                <div>
                  <div className="font-semibold">Mordomo</div>
                  <div className="text-xs text-white/80">online</div>
                </div>
              </div>

              <div className="bg-[#ECE5DD] p-4 min-h-[300px] space-y-3">
                {conversation.messages.map((message, msgIdx) => (
                  <div
                    key={msgIdx}
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
                        {message.type === 'user' ? '14:32' : '14:32'} ✓✓
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#F0F0F0] px-4 py-3 flex items-center gap-2 border-t border-border/50">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">
                  Digite sua mensagem...
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
