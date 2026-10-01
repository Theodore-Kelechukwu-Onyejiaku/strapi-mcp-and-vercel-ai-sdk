'use strict';

// Replaces every article with 20 published JavaScript articles across 4 categories.
// Internal links use /blog/<slug>. A few point to slugs that don't exist, so
// check_internal_links has something to report.

const AUTHORS = { david: 'ogkh1jtjyhurdbw7qj0rrf1f', sarah: 'd6shswzcbz8f9dy9v7gf0x17' };

const CATEGORIES = [
  { slug: 'javascript-basics', name: 'JavaScript Basics', description: 'Core language features every JavaScript developer should know.' },
  { slug: 'async-javascript', name: 'Async JavaScript', description: 'Promises, async/await, and the event loop.' },
  { slug: 'nodejs', name: 'Node.js', description: 'Server-side JavaScript with Node.js.' },
  { slug: 'browser-dom', name: 'Browser & DOM', description: 'Working with the DOM and browser APIs.' },
];

const text = (body) => ({ __component: 'shared.rich-text', body: body.trim() });
const quote = (title, body) => ({ __component: 'shared.quote', title, body });

const ARTICLES = [
  // ---------- JavaScript Basics ----------
  {
    category: 'javascript-basics', author: 'david',
    slug: 'let-const-var-javascript',
    title: 'let, const, and var: Choosing the Right Declaration',
    description: 'When to use let, const, or var, and why block scope matters.',
    blocks: [
      text(`
## Three ways to declare a variable

JavaScript gives you \`var\`, \`let\`, and \`const\`. \`var\` is function-scoped and hoisted with a value of \`undefined\`. \`let\` and \`const\` are block-scoped and sit in the *temporal dead zone* until their declaration runs.

\`\`\`javascript
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1
console.log(b); // ReferenceError: b is not defined
\`\`\`

## The rule of thumb

Use \`const\` by default, \`let\` when you need to reassign, and avoid \`var\` in new code. Note that \`const\` prevents reassignment, not mutation:

\`\`\`javascript
const user = { name: 'Ada' };
user.name = 'Grace'; // fine
user = {};           // TypeError
\`\`\`

Block scope is also what makes [closures](/blog/javascript-closures-explained) inside loops behave the way you expect.
`),
    ],
  },
  {
    category: 'javascript-basics', author: 'sarah',
    slug: 'javascript-closures-explained',
    title: 'JavaScript Closures Explained with Practical Examples',
    description: 'What closures are, how they work, and where you already use them.',
    blocks: [
      text(`
## What is a closure?

A closure is a function that remembers the variables from the scope where it was created, even after that scope has finished running.

\`\`\`javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}

const next = createCounter();
next(); // 1
next(); // 2
\`\`\`

\`count\` is private: nothing outside \`createCounter\` can touch it.

## Where you meet closures every day

- Event handlers that read state from the surrounding function
- Factory functions and module patterns
- Utilities like [debounce and throttle](/blog/debounce-and-throttle), which keep a timer ID in a closure

## The classic loop bug

\`\`\`javascript
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));
// 3, 3, 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));
// 0, 1, 2
\`\`\`

\`let\` creates a fresh binding per iteration. See [let, const, and var](/blog/let-const-var-javascript) for why.
`),
      quote('Kyle Simpson', 'Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.'),
    ],
  },
  {
    category: 'javascript-basics', author: 'david',
    slug: 'understanding-this-in-javascript',
    title: 'Understanding this in JavaScript',
    description: 'The four rules that decide what this points to.',
    blocks: [
      text(`
## this is decided at call time

Unlike most variables, \`this\` isn't fixed where a function is written. It depends on *how the function is called*.

1. **Method call**: \`obj.greet()\` sets \`this\` to \`obj\`
2. **Plain call**: \`greet()\` sets \`this\` to \`undefined\` in strict mode
3. **Explicit**: \`greet.call(obj)\`, \`apply\`, or \`bind\`
4. **Constructor**: \`new Greeter()\` sets \`this\` to the new object

\`\`\`javascript
const user = {
  name: 'Ada',
  greet() { return \`Hi, \${this.name}\`; },
};

const greet = user.greet;
greet(); // TypeError in strict mode: this is undefined
\`\`\`

## Arrow functions don't have their own this

Arrow functions capture \`this\` from the enclosing scope, the same way [closures](/blog/javascript-closure-explained) capture variables. That makes them a good fit for callbacks inside methods.
`),
    ],
  },
  {
    category: 'javascript-basics', author: 'sarah',
    slug: 'javascript-array-methods',
    title: "Map, Filter, and Reduce: JavaScript Array Methods You'll Use Daily",
    description: 'Transform data declaratively with map, filter, and reduce.',
    blocks: [
      text(`
## map: transform every item

\`\`\`javascript
const prices = [10, 20, 30];
const withTax = prices.map((p) => p * 1.2); // [12, 24, 36]
\`\`\`

## filter: keep what matches

\`\`\`javascript
const users = [{ name: 'Ada', active: true }, { name: 'Bob', active: false }];
const active = users.filter((u) => u.active);
\`\`\`

## reduce: fold into one value

\`\`\`javascript
const total = prices.reduce((sum, p) => sum + p, 0); // 60
\`\`\`

Always pass an initial value to \`reduce\`. Without one, an empty array throws.

## Chaining

\`\`\`javascript
const revenue = orders
  .filter((o) => o.status === 'paid')
  .map((o) => o.amount)
  .reduce((a, b) => a + b, 0);
\`\`\`

Pair these with [destructuring](/blog/destructuring-and-spread) for concise callbacks, like \`({ amount }) => amount\`.
`),
    ],
  },
  {
    category: 'javascript-basics', author: 'david',
    slug: 'destructuring-and-spread',
    title: 'Destructuring and the Spread Operator in JavaScript',
    description: 'Unpack objects and arrays, and copy or merge them with spread.',
    blocks: [
      text(`
## Object and array destructuring

\`\`\`javascript
const { name, role = 'viewer' } = user;
const [first, , third] = ['a', 'b', 'c'];
\`\`\`

Defaults kick in only when the value is \`undefined\`.

## Spread for copies and merges

\`\`\`javascript
const settings = { ...defaults, ...overrides };
const all = [...listA, ...listB];
\`\`\`

Spread makes a **shallow** copy. Nested objects are still shared.

## Rest parameters

\`\`\`javascript
function log(level, ...messages) {
  console[level](...messages);
}
\`\`\`

Destructuring shines in [array method](/blog/javascript-array-methods) callbacks and when reading [environment variables in Node.js](/blog/environment-variables-nodejs).
`),
    ],
  },

  // ---------- Async JavaScript ----------
  {
    category: 'async-javascript', author: 'sarah',
    slug: 'javascript-event-loop',
    title: 'How the JavaScript Event Loop Works',
    description: 'Call stack, task queue, and microtasks, explained step by step.',
    blocks: [
      text(`
## One thread, many tasks

JavaScript runs on a single thread. The event loop lets it handle timers, network responses, and user input without blocking.

- **Call stack**: the function currently running
- **Task queue**: callbacks from \`setTimeout\`, I/O, and events
- **Microtask queue**: promise callbacks and \`queueMicrotask\`

After each task, the engine drains **all** microtasks before taking the next task.

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1, 4, 3, 2
\`\`\`

Understanding this ordering makes [promises](/blog/javascript-promises-guide) and [async/await](/blog/async-await-javascript) much less mysterious.
`),
      quote('Philip Roberts', 'The event loop has one simple job: to monitor the call stack and the callback queue.'),
    ],
  },
  {
    category: 'async-javascript', author: 'david',
    slug: 'javascript-promises-guide',
    title: 'A Practical Guide to JavaScript Promises',
    description: 'Create, chain, and handle errors in promises the right way.',
    blocks: [
      text(`
## What a promise represents

A promise is a placeholder for a value that arrives later. It is *pending*, then either *fulfilled* or *rejected*.

\`\`\`javascript
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
\`\`\`

## Chaining

Each \`.then\` returns a new promise, so you can chain steps:

\`\`\`javascript
fetch('/api/user')
  .then((res) => res.json())
  .then((user) => console.log(user.name))
  .catch((err) => console.error(err));
\`\`\`

## Common mistakes

- Forgetting to \`return\` inside \`.then\`, which breaks the chain
- Nesting \`.then\` calls instead of chaining them
- Leaving rejections unhandled

Once chains feel natural, move on to [async/await](/blog/async-await-javascript) and the [promise combinators](/blog/promise-all-vs-allsettled).
`),
    ],
  },
  {
    category: 'async-javascript', author: 'sarah',
    slug: 'async-await-javascript',
    title: 'Mastering Async/Await in JavaScript',
    description: 'Write clean asynchronous code with async/await and try/catch.',
    blocks: [
      text(`
## Syntactic sugar over promises

An \`async\` function always returns a promise, and \`await\` pauses it until a promise settles.

\`\`\`javascript
async function getUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}
\`\`\`

## Error handling

Use \`try/catch\` exactly as you would with synchronous code:

\`\`\`javascript
try {
  const user = await getUser(1);
} catch (err) {
  console.error('Could not load user', err);
}
\`\`\`

See [error handling with fetch](/blog/fetch-api-error-handling) for the cases \`fetch\` does not throw on.

## Don't serialize independent work

\`\`\`javascript
// slow: one after another
const a = await getA();
const b = await getB();

// fast: in parallel
const [a2, b2] = await Promise.all([getA(), getB()]);
\`\`\`

Async/await is built on [promises](/blog/javascript-promises-guide), and under the hood it works much like [generators](/blog/javascript-generators-guide).
`),
      quote('Douglas Crockford', 'The best way to predict the future is to invent it.'),
    ],
  },
  {
    category: 'async-javascript', author: 'david',
    slug: 'promise-all-vs-allsettled',
    title: 'Promise.all vs Promise.allSettled vs Promise.race',
    description: 'Pick the right promise combinator for parallel work.',
    blocks: [
      text(`
## Promise.all: all or nothing

Resolves with every value, or rejects as soon as **one** promise rejects.

\`\`\`javascript
const [user, posts] = await Promise.all([getUser(), getPosts()]);
\`\`\`

## Promise.allSettled: every outcome

Never rejects. You get an array of \`{ status, value | reason }\`.

\`\`\`javascript
const results = await Promise.allSettled(urls.map((u) => fetch(u)));
const failed = results.filter((r) => r.status === 'rejected');
\`\`\`

## Promise.race and Promise.any

- \`race\` settles with the first promise to settle, which is handy for timeouts
- \`any\` resolves with the first **fulfilled** promise

\`\`\`javascript
const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms));
await Promise.race([fetch(url), timeout(5000)]);
\`\`\`

New to promises? Start with the [promises guide](/blog/javascript-promises-guide).
`),
    ],
  },
  {
    category: 'async-javascript', author: 'sarah',
    slug: 'fetch-api-error-handling',
    title: 'Error Handling with the Fetch API',
    description: "fetch doesn't reject on 404. Here's how to handle errors properly.",
    blocks: [
      text(`
## fetch only rejects on network failure

A 404 or 500 still **resolves**. You have to check \`response.ok\` yourself.

\`\`\`javascript
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json();
}
\`\`\`

## Timeouts with AbortController

\`\`\`javascript
const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
\`\`\`

## Retry with backoff

\`\`\`javascript
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2 ** i * 500));
    }
  }
}
\`\`\`

This builds on [async/await](/blog/async-await-javascript). On the server, pair it with an [Express API](/blog/build-rest-api-express).
`),
    ],
  },

  // ---------- Node.js ----------
  {
    category: 'nodejs', author: 'david',
    slug: 'getting-started-with-nodejs',
    title: 'Getting Started with Node.js',
    description: 'Install Node.js, run your first script, and use npm.',
    blocks: [
      text(`
## What Node.js is

Node.js runs JavaScript outside the browser on the V8 engine. It is built around the same [event loop](/blog/javascript-event-loop) that browsers use, which makes it well suited to I/O-heavy servers.

## Your first script

\`\`\`javascript
// hello.js
console.log(\`Hello from Node \${process.version}\`);
\`\`\`

\`\`\`bash
node hello.js
\`\`\`

## npm in 30 seconds

\`\`\`bash
npm init -y
npm install express
\`\`\`

\`package.json\` records your dependencies and scripts.

## Where to go next

- Choose a module system: [ES Modules vs CommonJS](/blog/es-modules-vs-commonjs)
- Build something: [a REST API with Express](/blog/build-rest-api-express)
`),
    ],
  },
  {
    category: 'nodejs', author: 'sarah',
    slug: 'es-modules-vs-commonjs',
    title: 'ES Modules vs CommonJS in Node.js',
    description: 'import vs require: differences, interop, and which to pick.',
    blocks: [
      text(`
## Two module systems

\`\`\`javascript
// CommonJS
const fs = require('node:fs');
module.exports = { read };

// ES Modules
import fs from 'node:fs';
export function read() {}
\`\`\`

## Key differences

- ESM is **static**: imports are resolved before code runs, which enables tree-shaking
- ESM supports top-level \`await\`
- CommonJS \`require\` is synchronous and can be called conditionally
- In ESM, \`__dirname\` isn't defined. Use \`import.meta.dirname\` instead

## Enabling ESM

Set \`"type": "module"\` in \`package.json\`, or use the \`.mjs\` extension.

For new projects, prefer ESM. See [getting started with Node.js](/blog/getting-started-with-nodejs) if you're setting up from scratch.
`),
    ],
  },
  {
    category: 'nodejs', author: 'david',
    slug: 'build-rest-api-express',
    title: 'Build a REST API with Express',
    description: 'Routes, JSON bodies, and error handling in a small Express API.',
    blocks: [
      text(`
## A minimal server

\`\`\`javascript
import express from 'express';

const app = express();
app.use(express.json());

const todos = [];

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const todo = { id: todos.length + 1, ...req.body };
  todos.push(todo);
  res.status(201).json(todo);
});

app.listen(3000);
\`\`\`

## Async errors

In Express 5, rejected promises from async handlers go straight to your error middleware:

\`\`\`javascript
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
\`\`\`

Learn more in the [middleware deep dive](/blog/express-middleware-deep-dive), keep secrets in [environment variables](/blog/environment-variables-nodejs), and call the API safely from the client with [fetch](/blog/fetch-api-error-handling).
`),
    ],
  },
  {
    category: 'nodejs', author: 'sarah',
    slug: 'nodejs-streams',
    title: 'Node.js Streams for Processing Large Files',
    description: 'Read, transform, and write huge files without running out of memory.',
    blocks: [
      text(`
## Why streams

\`fs.readFile\` loads the whole file into memory. Streams process it chunk by chunk.

\`\`\`javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('access.log'),
  createGzip(),
  createWriteStream('access.log.gz'),
);
\`\`\`

## Async iteration

Readable streams are async iterables:

\`\`\`javascript
for await (const chunk of createReadStream('big.csv')) {
  process(chunk);
}
\`\`\`

\`pipeline\` handles backpressure and cleanup for you. It returns a promise, so it fits naturally with [async/await](/blog/async-await-javascript).
`),
    ],
  },
  {
    category: 'nodejs', author: 'david',
    slug: 'environment-variables-nodejs',
    title: 'Managing Environment Variables in Node.js',
    description: 'Load, validate, and keep secrets out of your code.',
    blocks: [
      text(`
## Reading variables

\`\`\`javascript
const port = Number(process.env.PORT ?? 3000);
\`\`\`

## Loading a .env file natively

Node.js 20.6+ can load \`.env\` files without a dependency:

\`\`\`bash
node --env-file=.env server.js
\`\`\`

## Validate at startup

Fail fast instead of discovering a missing key in production:

\`\`\`javascript
const required = ['DATABASE_URL', 'API_KEY'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(\`Missing env: \${missing.join(', ')}\`);
\`\`\`

Never commit \`.env\` to git. Add it to \`.gitignore\`. You can pull values out cleanly with [destructuring](/blog/destructuring-and-spread), and this pattern is essential for an [Express API](/blog/build-rest-api-express).
`),
    ],
  },

  // ---------- Browser & DOM ----------
  {
    category: 'browser-dom', author: 'sarah',
    slug: 'dom-manipulation-basics',
    title: 'DOM Manipulation Without a Framework',
    description: 'Select, create, and update elements with plain JavaScript.',
    blocks: [
      text(`
## Selecting elements

\`\`\`javascript
const button = document.querySelector('#save');
const items = document.querySelectorAll('.item');
\`\`\`

## Creating and inserting

\`\`\`javascript
const li = document.createElement('li');
li.textContent = 'New item';
list.append(li);
\`\`\`

Prefer \`textContent\` over \`innerHTML\` for user data. It avoids XSS.

## Classes and attributes

\`\`\`javascript
button.classList.toggle('active');
button.setAttribute('aria-pressed', 'true');
\`\`\`

## Batch your updates

Build nodes in a \`DocumentFragment\` and insert once to avoid repeated reflows.

Next up: handle clicks efficiently with [event delegation](/blog/javascript-event-delegation).
`),
    ],
  },
  {
    category: 'browser-dom', author: 'david',
    slug: 'javascript-event-delegation',
    title: 'Event Delegation in JavaScript',
    description: 'One listener for many elements, including ones added later.',
    blocks: [
      text(`
## The idea

Events bubble up the DOM. Instead of attaching a listener to every child, attach one to the parent and check \`event.target\`.

\`\`\`javascript
document.querySelector('#todo-list').addEventListener('click', (event) => {
  const button = event.target.closest('button.delete');
  if (!button) return;
  button.closest('li').remove();
});
\`\`\`

## Why it's worth it

- One listener instead of hundreds
- Works for elements [added dynamically](/blog/dom-manipulation-basics)
- Less cleanup when items are removed

## Gotchas

Some events like \`focus\` and \`blur\` don't bubble. Use \`focusin\` and \`focusout\` instead. For high-frequency events like \`scroll\`, combine delegation with [throttling](/blog/debounce-and-throttle).
`),
    ],
  },
  {
    category: 'browser-dom', author: 'sarah',
    slug: 'debounce-and-throttle',
    title: 'Debounce and Throttle in JavaScript',
    description: 'Tame scroll, resize, and input events with two small utilities.',
    blocks: [
      text(`
## Debounce: wait until things calm down

\`\`\`javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

search.addEventListener('input', debounce((e) => query(e.target.value), 300));
\`\`\`

## Throttle: at most once per interval

\`\`\`javascript
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}
\`\`\`

Both rely on [closures](/blog/javascript-closures-explained) to keep \`timer\` and \`last\` between calls.

For animation work, [requestAnimationFrame](/blog/requestanimationframe-guide) is often a better fit than throttling. For visibility checks, use [Intersection Observer](/blog/intersection-observer-lazy-loading) instead of scroll listeners.
`),
    ],
  },
  {
    category: 'browser-dom', author: 'david',
    slug: 'localstorage-vs-sessionstorage',
    title: 'localStorage vs sessionStorage',
    description: 'How long data lives, what it is scoped to, and what not to store.',
    blocks: [
      text(`
## Same API, different lifetime

\`\`\`javascript
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('draft', JSON.stringify(form));
\`\`\`

| | localStorage | sessionStorage |
|---|---|---|
| Lifetime | Until cleared | Until the tab closes |
| Scope | Origin | Origin **and** tab |

## Store strings only

Values are always strings, so use \`JSON.stringify\` and \`JSON.parse\`, and wrap them in \`try/catch\`. Private mode or a full quota can throw.

## Don't store secrets

Any script on the page can read storage, so an XSS bug exposes everything. Keep auth tokens in \`HttpOnly\` cookies.

Debounce writes on busy inputs with [debounce](/blog/debounce-and-throttle).
`),
    ],
  },
  {
    category: 'browser-dom', author: 'sarah',
    slug: 'intersection-observer-lazy-loading',
    title: 'Lazy Loading Images with Intersection Observer',
    description: 'Load images only when they scroll into view, with no scroll listeners.',
    blocks: [
      text(`
## Native first

For plain images, the browser can do it for you:

\`\`\`html
<img src="photo.jpg" loading="lazy" alt="…">
\`\`\`

## Intersection Observer for everything else

\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;
    observer.unobserve(img);
  }
}, { rootMargin: '200px' });

document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
\`\`\`

## Why not scroll events?

Scroll handlers run on the main thread many times per second, even when [throttled](/blog/debounce-and-throttle). Intersection Observer runs off the main thread and only calls you when visibility changes.

It pairs well with [DOM manipulation basics](/blog/dom-manipulation-basics) for infinite-scroll lists.
`),
    ],
  },
];

async function run(strapi) {
  const articles = strapi.documents('api::article.article');
  const categories = strapi.documents('api::category.category');

  const existing = await articles.findMany({ fields: ['title'] });
  for (const doc of existing) {
    await articles.delete({ documentId: doc.documentId });
  }
  console.log(`Deleted ${existing.length} article(s).`);

  const categoryIds = {};
  for (const cat of CATEGORIES) {
    const [found] = await categories.findMany({ filters: { slug: cat.slug } });
    const doc = found ?? (await categories.create({ data: cat }));
    categoryIds[cat.slug] = doc.documentId;
  }

  for (const a of ARTICLES) {
    await articles.create({
      data: {
        title: a.title,
        slug: a.slug,
        description: a.description,
        blocks: a.blocks,
        author: AUTHORS[a.author],
        category: categoryIds[a.category],
      },
      status: 'published',
    });
  }
  console.log(`Created and published ${ARTICLES.length} article(s).`);
}

async function main() {
  for (const a of ARTICLES) {
    if (a.description.length > 80) throw new Error(`Description too long: ${a.slug}`);
  }

  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  try {
    await run(app);
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
