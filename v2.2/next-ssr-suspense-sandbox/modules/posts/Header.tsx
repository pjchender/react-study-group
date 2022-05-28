import { useCallback, useEffect } from 'react';

import useTextColor from '../../lib/useTextColor';
import utilStyles from '../../styles/utils.module.scss';

const Header = () => {
  const { color } = useTextColor();

  const handleClick = useCallback(() => {
    alert('Title Clicked');
  }, []);

  useEffect(() => {
    console.log('[Header] hydrated');
  }, []);

  return (
    <h2 style={{ color }} onClick={handleClick} className={utilStyles.headingLg}>
      Blog
    </h2>
  );
};

export default Header;
