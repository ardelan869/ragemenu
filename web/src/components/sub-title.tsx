import { cn } from '@/lib';

import ColoredText from '@/components/colored-text';

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
      <ColoredText>{children}</ColoredText>
    </h3>
  );
}
