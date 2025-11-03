import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';
  messageFromReact = '';
  messageFromAngularRemote = '';
  
  // Input values to send to remotes
  messageToReact = '';
  messageToAngularRemote = '';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Listen for messages from React via custom event
    window.addEventListener('reactToHost', (event: any) => {
      if (event.detail) {
        this.messageFromReact = event.detail;
        console.log('✅ Message received from React:', event.detail);
      }
    });

    // Listen for messages from Angular remote via custom event
    window.addEventListener('angularRemoteToHost', (event: any) => {
      if (event.detail) {
        this.messageFromAngularRemote = event.detail;
        console.log('✅ Message received from Angular remote:', event.detail);
      }
    });
  }

  sendToReact() {
    if (this.messageToReact.trim()) {
      // Dispatch custom event that React wrapper can listen to
      window.dispatchEvent(new CustomEvent('hostToReact', { 
        detail: this.messageToReact 
      }));
      console.log('📤 Sent to React:', this.messageToReact);
      this.messageToReact = '';
    }
  }

  sendToAngularRemote() {
    if (this.messageToAngularRemote.trim()) {
      // Dispatch custom event that Angular wrapper can listen to
      window.dispatchEvent(new CustomEvent('hostToAngularRemote', { 
        detail: this.messageToAngularRemote 
      }));
      console.log('📤 Sent to Angular Remote:', this.messageToAngularRemote);
      this.messageToAngularRemote = '';
    }
  }
}
