import Link from 'next/link';

import Layout from '../../components/layout';
import { getPostsData, PostData } from '../../lib/posts';
import Header from '../../modules/posts/Header';
import PostList from '../../modules/posts/PostList';
import utilStyles from '../../styles/utils.module.scss';

interface Props {
  allPostsData: PostData[];
}

export default function Home({ allPostsData }: Props) {
  return (
    <Layout home>
      <section className={utilStyles.headingMd}>
        <Link href="/">Back</Link>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <Header />
        <PostList allPostsData={allPostsData} />
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
