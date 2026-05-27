import ChatBotAliceResponse from './ChatBotAliceResponse';
import ChatBotInput from './ChatBotInput';
import ChatBotUserResponse from './ChatBotUserResponse';

export default function ChatbotCard() {
  return (
    <div className="bg-bg-main rounded-xl w-full h-full ring-primary ring-1 flex p-5 flex-col justify-between gap-5">
      <div className="flex flex-col gap-5 overflow-y-auto p-1 max-h-100">
        <div className=" flex items-start justify-start pr-5 ">
          <ChatBotAliceResponse />
        </div>
        <div className="flex items-end justify-end pl-5 ">
          <ChatBotUserResponse />
        </div>
        <div className="flex items-end justify-end pl-5 ">
          <ChatBotUserResponse />
        </div>
      </div>
      <div>
        <ChatBotInput />
      </div>
    </div>
  );
}
