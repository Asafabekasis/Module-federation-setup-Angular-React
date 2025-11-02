# Module Federation Setup Guide

## What's Been Set Up (Angular - Host)

✅ **Hello World** added to Angular app
✅ **Native Federation** installed and configured
✅ **Federation manifest** created to point to React remote
✅ **React wrapper component** created to load React modules

## Next Steps: Setting Up Your React Project (Remote)

Your React project needs to be configured as a Module Federation **remote**. Here's what you need to do:

### 1. Install Module Federation for React

In your React project, install:
```bash
npm install @module-federation/enhanced webpack webpack-cli webpack-dev-server html-webpack-plugin
```

### 2. Create webpack.config.js in React project

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  output: {
    publicPath: 'http://localhost:3000/',
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'react_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Component': './src/App', // Expose your main component
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

### 3. Update React package.json scripts

```json
{
  "scripts": {
    "start": "webpack serve --open",
    "build": "webpack"
  }
}
```

### 4. Create a wrapper for your React component

In your React app, create a file that can be consumed by Angular:

```javascript
// src/App.js or your main component
import React from 'react';

const App = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#61dafb', borderRadius: '8px' }}>
      <h1>Hello from React! 🚀</h1>
      <p>This component is loaded via Module Federation from the React remote app!</p>
    </div>
  );
};

export default App;
```

### 5. Run both applications

Terminal 1 (React - Remote):
```bash
cd <your-react-project>
npm start  # Should run on http://localhost:3000
```

Terminal 2 (Angular - Host):
```bash
cd "c:\\Users\\asaf\\Desktop\\modul federation\\client"
npm start  # Should run on http://localhost:4200
```

## Configuration Details

### Angular (Host) Configuration:
- **Port**: 4200
- **Federation manifest**: `src/assets/federation.manifest.json`
- **Remote entry point**: http://localhost:3000/remoteEntry.js

### React (Remote) Configuration:
- **Port**: 3000 (must match the manifest)
- **Remote name**: react-remote
- **Exposed module**: `./Component`

## Troubleshooting

1. **CORS Issues**: Make sure React dev server has CORS headers enabled
2. **Port conflicts**: Ensure React runs on port 3000 and Angular on 4200
3. **Module not found**: Check that the exposed module path in React matches what Angular is trying to load

## Current Angular Files Modified:
- ✅ `app.component.html` - Added Hello World and React wrapper
- ✅ `app.component.ts` - Imported React wrapper component
- ✅ `react-wrapper.component.ts` - Component to load React remote
- ✅ `federation.manifest.json` - Points to React remote entry
- ✅ `federation.config.js` - Native Federation configuration

Do you have a React project ready? I can help you set that up next! 🚀
