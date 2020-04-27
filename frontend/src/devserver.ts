const ParcelProxyServer = require('parcel-proxy-server');

const server = new ParcelProxyServer({
    entryPoint: './index.html',
    parcelOptions: {
        https: true,
        watch: true
    },
    proxies: {
        '/api': {
            target: 'http://127.0.0.1:3000'
        }
    }
});

// server.bundler.on('buildEnd', () => {
//     console.log('Build completed!');
// });

server.listen(8080, () => {
    console.log('Parcel proxy server has started');
});