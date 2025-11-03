import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from './message.service';

declare global {
  interface Window {
    reactApp: any;
    webpackChunkreactApp: any;
  }
  const __webpack_share_scopes__: any;
}

@Component({
  selector: 'app-react-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #reactContainer class="wrapper-container"></div>
  `,
  styles: [`
    .wrapper-container {
      width: 100%;
      height: 100%;
      min-height: 400px;
    }
  `]
})
export class ReactWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('reactContainer', { read: ElementRef }) container!: ElementRef;
  @Output() messageReceived = new EventEmitter<string>();
  
  messageFromReact: string = '';

  constructor(private messageService: MessageService) {}

  async ngOnInit() {
    await this.loadRemoteEntry();
  }

  async ngAfterViewInit() {
    await this.loadReactComponent();
  }

  private handleMessageFromReact = (message: string) => {
    console.log('Message received from React:', message);
    this.messageFromReact = message;
    this.messageReceived.emit(message);
    // Dispatch custom event to app component
    window.dispatchEvent(new CustomEvent('reactToHost', { 
      detail: message 
    }));
  };

  private async loadRemoteEntry(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.reactApp) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'http://localhost:3000/remoteEntry.js';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        console.log('Remote entry loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load remote entry', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  private async loadReactComponent(): Promise<void> {
    try {
      // Wait a bit for the remote to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const containerWindow = window as any;
      
      // Try different ways to access the remote
      let container = containerWindow.reactApp;
      
      if (!container) {
        // Check if it's in the webpack container
        const webpackContainer = containerWindow.webpackChunkreactApp;
        if (webpackContainer) {
          console.log('Found webpack container', webpackContainer);
        }
      }
      
      if (container) {
        console.log('Found reactApp container:', container);
        
        // Initialize the container if needed
        if (!container.__initialized && container.init) {
          try {
            await container.init({});
            container.__initialized = true;
          } catch (e) {
            console.log('Container init not needed or failed:', e);
          }
        }
        
        // Get React and ReactDOM from the remote (same version as the component)
        const reactFactory = await container.get('./react');
        const React = reactFactory();
        
        const reactDomClientFactory = await container.get('./react-dom/client');
        const ReactDOMClient = reactDomClientFactory();
        
        // Get the App component
        const factory = await container.get('./App');
        const Module = factory();
        const Component = Module.default || Module;
        
        // Mount React component with props (pass the callback)
        const root = ReactDOMClient.createRoot(this.container.nativeElement);
        root.render(React.createElement(Component, {
          onMessageSend: this.handleMessageFromReact
        }));
      } else {
        console.error('reactApp remote not found on window. Available:', Object.keys(containerWindow));
        this.container.nativeElement.innerHTML = `
          <div style="padding: 20px; color: orange; border: 2px solid orange; border-radius: 8px;">
            <h3>⚠️ React Remote Not Available</h3>
            <p>Make sure your React app is running on http://localhost:3000</p>
            <p>Check the browser console for more details.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading React component:', error);
      this.container.nativeElement.innerHTML = `
        <div style="padding: 20px; color: red; border: 2px solid red; border-radius: 8px;">
          <h3>❌ Error loading React component</h3>
          <pre>${error}</pre>
        </div>
      `;
    }
  }
}
