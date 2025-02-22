---
title: Prism
description: Code syntax highlighting using Prism
docs: plugins/prism.ts/~/Options
tags:
  - html
---

## Installation

Import this plugin in your `_config.ts` file to use it:

```js
import lume from "lume/mod.ts";
import prism from "lume/plugins/prism.ts";

const site = lume();

site.use(prism());

export default site;
```

See
[all available options in Deno Doc](https://doc.deno.land/https/deno.land/x/lume/plugins/prism.ts/~/Options).

## Description

This plugin uses the [Prism](https://prismjs.com/) library to search and syntax
highlight the code of any `<pre><code>` element.

```js
import lume from "lume/mod.ts";
import prism from "lume/plugins/prism.ts";

const site = lume();

site.use(prism({
  languages: ["md", "js", "css", "rust"], // Load these languages
}));

export default site;
```
