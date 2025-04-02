import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest{
    return {
        short_name: "tempetiq",
        name: "Tempet IQ",
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48 32x32 16x16",
            type: "image/x-icon"
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#1e2939",
        background_color: "#1e2939"
    }

}

