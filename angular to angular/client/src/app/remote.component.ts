import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remote',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="angular-remote-container">
      <div class="remote-header">
        <h2>🎉 Angular Remote Component</h2>
        <p class="remote-subtitle">Loaded via Module Federation from port 61799</p>
      </div>

      <div class="remote-info">
        <div class="info-item">
          <strong>Running on:</strong> Port 61799
        </div>
        <div class="info-item">
          <strong>Loaded by:</strong> Angular Host on Port 4200
        </div>
        <div class="info-item">
          <strong>Technology:</strong> Webpack Module Federation
        </div>
      </div>
      
      @if (messageFromHost) {
        <div class="message-from-host">
          <h3>📥 Message from Host:</h3>
          <p class="message-text">{{ messageFromHost }}</p>
        </div>
      }
      
      <div class="input-section">
        <label class="input-label">📤 Send Message to Angular Host</label>
        <div class="input-group">
          <input 
            [(ngModel)]="inputValue" 
            placeholder="Type message for Angular Host..."
            class="angular-input"
            (keyup.enter)="sendToHost()"
          />
          <button
            (click)="sendToHost()"
            class="angular-button">
            Send to Host
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .angular-remote-container {
      padding: 30px;
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border-radius: 12px;
      border: 3px solid #9c27b0;
      box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .remote-header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(156, 39, 176, 0.3);
    }

    .remote-header h2 {
      margin: 0 0 10px 0;
      font-size: 28px;
      color: #6a1b9a;
      font-weight: 700;
    }

    .remote-subtitle {
      margin: 0;
      color: #4a148c;
      font-size: 14px;
      font-weight: 500;
    }

    .remote-info {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #9c27b0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .info-item {
      padding: 8px 0;
      color: #333;
      font-size: 15px;
      line-height: 1.6;
      word-wrap: break-word;
    }

    .info-item strong {
      color: #6a1b9a;
      font-weight: 600;
    }

    .message-from-host {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 2px solid #4caf50;
      animation: slideIn 0.3s ease-out;
      word-wrap: break-word;
    }

    .message-from-host h3 {
      margin: 0 0 12px 0;
      color: #2e7d32;
      font-size: 18px;
      font-weight: 600;
    }

    .message-text {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1b5e20;
      word-break: break-word;
    }

    .input-section {
      background: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .input-label {
      display: block;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6a1b9a;
    }

    .input-group {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }

    .angular-input {
      flex: 1;
      max-width: calc(100% - 150px);
      padding: 12px 16px;
      font-size: 15px;
      border-radius: 6px;
      border: 2px solid #9c27b0;
      font-family: inherit;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .angular-input:focus {
      outline: none;
      border-color: #6a1b9a;
      box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.2);
    }

    .angular-button {
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      flex-shrink: 0;
    }

    .angular-button:hover {
      background: linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .angular-button:active {
      transform: translateY(0);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 600px) {
      .angular-remote-container {
        padding: 15px;
      }

      .input-group {
        flex-direction: column;
      }

      .angular-input {
        max-width: 100%;
      }

      .angular-button {
        width: 100%;
      }
    }
  `]
})
export class RemoteComponent implements OnInit {
  counter = 0;
  inputValue = '';
  messageFromHost = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Listen for custom events from the host (since we're now a web component, not iframe)
    window.addEventListener('hostToAngularRemote', (event: any) => {
      if (event.detail) {
        // Run inside Angular zone to trigger change detection
        this.ngZone.run(() => {
          this.messageFromHost = event.detail;
          console.log('✅ Angular Remote received from Host:', event.detail);
        });
      }
    });
  }

  sendToHost() {
    if (this.inputValue.trim()) {
      const messageToSend = this.inputValue;
      
      // Clear input FIRST before dispatching
      this.inputValue = '';
      
      // Dispatch custom event to host (web component approach)
      const event = new CustomEvent('angularRemoteToHost', {
        detail: messageToSend,
        bubbles: true,
        composed: true // Allow event to cross shadow DOM boundary
      });
      window.dispatchEvent(event);
      console.log('✅ Message sent to Angular host:', messageToSend);
    }
  }
}
