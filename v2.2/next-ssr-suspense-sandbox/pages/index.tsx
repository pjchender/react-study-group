import Head from 'next/head';
import Link from 'next/link';

import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.scss';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={utilStyles.headingMd}>
        <p>Check the title color in every page, if the color is red that means it is hydrated</p>
      </section>

      <section>
        <ul>
          <li>
            <Link href="/render-pattern/ssr">SSR only</Link>
          </li>
          <li>
            <Link href="/render-pattern/ssr-with-suspense">SSR + Suspense</Link>
          </li>
          <li>
            <Link href="/render-pattern/csr">CSR + Suspense</Link>
          </li>
        </ul>
      </section>
    </Layout>
  );
}
