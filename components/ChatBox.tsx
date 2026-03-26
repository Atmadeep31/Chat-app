"use client"
type ChatMessage = {
  user: string;
  text: string;
};

interface ChildProps {
  messages: ChatMessage[];
  room: string;
  username: string;
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

const ChatBox = ({
  messages,
  room,
  username,
  message,
  setMessage,
  sendMessage,
}: ChildProps) => {
  return (
    <div className="flex flex-col w-full max-w-2xl h-full bg-zinc-950 overflow-hidden">
  
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {messages.map((msg, index) =>
          msg.user === "System" ? (
  
            <div key={index} className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-zinc-800" />
              <p className="text-xs text-zinc-600 italic shrink-0">{msg.text}</p>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
  
          ) : (
            <div
              key={index}
              className={`flex ${msg.user === username ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex flex-col max-w-sm ${msg.user === username ? "items-end" : "items-start"}`}>
  
                <span className="text-xs text-zinc-600 mb-1 px-1">{msg.user}</span>
  
                <div
                  className={`px-4 py-2.5 rounded-2xl break-words text-sm leading-relaxed shadow-md ${
                    msg.user === username
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
  
              </div>
            </div>
          )
        )}
      </div>
  
      {/* Input Area */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-t border-zinc-800 bg-zinc-900">
        <input
          className="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-600 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          maxLength={240}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="shrink-0 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-medium rounded-xl transition duration-150 shadow-lg shadow-violet-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
  
    </div>
  );
};

export default ChatBox;