import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    proxy: {
      '/api-semob': {
        target: 'http://dadoshlog.semob.gdfnet.df:8080/pcp',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-semob/, '')
      }
    },
    allowedHosts: [
      'ponto-certo-teste.onrender.com', // Adiciona o seu domínio do Render
      '.onrender.com'                   // Ou libera qualquer subdomínio do Render (mais prático)
    ],
    port: Number(process.env.PORT) || 10000, // Garante que o Vite use a porta do Render
    host: '0.0.0.0'                         // Necessário para o Render enxergar o app
  },
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        // 1. Adicione o limite aqui (ex: 6MB) para o build não quebrar
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,

       // 2. Mantenha seu runtimeCaching logo abaixo
        runtimeCaching: [
          // Estratégia de Cache para os Tiles do OpenStreetMap
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: {
                maxEntries: 1000, // Guarda até 1000 pedaços do mapa
                maxAgeSeconds: 60 * 60 * 24 * 365 // Guarda por 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Estratégia para outras imagens (se houver fotos das paradas no futuro)
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
    }
  },
  optimizeDeps : {
    include: ['react-safe-area-component'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    proxy: {
      '/api-semob': {
        target: 'http://dadoshlog.semob.gdfnet.df:8080/pcp',

        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-semob/, '')
      }
    }
  }
});
