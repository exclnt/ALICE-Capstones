import { Icon } from '@iconify/react';

export default function ChatBotAliceResponse({
  text,
  time,
  isPending,
}: {
  text: string;
  time: string;
  isPending?: boolean;
}) {
  return (
    <div className="bg-primary rounded-tr-xl rounded-br-xl rounded-bl-xl py-2 px-5 h-fit max-w-[80%] flex items-start justify-start flex-col gap-1">
      {isPending ? (
        <div>
          <Icon
            icon="eos-icons:three-dots-loading"
            className="text-bg-main animate-pulse text-xl"
          />
          <p className="text-bg-main animate-pulse text-sm">Alice sedang berpikir...</p>
        </div>
      ) : (
        <p className="text-bg-main whitespace-pre-wrap">{text}</p>
      )}
      <p className="dark:text-gray-500 text-gray-400 text-xs">{time}</p>
    </div>
  );
}
