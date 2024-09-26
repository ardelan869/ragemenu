import { cn } from '@/lib';

export default function Description({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        'border-t-[3px] border-black mt-[5px] bg-description-gradient px-[12px] py-[10px] text-white',
        className
      )}
      {...props}
    />
  );
}
