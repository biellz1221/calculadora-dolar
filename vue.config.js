module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
    ? 'https://gabrielbaptista.tk/dolar/'
    : '/',
    pwa: {
        name: 'Calculadora de Dólar',
        themeColor: "#A7CBB1",
        msTileColor: "#A7CBB1",
        iconPaths: 
        {
            favicon32: 'img/icons/icon-32x32.png',
            favicon16: 'img/icons/icon-16x16.png',
            appleTouchIcon: 'img/icons/icon-152x152.png',
            maskIcon: 'img/icons/safari-pinned-tab.svg',
            msTileImage: 'img/icons/icon-144x144.png'
        },
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [/*{
                urlPattern: new RegExp('\.(?:png|gif|jpg|svg)$'),
                handler: 'networkFirst',
                options: {
                    networkTimeoutSeconds: 20,
                    cacheName: 'cache-de-imagens',
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },{
                urlPattern: new RegExp('\.(?:js|css)$'),
                handler: 'networkFirst',
                options: {
                    networkTimeoutSeconds: 20,
                    cacheName: 'cache-de-css-js',
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },{
                urlPattern: new RegExp("^https://fonts.googleapis.com/(.*)$"),
                handler: 'cacheFirst',
                options: {
                    cacheName: 'google-fonts',
                    cacheableResponse: {
                        statuses: [0, 200]
                    },
                }
            }*/]
        }
    },
}