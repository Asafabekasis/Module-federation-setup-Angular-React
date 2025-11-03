const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  output: {
    uniqueName: "angularRemote",
    publicPath: "auto",
    scriptType: 'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angularRemote",
      filename: "remoteEntry.js",
      library: { type: "var", name: "angularRemote" },
      exposes: {
        './RemoteComponent': path.resolve(__dirname, './src/app/remote-bootstrap.ts'),
      },
      shared: {
        "@angular/core": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
        "@angular/common": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
        "@angular/common/http": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
        "@angular/router": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
        "@angular/platform-browser": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
        "@angular/platform-browser-dynamic": { 
          singleton: true, 
          strictVersion: false,
          eager: false
        },
      }
    })
  ],
  devServer: {
    port: 61799,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        const origin = req.headers.origin;
        const referer = req.headers.referer;
        const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000','http://localhost:61799'];
        
        // Set CORS header dynamically based on request origin
        if (origin && allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
        } else if (!origin && !referer) {
          // Allow direct browser access (no origin header)
          res.setHeader('Access-Control-Allow-Origin', '*');
        } else if (origin && !allowedOrigins.includes(origin)) {
          // Block requests from origins other than allowed origins
          console.log(`❌ Blocked request from origin: ${origin}`);
          return res.status(403).send('Access forbidden: Origin not allowed');
        }
        
        if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
          console.log(`❌ Blocked request from referer: ${referer}`);
          return res.status(403).send('Access forbidden: Referer not allowed');
        }
        
        next();
      });
      
      return middlewares;
    },
  }
};
