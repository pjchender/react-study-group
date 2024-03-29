import Link from 'next/link';
import { lazy, Suspense } from 'react';
import sleep from 'sleep-promise';

import Layout from '../../components/layout';
import { IMPORT_HEADER_MODULE_TIME, IMPORT_POSTS_MODULE_TIME } from '../../lib/constants';
import { getPostsData, PostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.scss';

const Header = lazy(async () => {
  console.log('[Header] start loading module');
  await sleep(IMPORT_HEADER_MODULE_TIME);
  const mod = await import('../../modules/posts/Header');
  console.log('[Header] end loading module');
  return mod;
});

const PostList = lazy(async () => {
  console.log('[PostList] start loading module');
  await sleep(IMPORT_POSTS_MODULE_TIME);
  const mod = await import('../../modules/posts/PostList');
  console.log('[PostList] end loading module');
  return mod;
});

interface Props {
  allPostsData: PostData[];
}

export default function Home({ allPostsData = [] }: Props) {
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>
        <Link href="/">Back</Link>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Suspense fallback={<p>Loading Header Module...</p>}>
          <Header />
        </Suspense>

        <Suspense fallback={<p>Loading PostList Module...</p>}>
          <PostList allPostsData={allPostsData} />
        </Suspense>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const allPostsData = await getPostsData();

  return {
    props: {
      allPostsData,
    },
  };
}
