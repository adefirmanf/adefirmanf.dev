import { Resvg } from "@resvg/resvg-js";
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import { SITE_TITLE, SITE_URL } from "../../consts";
import { formatDate } from "../../lib/utils";

// Builds a 1200x630 title card for each post (like X / LinkedIn link
// previews), plus /og/index.png as the default for every other page.

const fontDir = join(
  process.cwd(),
  "node_modules/@fontsource/geist-sans/files",
);
const fonts = Promise.all(
  [400, 600].map(async (weight) => ({
    name: "Geist",
    weight: weight as 400 | 600,
    style: "normal" as const,
    data: await readFile(join(fontDir, `geist-sans-latin-${weight}-normal.woff`)),
  })),
);

type Props = { title: string; subtitle?: string };

export const getStaticPaths = (async () => {
  const posts = await getCollection("posts", ({ data }) => !data.archived);
  return [
    { params: { slug: "index" }, props: { title: SITE_TITLE } },
    ...posts.map((post) => ({
      params: { slug: post.slug },
      props: { title: post.data.title, subtitle: formatDate(post.data.date) },
    })),
  ];
}) satisfies GetStaticPaths;

const h = (type: string, style: object, children?: unknown) => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as Props;
  const host = new URL(SITE_URL).host;

  const card = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: "#18181b",
      color: "#f4f4f5",
      fontFamily: "Geist",
    },
    [
      h("div", { fontSize: 28, color: "#a1a1aa" }, subtitle ?? ""),
      h(
        "div",
        { fontSize: title.length > 40 ? 64 : 80, fontWeight: 600, lineHeight: 1.1 },
        title,
      ),
      h(
        "div",
        { display: "flex", alignItems: "center", fontSize: 28, color: "#a1a1aa" },
        [
          h("div", {
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#f4f4f5",
            marginRight: 16,
          }),
          host,
        ],
      ),
    ],
  );

  const svg = await satori(card as any, {
    width: 1200,
    height: 630,
    fonts: await fonts,
  });
  const png = new Resvg(svg).render().asPng();

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
