import React from 'react';

interface StyledTextProps {
  text: string;
}

const colorMap: { [key: string]: string } = {
  '~r~': 'text-red-500',
  '~b~': 'text-blue-500',
  '~g~': 'text-green-500',
  '~y~': 'text-yellow-500',
  '~m~': 'text-fuchsia-500',
  '~c~': 'text-cyan-500',
  '~w~': 'text-white',
  '~k~': 'text-black',
  '~a~': 'text-gray-500',
  '~d~': 'text-gray-700',
  '~l~': 'text-gray-300',
  '~p~': 'text-purple-500',
  '~o~': 'text-orange-500',
  '~t~': 'text-teal-500',
  '~v~': 'text-violet-500',
  '~i~': 'text-indigo-500',
  '~br~': 'text-amber-700',
  '~li~': 'text-sky-400',
  '~dg~': 'text-green-700',
  '~lg~': 'text-green-400',
  '~pe~': 'text-orange-200',
  '~be~': 'text-amber-100',
  '~sa~': 'text-red-300',
  '~ma~': 'text-red-800',
  '~pi~': 'text-pink-500',
  '~ol~': 'text-olive-500'
};

const styledText: React.FC<StyledTextProps> = ({ text }) => {
  const segments = text.split(/(~[a-z]{1,2}~|~s~|\n)/);
  let currentColor: string | undefined = undefined;
  return (
    <span>
      {segments.map((segment, index) => {
        if (colorMap[segment]) {
          currentColor = colorMap[segment];
          return null;
        } else if (segment === '~s~') {
          currentColor = undefined;
          return null;
        } else if (segment === '\n') {
          return <br key={index} />;
        } else if (segment.trim() === '') {
          return null;
        } else {
          return (
            <span key={index} className={currentColor}>
              {segment}
            </span>
          );
        }
      })}
    </span>
  );
};

export default styledText;
