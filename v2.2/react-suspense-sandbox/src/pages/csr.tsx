
import { lazy, Suspense, useEffect, useState } from 'react';
import sleep from 'sleep-promise';
import './../app.css';

import { IMPORT_HEADER_MODULE_TIME, IMPORT_POSTS_MODULE_TIME } from '../lib/constants';
import { getPostsData, PostData } from '../lib/posts';


const PostList = lazy(async () => {
  console.log('[PostList] start loading module');
  await sleep(IMPORT_POSTS_MODULE_TIME);
  const mod = await import('../modules/posts/PostList');
  console.log('[PostList] end loading module');
  return mod;
});

const Header = lazy(async () => {
  console.log('[Header] start loading module');
  await sleep(IMPORT_HEADER_MODULE_TIME);
  const mod = await import('../modules/posts/Header');
  console.log('[Header] end loading module');
  return mod;
});

export default function Home() {
  const [allPostsData, setAllPostsData] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('[Home] start fetching data');
      setIsLoading(true);
      const allPostsData = await getPostsData();

      setAllPostsData(allPostsData);
      setIsLoading(false);
      console.log('[Home] end fetching data');
    };

    fetchData().catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <section>
        There is no need to hydrate, so the title color will be red at the first time.
        <br />
        <a href="/">Back</a>
      </section>

      <section>
        <Suspense fallback={<p>Loading Module Header...</p>}>
          <Header />
        </Suspense>

        <Suspense fallback={<p>Loading Module PostList...</p>}>
          <PostList />
        </Suspense>
      </section>
    </div>
  );
}
