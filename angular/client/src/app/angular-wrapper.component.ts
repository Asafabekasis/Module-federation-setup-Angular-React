import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const window: any;

@Component({
  selector: 'app-angular-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #angularContainer class="angular-wrapper-container"></div>
    <div *ngIf="errorMessage" class="error-message">
      <h3>❌ Error Loading Angular Remote</h3>
      <p>{{ errorMessage }}</p>
      <p>Make sure the Angular remote is running on http://localhost:61799</p>
    </div>
  `,
  styles: [`
    .angular-wrapper-container {
      width: 100%;
      height: 100%;
      min-height: 400px;
    }

    .error-message {
      padding: 20px;
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
      color: #c62828;
      border-radius: 8px;
      margin-top: 20px;
      border: 2px solid #ef5350;
    }

    .error-message h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .error-message p {
      margin: 5px 0;
      font-size: 14px;
    }
  `]
})
export class AngularWrapperComponent implements OnInit {
  @ViewChild('angularContainer', { read: ElementRef, static: true }) 
  container!: ElementRef;
  
  errorMessage: string = '';

  async ngOnInit() {
    await this.loadAngularComponent();
  }

  private async loadAngularComponent() {
    try {
      // Simply load the remote app in an iframe for Angular-to-Angular
      // This is a simpler approach that avoids injection issues
      const iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:61799';
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      
      this.container.nativeElement.appendChild(iframe);
      
      console.log('✅ Angular remote loaded in iframe');
    } catch (error: any) {
      console.error('Error loading Angular component:', error);
      this.errorMessage = error.message || 'Unknown error occurred';
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
