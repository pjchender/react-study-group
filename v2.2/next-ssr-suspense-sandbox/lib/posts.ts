import sleep from 'sleep-promise';

import { FETCH_DATA_TIME } from './constants';

export type PostData = {
  id: string;
  title: string;
  body: string;
};

export async function getPostsData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  await sleep(FETCH_DATA_TIME);
  const data = res.json() as Promise<PostData[]>;
  return data;
}
