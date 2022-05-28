# A playground for selective hydration feature in Next.js

## Start Server

```bash
$ npm run dev
```

You could use `npm run dev` to start the server with develope mode, but be cautious that in development (next dev), getStaticProps will be called on every request.

Build production:

```bash
$ npm run build
$ npm run start
```

## How to play

You can change the time of api fetching and module loading in the `lib/constants.ts`.

There are three pages you can modify:

- `pages/render-pattern/csr`
- `pages/render-pattern/ssr`
- `pages/render-pattern/ssr-with-suspense`
