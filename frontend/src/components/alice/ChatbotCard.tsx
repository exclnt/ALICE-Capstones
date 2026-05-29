// ChatbotCard.tsx
import { useState, useRef, useEffect } from 'react';
import ChatBotAliceResponse from './ChatBotAliceResponse';
import ChatBotInput from './ChatBotInput';
import ChatBotUserResponse from './ChatBotUserResponse';
import { useAliceChat } from '../../hooks/useAliceHook';
import { useStatus } from '../../context/StatusContext';
import { extractError } from '../utils/ExtractApiError';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
  time: string;
};

export default function ChatbotCard() {
  const { mutate, isPending } = useAliceChat();
  const { showError } = useStatus();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlemutate = (text: string) => {
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { role: 'user', text, time: timeNow }]);

    const apiHistory = messages.map((msg) => ({ role: msg.role, text: msg.text }));

    mutate(
      { message: text, history: apiHistory },
      {
        onSuccess: (res) => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'model',
              text: res.data.reply,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        },
        onError: (err) => {
          const extracted = extractError(err);
          showError(extracted.message, extracted.statusCode);
        },
      }
    );
  };

  return (
    <div className="bg-bg-main rounded-xl w-full h-full ring-primary/25 ring-1 flex p-5 flex-col justify-between gap-5">
      <div className="flex flex-col gap-4 overflow-y-auto p-1 h-96">
        {messages.map((msg, index) => {
          const isAlice = msg.role === 'model';
          return (
            <div
              key={index}
              className={`flex ${isAlice ? 'justify-start pr-5' : 'justify-end pl-5'}`}
            >
              {isAlice ? (
                <ChatBotAliceResponse text={msg.text} time={msg.time} />
              ) : (
                <ChatBotUserResponse text={msg.text} time={msg.time} />
              )}
            </div>
          );
        })}
        {isPending && (
          <div className="flex justify-start pr-5">
            <ChatBotAliceResponse isPending={isPending} text="Sedang berpikir..." time="..." />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div>
        <ChatBotInput onSend={handlemutate} isLoading={isPending} />
      </div>
    </div>
  );
}
