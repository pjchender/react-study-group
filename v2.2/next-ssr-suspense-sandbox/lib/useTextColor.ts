import { useEffect, useState } from 'react';

const useTextColor = (colorWillBe?: string) => {
  const [color, setColor] = useState<string>('black');

  useEffect(() => {
    setColor(colorWillBe ?? 'tomato');
  }, [colorWillBe]);

  return {
    color,
  };
};

export default useTextColor;
