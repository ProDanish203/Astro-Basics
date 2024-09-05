import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get("q");
  if (!query) {
    return new Response(JSON.stringify({ error: "Missing query parameter" }), {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
      status: 400,
    });
  }

  const allBlogs: CollectionEntry<"blog">[] = await getCollection("blog");

  const searchResults = allBlogs.filter((blog) => {
    const titleMatch: boolean = blog.data.title
      .toLowerCase()
      .includes(query!.toLowerCase());

    const bodyMatch: boolean = blog.body
      .toLowerCase()
      .includes(query!.toLowerCase());

    const slugMatch: boolean = blog.slug
      .toLowerCase()
      .includes(query!.toLowerCase());

    return titleMatch || bodyMatch || slugMatch;
  });

  return new Response(JSON.stringify(searchResults), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    status: 200,
  });
};
