import { Icon } from '@iconify/react';
export default function Loading() {
  return (
    <div className="flex bg-bg-main text-text-main w-full h-screen items-center flex-col justify-center">
      <Icon icon={'line-md:loading-loop'} className="text-5xl" />
      <h2 className="text-2xl mt-5">Loading..</h2>
    </div>
  );
}
