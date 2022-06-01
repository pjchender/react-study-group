import { useCallback, useEffect, useState } from 'react';

import { getPostsData, PostData } from '../../lib/posts';
import useTextColor from '../../lib/useTextColor';
import utilStyles from '../../styles/utils.module.scss';

export default function PostList() {
  const [allPostsData, setAllPostsData] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('[PostList] start fetching data');
      const allPostsData = await getPostsData();

      setAllPostsData(allPostsData);
      console.log('[PostList] end fetching data');
    };

    fetchData().catch((err) => console.error(err));
  }, []);

  const { color } = useTextColor('#14C38E');

  const handleClick = useCallback(() => {
    alert('list item clicked');
  }, []);

  useEffect(() => {
    console.log('[PostList] hydrated');
  }, []);

  return (
    <>
      <p>PostList</p>

      <ul className={utilStyles.list} style={{ color }}>
        {allPostsData.map(({ id, body, title }) => (
          <li onClick={handleClick} className={utilStyles.listItem} key={id}>
            {title}
            <br />
            {id}
            <br />
            {body}
          </li>
        ))}
      </ul>
    </>
  );
}
