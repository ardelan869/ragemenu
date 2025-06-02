import { cn } from '@/lib';

interface SubTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: string;
}

export default function SubTitle({
  className,
  children,
  ...props
}: SubTitleProps) {
  return (
    <h3
      className={cn(
        'bg-black px-[0.9259vmin] py-[0.3704vmin] text-left text-white',
        className
      )}
      {...props}
    >
      children
    </h3>
  );
}
