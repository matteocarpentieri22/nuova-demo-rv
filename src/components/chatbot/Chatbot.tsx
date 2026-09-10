import { useState, useRef, useEffect } from 'react';
import type { LoadedData } from '../../dataLoader';
import { WidgetEquitaFiscale, WidgetRedistribuzione, WidgetVulnerabilita } from './ChatWidgets';

interface ChatbotProps {
  data: LoadedData;
}

type MessageSender = 'user' | 'bot';

interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  widget?: 'equita' | 'redistribuzione' | 'vulnerabilita';
}

const PREDEFINED_PROMPTS = [
  {
    id: 'equita',
    label: 'Equità Fiscale vs kW/Euro',
    question: 'Mostrami come cambierebbe il bollo se considerassimo non solo kW/classe ambientale, ma anche il profilo fiscale del proprietario',
    answerText: 'Confronto tra modello attuale e modello integrato: chi paga uguale, chi paga meno, chi paga di più, con evidenza di equità fiscale.',
    widget: 'equita' as const
  },
  {
    id: 'redistribuzione',
    label: 'Manovra a Invarianza Gettito',
    question: 'Proponimi una manovra che mantenga invariato il gettito complessivo ma riduca il carico sui contribuenti a minore capacità fiscale',
    answerText: 'Il sistema propone una redistribuzione: riduzioni su alcune fasce, compensazioni su altre, saldo netto sul gettito e impatto sui cluster.',
    widget: 'redistribuzione' as const
  },
  {
    id: 'vulnerabilita',
    label: 'Mappa di Vulnerabilità',
    question: 'Quali gruppi di contribuenti avrebbero maggiore difficoltà a sostenere un aumento del bollo?',
    answerText: 'Mappa di vulnerabilità fiscale: contribuenti con basso reddito, veicoli vetusti, posizioni debitorie pregresse, aree territoriali sensibili.',
    widget: 'vulnerabilita' as const
  }
];

export function Chatbot({ data }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Benvenuto nell\'Assistente IA Tributario della Regione Veneto. Posso interrogare il modello integrato (IRPEF + Tassa Auto) per fornirti insight, simulazioni e analisi di vulnerabilità. Cosa vorresti esplorare oggi?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendPrompt = (promptId: string) => {
    if (isTyping) return;
    
    const prompt = PREDEFINED_PROMPTS.find(p => p.id === promptId);
    if (!prompt) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt.question
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI thinking and generating response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: prompt.answerText,
        widget: prompt.widget
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const renderWidget = (widgetType?: string) => {
    switch (widgetType) {
      case 'equita':
        return <WidgetEquitaFiscale data={data} />;
      case 'redistribuzione':
        return <WidgetRedistribuzione />;
      case 'vulnerabilita':
        return <WidgetVulnerabilita />;
      default:
        return null;
    }
  };

  return (
    <div className="chatbot-container fade-in">
      {/* Sidebar with suggested prompts */}
      <div className="chatbot-sidebar">
        <h3 className="chatbot-sidebar-title">✨ Suggerimenti IA</h3>
        <p className="chatbot-sidebar-desc">
          Seleziona uno degli scenari di demo per interrogare il modello integrato:
        </p>
        <div className="chatbot-prompts-list">
          {PREDEFINED_PROMPTS.map(prompt => (
            <button
              key={prompt.id}
              className="chatbot-prompt-btn"
              onClick={() => handleSendPrompt(prompt.id)}
              disabled={isTyping}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chatbot-main">
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="chat-avatar bot-avatar">RV</div>
              )}
              <div className="chat-bubble-content">
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
                {msg.widget && (
                  <div className="chat-widget-wrapper">
                    {renderWidget(msg.widget)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-avatar bot-avatar">RV</div>
              <div className="chat-bubble bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Disabled for demo purposes except predefined clicks) */}
        <div className="chatbot-input-area">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Scrivi un messaggio all'assistente... (Utilizza i suggerimenti per la demo)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={true}
          />
          <button className="chatbot-send-btn" disabled={true}>
            Invia
          </button>
        </div>
      </div>
    </div>
  );
}
