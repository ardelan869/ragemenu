/**
 * @credits {https://github.com/Mesrine67}
 */

import { useEffect, useRef, useState } from 'react';

const REGEX = /(~[a-z]{1,2}~|~s~|\n)/g;

export default function ColoredText({
  children
}: {
  children?: string | null | undefined;
}) {
  const currentColor = useRef<string | undefined>(undefined);

  const [segments, setSegments] = useState<string[]>(
    () => children?.split(REGEX) ?? []
  );

  useEffect(() => {
    setSegments(children?.split(REGEX) ?? []);
  }, [children]);

  if (!children) return null;

  console.log(segments);

  return segments.map((segment, index) => {
    if (window.colors[segment as keyof typeof window.colors]) {
      currentColor.current =
        window.colors[segment as keyof typeof window.colors];
      return null;
    } else if (segment === '\n') {
      return <br key={index} />;
    } else if (segment === '~s~' || segment.trim() === '') {
      if (segment === '~s~') currentColor.current = undefined;

      return null;
    } else {
      return (
        <span key={index} style={{ color: currentColor.current }}>
          {segment}
        </span>
      );
    }
  });
}
