const ParcelProxyServer = require('parcel-proxy-server');

const server = new ParcelProxyServer({
    entryPoint: './index.html',
    parcelOptions: {
        https: true,
        watch: true
    },
    proxies: {
        '/api': {
            target: 'http://localhost:3000'
        }
    }
});

let port = 1234;

server.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});