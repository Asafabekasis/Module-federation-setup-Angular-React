import { Component } from '@angular/core';
import { AngularWrapperComponent } from "../angular-wrapper.component";
import { ReactWrapperComponent } from "../react-wrapper.component";

@Component({
  selector: 'app-home',
  imports: [AngularWrapperComponent, ReactWrapperComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
