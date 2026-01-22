import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v");

  // Call the next middleware/origin
  const response = await context.next();

  // 1. Safety Check: Only process HTML content
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // 2. Performance Check: If no video ID, don't waste time parsing text
  if (!videoId || videoId.length !== 11) {
    return response;
  }

  // 3. Transformation Logic
  try {
    const page = await response.text();
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    // Replace the default og:image
    const updatedPage = page.replace(
      /<meta property="og:image" content="[^"]+" \/>/,
      `<meta property="og:image" content="${thumbnailUrl}" />`
    );

    return new Response(updatedPage, response);
  } catch (error) {
    console.error("Error transforming OG image:", error);
    // If anything fails, return original response
    return response;
  }
};
