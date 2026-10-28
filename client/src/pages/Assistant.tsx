import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HeartHandshake,
  PhoneCall,
  User,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { sendChatMessageApi, fetchChatHistoryApi } from '../api/chat';
import { ChatMessage } from '../types';

export const Assistant: React.FC = () => {
  const { user, plots, openDistressModal } = useFarm();
  const { t } = useLanguage();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting if empty
    fetchChatHistoryApi()
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              id: 'initial-welcome',
              sender: 'assistant',
              messageText: `Namaste ${
                user?.full_name || 'Farmer Brother / Sister'
              }! I am your Kisan Bandhu AI agronomic companion. How can I assist you with your crops, weather uncertainties, fertilizer schedules, or government schemes today?`,
              createdAt: new Date().toISOString()
            }
          ]);
        }
      })
      .catch(() => {
        setMessages([
          {
            id: 'initial-welcome',
            sender: 'assistant',
            messageText: `Namaste! I am your Kisan Bandhu AI agronomic companion. You can ask me any crop question in your mother tongue or tap the microphone to speak.`,
            createdAt: new Date().toISOString()
          }
        ]);
      });
  }, [user]);

  // Sync mic transcript into input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      sender: 'user',
      messageText: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText('');
    resetTranscript();
    setIsSending(true);

    try {
      const res = await sendChatMessageApi({
        messageText: text,
        currentPlotId: selectedPlotId || undefined
      });

      setMessages((prev) => [...prev, res]);

      // If distress detected or user asks for audio, we can speak
      if (res.distressFlag) {
        speak(res.messageText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'assistant',
        messageText:
          'Kisan Bandhu encountered a momentary connection hiccup. Please verify your internet or try asking again.',
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPills = [
    'Pink bollworm damage on Bt cotton',
    'Soybean yellow mosaic virus control',
    'How to apply for 4% Kisan Credit Card',
    'Urea and DAP dosage for wheat',
    'Preventing onion storage rot in monsoon'
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                Voice-Enabled Multilingual Agronomy Companion
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2 tracking-tight">
              Kisan Bandhu AI Assistant
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time agronomy advisory, pest diagnosis, fertilizer math, debt counseling, and farmer crisis support in your regional language.
            </p>
          </div>

          <button
            onClick={openDistressModal}
            className="flex items-center space-x-2 px-3.5 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 w-fit"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Crisis Hotline (14416)</span>
          </button>
        </div>

        {/* Plot Selector Bar */}
        {plots.length > 0 && (
          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">Context Plot:</span>
            <select
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              <option value="">All Farm Holdings</option>
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.plot_name} ({p.size_acres} ac, {p.current_crop || 'Fallow'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl h-[520px] flex flex-col justify-between">
        
        {/* Message Log */}
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-emerald-600 text-white shadow-glow-green'
                      : msg.distressFlag
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : msg.distressFlag
                      ? 'bg-red-950/70 border border-red-700/80 text-red-100 rounded-tl-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Distress Flag Header */}
                  {msg.distressFlag && (
                    <div className="flex items-center space-x-2 text-red-300 font-bold mb-2 pb-2 border-b border-red-800/80">
                      <HeartHandshake className="w-4 h-4" />
                      <span>Crisis Support Interventions & Moratorium Protections</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.messageText}</div>

                  {/* If Distress Hotline Payload is present */}
                  {msg.actionablePayload && (
                    <div className="mt-3 pt-3 border-t border-red-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href="tel:14416"
                        className="flex items-center space-x-2 p-2 rounded-xl bg-red-900/40 hover:bg-red-900/60 border border-red-700 text-white transition-colors"
                      >
                        <PhoneCall className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="font-bold text-xs">Tele-MANAS: 14416</div>
                          <div className="text-[10px] text-red-300">24/7 Free Helpline</div>
                        </div>
                      </a>

                      <a
                        href="tel:18001801551"
                        className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white transition-colors"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="font-bold text-xs">Kisan Call Centre: 1800-180-1551</div>
                          <div className="text-[10px] text-slate-400">Agronomy & Credit Info</div>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Read Aloud Button for Assistant Messages */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => {
                          if (isSpeaking) stop();
                          else speak(msg.messageText);
                        }}
                        className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white"
                        title="Listen to this message"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 text-slate-400 text-xs rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>Kisan Bandhu is analyzing your query & localized agronomy data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          
          {/* Quick Question Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">Try:</span>
            {quickPills.map((pill, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(pill)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-full shrink-0 transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  resetTranscript();
                  startListening();
                }
              }}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-950 hover:bg-slate-800 text-blue-400 border-slate-700'
              }`}
              title={isListening ? 'Stop recording voice' : 'Speak your question'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about pests, fertilizers, crop rotations, or market prices..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all shrink-0"
              title="Send question"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

