import { useState, useEffect, useRef } from "react";
import { Eyebrow, Card, YellowButton } from "./ui";

interface ChatMessage {
  sender: "user" | "Sonnet-AOS" | "Fugu-Pro" | "Haiku-Lite";
  avatar: string;
  text: string;
  color: string;
  time: string;
}

const PRESET_MESSAGES: ChatMessage[] = [
  { sender: "user", avatar: "👤", text: "How should we enforce AST validation on automated edits?", color: "border-zinc-200 bg-zinc-50", time: "02:28" },
  { sender: "Sonnet-AOS", avatar: "🐰", text: "We can write regex checks to intercept text replacements before git commits.", color: "border-blue-200 bg-blue-50/20 text-blue-900", time: "02:28" },
  { sender: "Fugu-Pro", avatar: "🐡", text: "Regex is too fragile for AST. We should call Node parser APIs directly and throw compiler syntax errors on fail.", color: "border-purple-200 bg-purple-50/20 text-purple-900", time: "02:29" },
  { sender: "Haiku-Lite", avatar: "⚡", text: "Agreed with Fugu. Running standard parser scripts has minimal token context overhead.", color: "border-amber-200 bg-amber-50/20 text-amber-900", time: "02:29" },
];

export function MastermindApp() {
  const [messages, setMessages] = useState<ChatMessage[]>(PRESET_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [activeSpeakerIdx, setActiveSpeakerIdx] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      sender: "user",
      avatar: "👤",
      text: inputVal,
      color: "border-zinc-200 bg-zinc-50",
      time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);
    setActiveSpeakerIdx(0);

    // Update Sidekick Pet
    window.dispatchEvent(new CustomEvent("sidekick_status_change", {
      detail: { status: "thinking", message: "Mastermind discussion started!" }
    }));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeSpeakerIdx < 0) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let timer: NodeJS.Timeout;

    if (activeSpeakerIdx === 0) {
      timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Sonnet-AOS",
            avatar: "🐰",
            text: "Ingesting parameters. Let's start by mapping AST modules.",
            color: "border-blue-200 bg-blue-50/20 text-blue-900",
            time
          }
        ]);
        setActiveSpeakerIdx(1);
      }, 2000);
    } else if (activeSpeakerIdx === 1) {
      timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Fugu-Pro",
            avatar: "🐡",
            text: "We should also verify the lockfile parameters before compiling AST logic.",
            color: "border-purple-200 bg-purple-50/20 text-purple-900",
            time
          }
        ]);
        setActiveSpeakerIdx(2);
      }, 2200);
    } else if (activeSpeakerIdx === 2) {
      timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "Haiku-Lite",
            avatar: "⚡",
            text: "Checked. The configuration looks solid. Ready to export rules.",
            color: "border-amber-200 bg-amber-50/20 text-amber-900",
            time
          }
        ]);
        setActiveSpeakerIdx(-1);
        setIsTyping(false);

        // Update Sidekick Pet
        window.dispatchEvent(new CustomEvent("sidekick_status_change", {
          detail: { status: "done", message: "Deliberation complete!" }
        }));
      }, 1800);
    }

    return () => clearTimeout(timer);
  }, [activeSpeakerIdx]);

  return (
    <div className="h-full flex flex-col p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="border-b border-hairline pb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏛️</span>
          <div>
            <Eyebrow color="#b62ad9">Agent Mastermind</Eyebrow>
            <h1 className="text-xl font-extrabold text-ink">AI Group Deliberation</h1>
          </div>
        </div>
      </div>

      {/* Discussion Chat Log area */}
      <Card className="flex-1 flex flex-col gap-3 min-h-[250px] p-4 bg-slate-50/50">
        <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-1">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar Icon */}
              <span className="size-8 rounded-full border border-hairline bg-white shadow-sm flex items-center justify-center text-lg shrink-0 select-none">
                {msg.avatar}
              </span>

              {/* Chat Bubble */}
              <div className={`p-3.5 rounded-2xl border shadow-sm ${msg.color}`}>
                <div className="flex justify-between items-center gap-4 text-[10px] font-bold text-mute border-b border-hairline/20 pb-1 mb-1">
                  <span>{msg.sender}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="text-[12.5px] leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mr-auto items-center text-[12px] text-mute font-semibold">
              <span className="size-8 rounded-full border border-hairline bg-white shadow-sm flex items-center justify-center text-lg shrink-0 animate-bounce">
                💬
              </span>
              <span>Agents are deliberate in thread...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </Card>

      {/* Input Message Form */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input
          disabled={isTyping}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask the mastermind room an architectural question..."
          className="flex-1 text-[13px] border border-hairline rounded-lg px-3 py-2 outline-none focus:border-purple-500 bg-white"
        />
        <YellowButton disabled={isTyping} className="bg-purple-600 border-purple-800 text-white hover:brightness-[1.05]">
          Post Query
        </YellowButton>
      </form>
    </div>
  );
}
