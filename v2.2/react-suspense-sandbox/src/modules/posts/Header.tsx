import { useCallback, useEffect } from 'react';

import useTextColor from '../../lib/useTextColor';

const Header = () => {
  const { color } = useTextColor();

  const handleClick = useCallback(() => {
    alert('Title Clicked');
  }, []);

  useEffect(() => {
    console.log('[Header] hydrated');
  }, []);

  return (
    <h2 style={{ color }} onClick={handleClick} >
      Blog
    </h2>
  );
};

export default Header;
