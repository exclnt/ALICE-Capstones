import { Icon } from '@iconify/react';
import { useState } from 'react';

type ChatBotInputProps = {
  onSend: (message: string) => void;
  isLoading: boolean;
};

export default function ChatBotInput({ onSend, isLoading }: ChatBotInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex h-10 items-center justify-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        placeholder="Ketik pesan..."
        className="w-full bg-bg-main rounded-tl-xl rounded-bl-xl py-2 px-5 ring-primary/25 ring-1 focus:ring-2 focus:outline-none focus:ring-primary transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-text-main"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="bg-primary h-full rounded-tr-xl ring-1 ring-primary rounded-br-xl text-text-main py-2 px-5 hover:bg-primary/80 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <Icon icon="mingcute:loading-fill" className="text-bg-main animate-spin text-xl" />
        ) : (
          <Icon icon="mingcute:send-fill" className="text-bg-main text-xl" />
        )}
      </button>
    </form>
  );
}
