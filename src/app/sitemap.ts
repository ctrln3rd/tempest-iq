import { MetadataRoute } from "next";

// Simulated function to fetch dynamic locations (Replace this with your actual data source)
async function getWeatherLocations() {
  return ["new-york", "london", "tokyo", 'nairobi', ]; // Example locations
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://weatherrush.netlify.app"; // Update when using a custom domain

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/settings`, lastModified: new Date().toISOString() },
  ];

  // Dynamic weather pages
  const locations = await getWeatherLocations();
  const weatherPages = locations.map((location) => ({
    url: `${baseUrl}/weather/${location}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticPages, ...weatherPages];
}
