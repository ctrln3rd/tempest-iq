import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest{
    return {
        short_name: "tempIQ",
        name: "TempestIQ - Smart Forecast",
        description: "Accurate forecast insights and summeries powererd by intelligence",
        icons: [
          {
            src: "/logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable"
          },
          {
            src: "/logo192.png",
            type: "image/png",
            sizes: "192x192"
          } 
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#1e2939",
        background_color: "#1e2939"
    }

}

