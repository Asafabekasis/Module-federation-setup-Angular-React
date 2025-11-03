import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { RemoteComponent } from './remote.component';

// Export a function that bootstraps the component as a web component
export async function bootstrapRemoteComponent() {
  // Only bootstrap once
  if (customElements.get('app-remote-element')) {
    console.log('Web component already registered');
    return;
  }

  // Create a standalone Angular application with zoneless enabled
  const app = await createApplication({
    providers: []
  });

  // Create custom element
  const RemoteElement = createCustomElement(RemoteComponent, { 
    injector: app.injector 
  });

  // Define custom element
  customElements.define('app-remote-element', RemoteElement);
  
  console.log('✅ Angular remote web component registered successfully');
}
