import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import inline from "lume/plugins/inline.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import esbuild from "lume/plugins/esbuild.ts";
import imagick from "lume/plugins/imagick.ts";
import cacheBusting from "lume/middlewares/cache_busting.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.1.0/toc/mod.ts";
import sitemap from "https://raw.githubusercontent.com/lumeland/experimental-plugins/main/sitemap/sitemap.ts";

const markdown = {
  plugins: [toc],
  keepDefaultPlugins: true,
};

const site = lume(
  {
    location: new URL("https://lume.land"),
    server: {
      page404: "/404/",
      middlewares: [cacheBusting()],
    },
  },
  { markdown },
);

site
  .ignore("CONTRIBUTING.md")
  .ignore("README.md")
  .ignore("velociraptor.json")
  .ignore("scripts")
  .copy("static", ".")
  .data("cache_busting", `v${Date.now()}`)
  .use(codeHighlight())
  .use(postcss())
  .use(inline())
  .use(esbuild({
    extensions: [".js"],
  }))
  .use(resolveUrls())
  .use(imagick())
  .use(sitemap())
  .scopedUpdates(
    (path) => path.endsWith(".png") || path.endsWith(".jpg"),
  )
  .filter("slice", (arr, length) => arr.slice(0, length))
  .process([".html"], (page) => {
    const doc = page.document!;
    const blocks = doc.querySelectorAll("lume-code");

    blocks.forEach((block, i) => {
      const pres = (block as unknown as HTMLElement).querySelectorAll(
        ":scope > pre",
      );

      const menu = doc.createElement("ul");
      menu.setAttribute("role", "tablist");
      menu.setAttribute("aria-label", "Code Tabs");
      menu.classList.add("lume-code-menu");

      pres.forEach((pre, j) => {
        const title = pre.querySelector("code")!.getAttribute("title")!;

        const li = doc.createElement("li");
        li.setAttribute("role", "presentation");

        const button = doc.createElement("button");
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", j === 0 ? true : false);
        button.setAttribute("aria-controls", `panel-${i + 1}-${j + 1}`);
        button.setAttribute("id", `tab-${i + 1}-${j + 1}`);
        button.setAttribute("tabindex", j === 0 ? 0 : -1);
        button.innerText = title;
        button.classList.add("lume-code-tab");

        if (j > 0) {
          pre.setAttribute("hidden", "true");
        } else {
          button.classList.add("is-active");
        }

        pre.setAttribute("role", "tabpanel");
        pre.setAttribute("aria-labelledby", `tab-${i + 1}-${j + 1}`);
        pre.setAttribute("id", `panel-${i + 1}-${j + 1}`);
        pre.setAttribute("tabindex", "0");

        li.append(button);
        menu.appendChild(li);
      });

      (block as unknown as HTMLElement).prepend(menu as unknown as Node);
    });
  });

export default site;
