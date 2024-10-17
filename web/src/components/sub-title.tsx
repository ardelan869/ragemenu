import { cn } from '@/lib';

export default function SubTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'bg-black px-[0.9259vmin] py-[0.3704vmin] text-left text-white',
        className
      )}
      {...props}
    />
  );
}
