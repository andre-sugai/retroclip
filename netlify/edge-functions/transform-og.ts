import { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v");

  // Get the response from the origin
  const response = await context.next();
  const page = await response.text();

  // If there is a video ID that looks like a YouTube ID (11 chars), inject the OG image
  // We check for length 11 to differentiate from internal numeric IDs (though some old IDs might be short, 
  // currently we are standardizing on using embed_id for shares which is 11 chars)
  if (videoId && videoId.length === 11) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    // Replace the default og:image
    // We look for the existing og:image tag and replace it content
    const updatedPage = page.replace(
      /<meta property="og:image" content="[^"]+" \/>/,
      `<meta property="og:image" content="${thumbnailUrl}" />`
    );

    return new Response(updatedPage, response);
  }

  return response;
};
