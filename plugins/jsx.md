---
title: JSX
description: Create pages and layouts with JSX (React).
docs: plugins/jsx.ts/~/Options
tags:
  - template_engine
---

## Installation

Import this plugin in your `_config.ts` file to use it:

```js
import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";

const site = lume();

site.use(jsx());

export default site;
```

See
[all available options in Deno Doc](https://doc.deno.land/https/deno.land/x/lume/plugins/jsx.ts/~/Options).

### Configuration

You might want to add the following fields to `deno.json` and `import_map.json`
in order to tell Deno that Lume exposes React in global scope:

<lume-code>

```json {title="deno.json"}
{
  "importMap": "import_map.json",
  "tasks": {
    "lume": "deno eval \"import 'lume/task.ts'\" --",
    "build": "deno task lume",
    "serve": "deno task lume -s"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

```json {title="import_map.json"}
{
  "imports": {
    "lume/": "https://deno.land/x/lume@v1.11.4/",
    "react/jsx-runtime": "https://deno.land/x/lume@v1.11.4/deps/react_runtime.ts"
  }
}
```

</lume-code>

[Go to Using TypeScript](/docs/configuration/using-typescript/) for more info
about using TypeScript with Lume. {.tip}

## Description

[JSX](https://facebook.github.io/jsx/) (or the equivalent TSX for TypeScript) is
a template language to create and render HTML code, very popular in some
frameworks, like React. This plugin adds support for using `JSX / TSX` to create
pages and layouts and using `React` for rendering.

## Creating pages

To create a page with this format, just add a file with `.jsx` or `.tsx`
extension to your site. This format works exactly the same as
[JavaScript/TypeScript files](./modules.md), but with the addition of the
ability to export JSX code in the default export:

```jsx
export const title = "Welcome to my page";
export const layout = "layouts/main.njk";

export default (data) => (
  <>
    <h1>{data.title}</h1>
    <p>This is my first post using lume. I hope you like it!</p>
  </>
);
```

Note that this page uses the `layouts/main.njk` layout to wrap the content (you
can mix different template languages like Nunjucks and JSX)

## Creating layouts

To create layouts in JSX, just add `.jsx` or `.tsx` files to the `_includes`
directory. Note that we need to use the variable `children` to render the page
content instead of `content`. The difference is that `content` is a string and
cannot be easily used in JSX because it's escaped, and `children` is the JSX
object un-rendered.

```jsx
export default ({ title, children }) => (
  <html>
    <head>
      <title>{title}</title>
    </head>
    <body>
      {children}
    </body>
  </html>
);
```

Lume will automatically add the missing `<!DOCTYPE html>` to the generated
`.html` pages. {.tip}
