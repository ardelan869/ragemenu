import { cn } from '@/lib';

export default function SubTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'bg-black text-white text-left px-[10px] py-1 uppercase',
        className
      )}
      {...props}
    />
  );
}
