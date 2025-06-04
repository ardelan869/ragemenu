import { cn } from '@/lib';

export default function Description({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        'mt-[0.463vmin] break-words border-t-[0.2778vmin] border-black bg-description-gradient px-[1.1111vmin] py-[0.9259vmin] text-white',
        className
      )}
      {...props}
    />
  );
}
