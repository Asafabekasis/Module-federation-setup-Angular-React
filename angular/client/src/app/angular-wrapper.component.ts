import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    angularRemote: any;
  }
}

@Component({
  selector: 'app-angular-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #angularContainer class="wrapper-container"></div>
  `,
  styles: [`
    .wrapper-container {
      width: 100%;
      height: 100%;
      min-height: 400px;
    }
  `]
})
export class AngularWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('angularContainer', { read: ElementRef }) container!: ElementRef;

  constructor(private ngZone: NgZone) {}

  async ngOnInit() {
    await this.loadRemoteEntry();
    
    // Listen for messages FROM Angular remote
    window.addEventListener('angularRemoteToHost', this.handleRemoteMessage);
    
    // Listen for messages FROM host TO Angular remote
    window.addEventListener('hostToAngularRemote', this.handleHostMessage);
  }

  async ngAfterViewInit() {
    // Run outside Angular zone to avoid NG0909 error
    await this.ngZone.runOutsideAngular(async () => {
      await this.loadAngularComponent();
    });
  }

  private handleRemoteMessage = (event: any) => {
    if (event.detail) {
      console.log('Message received from Angular Remote:', event.detail);
      // Forward to host via CustomEvent (already done by remote, this is just logging)
    }
  };

  private handleHostMessage = (event: any) => {
    if (event.detail) {
      console.log('Forwarding message from Host to Angular Remote:', event.detail);
      this.sendToRemote(event.detail);
    }
  };

  private sendToRemote(message: string) {
    // Dispatch custom event to Angular remote
    const event = new CustomEvent('hostToAngularRemote', {
      detail: message,
      bubbles: true,
      composed: true
    });
    window.dispatchEvent(event);
    console.log('Message sent to Angular remote:', message);
  }

  private async loadRemoteEntry(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.angularRemote) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'http://localhost:61799/remoteEntry.js';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        console.log('Angular remote entry loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('Failed to load Angular remote entry', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  private async loadAngularComponent(): Promise<void> {
    try {
      // Wait a bit for the remote to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const containerWindow = window as any;
      
      // Access the remote container
      let container = containerWindow.angularRemote;
      
      if (container) {
        console.log('Found angularRemote container:', container);
        
        // Initialize the container if needed
        if (!container.__initialized && container.init) {
          try {
            await container.init({});
            container.__initialized = true;
          } catch (e) {
            console.log('Container init not needed or failed:', e);
          }
        }
        
        // Get the remote bootstrap function
        const factory = await container.get('./RemoteComponent');
        const Module = factory();
        const bootstrapFn = Module.bootstrapRemoteComponent || Module.default || Module;
        
        console.log('Remote bootstrap function loaded:', bootstrapFn);
        
        // Bootstrap the web component (outside Angular zone)
        await bootstrapFn();
        
        // Create and append the custom element
        const remoteElement = document.createElement('app-remote-element');
        remoteElement.style.display = 'block';
        remoteElement.style.width = '100%';
        remoteElement.style.height = '100%';
        this.container.nativeElement.appendChild(remoteElement);
        
        console.log('✅ Angular remote component loaded successfully as Web Component via Module Federation');
        
      } else {
        console.error('angularRemote not found on window. Available:', Object.keys(containerWindow));
        this.container.nativeElement.innerHTML = `
          <div style="padding: 20px; color: orange; border: 2px solid orange; border-radius: 8px;">
            <h3>⚠️ Angular Remote Not Available</h3>
            <p>Make sure your Angular remote is running on http://localhost:61799</p>
            <p>Check the browser console for more details.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading Angular component:', error);
      this.container.nativeElement.innerHTML = `
        <div style="padding: 20px; color: red; border: 2px solid red; border-radius: 8px;">
          <h3>❌ Error loading Angular component</h3>
          <pre>${error}</pre>
        </div>
      `;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('angularRemoteToHost', this.handleRemoteMessage);
    window.removeEventListener('hostToAngularRemote', this.handleHostMessage);
  }
}
