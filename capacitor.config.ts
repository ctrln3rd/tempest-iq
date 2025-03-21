import type { CapacitorConfig } from '@capacitor/cli';

const isExportMode = process.env.EXPORT_MODE || 'ssr';

const config: CapacitorConfig = {
  appId: 'com.ctrln3rd.weatherrush',
  appName: 'weather-rush',
  webDir: isExportMode === 'static' ? 'out': '.next',
  server: isExportMode === 'static'
    ? {} // No server required for static export
    : {
        url: 'https://weatherrush.netlify.app', // Netlify SSR URL
        cleartext: true,
      },
};

export default config;
