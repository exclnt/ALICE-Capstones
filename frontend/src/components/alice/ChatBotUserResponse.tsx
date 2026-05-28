export default function ChatBotUserResponse({ text, time }: { text: string; time: string }) {
  return (
    <div className="bg-bg-main ring-1 rounded-tl-xl rounded-br-xl rounded-bl-xl py-2 px-5 ring-primary/25 h-fit max-w-[80%] flex items-start justify-start flex-col gap-1">
      <p className="text-text-main whitespace-pre-wrap">{text}</p>
      <p className="text-text-muted text-xs">{time}</p>
    </div>
  );
}
