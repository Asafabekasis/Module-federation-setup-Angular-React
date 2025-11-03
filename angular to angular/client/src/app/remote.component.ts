import { Component, OnInit } from '@angular/core';
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
      
      <div class="counter-section">
        <button (click)="counter = counter + 1" class="counter-button">
          🔢 Click Counter: {{ counter }}
        </button>
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
      max-width: 100%;
      height: 100%;
      box-sizing: border-box;
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
      flex-wrap: wrap;
    }

    .angular-input {
      flex: 1;
      min-width: 250px;
      padding: 12px 16px;
      font-size: 15px;
      border-radius: 6px;
      border: 2px solid #9c27b0;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .angular-input:focus {
      outline: none;
      border-color: #6a1b9a;
      box-shadow: 0 0 0 3px rgba(156, 39, 176, 0.2);
    }

    .angular-button {
      padding: 12px 28px;
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
    }

    .angular-button:hover {
      background: linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .angular-button:active {
      transform: translateY(0);
    }

    .counter-section {
      display: flex;
      justify-content: center;
    }

    .counter-button {
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .counter-button:hover {
      background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%);
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
        padding: 20px;
      }

      .input-group {
        flex-direction: column;
      }

      .angular-input {
        min-width: 100%;
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

  ngOnInit() {
    // Listen for messages from the parent (Angular host)
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin === 'http://localhost:4200' && event.data) {
        this.messageFromHost = event.data;
        console.log('✅ Angular Remote received from Host:', event.data);
      }
    });
  }

  sendToHost() {
    if (this.inputValue.trim()) {
      // Send message to parent window (Angular host)
      if (window.parent) {
        window.parent.postMessage(this.inputValue, 'http://localhost:4200');
        console.log('✅ Message sent to Angular host:', this.inputValue);
      }
      this.inputValue = '';
    }
  }
}
