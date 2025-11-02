# Angular Native Federation Integration Guide

## React App Configuration ✅
Your React app is correctly configured and running on http://localhost:3001

**Exposed Module:**
- Name: `reactApp`
- Entry: `http://localhost:3001/remoteEntry.js`
- Exposes: `./App` (the React component)

---

## Angular Configuration - UPDATED FOR REACT VERSION CONFLICTS

### Step 1: Install React in your Angular project

**IMPORTANT**: To avoid React version conflicts, install React in your Angular project:

```bash
npm install react@18.2.0 react-dom@18.2.0
```

### Step 2: Configure Module Federation

In your Angular `federation.manifest.json`:

```json
{
  "reactApp": "http://localhost:3001/remoteEntry.js"
}
```

### Step 3: Create Angular Component to Host React

**Create `src/app/react-container.component.ts`:**

```typescript
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

@Component({
  selector: 'app-react-container',
  template: '<div #reactContainer></div>',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReactContainerComponent implements OnInit, OnDestroy {
  @ViewChild('reactContainer', { static: true }) container!: ElementRef;
  private reactRoot: any;

  async ngOnInit() {
    try {
      // Import the React module from the remote
      const module = await import('reactApp/App');
      
      // Create a unique container ID
      const containerId = 'react-app-' + Math.random().toString(36).substr(2, 9);
      this.container.nativeElement.id = containerId;
      
      // Mount using Angular's React instance to avoid version conflicts
      if (module.mount) {
        this.reactRoot = module.mount(containerId, React, ReactDOM);
      } else if (module.App) {
        // Fallback: render the App component directly
        this.reactRoot = ReactDOM.createRoot(this.container.nativeElement);
        this.reactRoot.render(React.createElement(module.App));
      }
    } catch (error) {
      console.error('Failed to load React remote:', error);
    }
  }

  ngOnDestroy() {
    // Unmount React app when Angular component is destroyed
    if (this.reactRoot) {
      if (this.reactRoot.unmount) {
        this.reactRoot.unmount();
      }
    }
  }
}
```

### Step 4: Add TypeScript Declaration

**Create or update `src/decl.d.ts`:**

```typescript
declare module 'reactApp/App' {
  export const App: any;
  export const mount: (containerId: string, react?: any, reactDOM?: any) => any;
  export const unmount: (root: any) => void;
}

declare module 'reactApp/react' {
  const React: any;
  export default React;
}

declare module 'reactApp/react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}
```

### Step 5: Use the Component

In your Angular template or route:

```typescript
import { ReactContainerComponent } from './react-container.component';

// In your component or route config
@Component({
  selector: 'app-home',
  template: '<app-react-container></app-react-container>',
  standalone: true,
  imports: [ReactContainerComponent]
})
export class HomeComponent {}
```

---

## Alternative: Load Dynamically without Module Federation Manifest

```typescript
import { loadRemoteModule } from '@angular-architects/native-federation';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

async ngOnInit() {
  const module = await loadRemoteModule({
    remoteEntry: 'http://localhost:3001/remoteEntry.js',
    remoteName: 'reactApp',
    exposedModule: './App'
  });
  
  const containerId = 'react-app-' + Math.random().toString(36).substr(2, 9);
  this.container.nativeElement.id = containerId;
  
  // Use Angular's React to avoid conflicts
  if (module.mount) {
    this.reactRoot = module.mount(containerId, React, ReactDOM);
  }
}
```

---

## Troubleshooting

### Error: "Multiple copies of React"
✅ **SOLVED**: Install React in your Angular project and pass it to the mount function

### Error: "unknown remote reactApp"
- Verify React app is running: http://localhost:3001
- Check remoteEntry.js exists: http://localhost:3001/remoteEntry.js
- Ensure federation.manifest.json uses correct name: `reactApp`

### Error: "Cannot find module 'reactApp/App'"
- Add TypeScript declarations in `src/decl.d.ts`
- Restart Angular dev server after adding declarations

---

## Testing

1. **React standalone**: http://localhost:3001 (should show "Hello World!")
2. **Check remote entry**: http://localhost:3001/remoteEntry.js (should download JS file)
3. **Run Angular app**: Should load and display React component without errors

The React "Hello World!" component should appear seamlessly in your Angular app! 🎉

