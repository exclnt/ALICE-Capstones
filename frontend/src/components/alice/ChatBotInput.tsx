import { Icon } from '@iconify/react';

export default function ChatBotInput() {
  return (
    <form action="" className="w-full flex items-center justify-center">
      <input
        type="text"
        placeholder="Ketik pesan..."
        className="w-full bg-bg-main  rounded-tl-xl rounded-bl-xl  py-2 px-5 ring-primary/25 ring-1 focus:ring-2 focus:outline-none focus:ring-primary/25/50 transition duration-200"
      />
      <button className="bg-primary w-h-full h-full rounded-tr-xl rounded-br-xl ring-1 ring-primary/25 text-text-main py-2 px-5 hover:bg-primary/80 transition duration-200">
        <Icon icon="mingcute:send-fill" className="text-bg-main" />
      </button>
    </form>
  );
}
