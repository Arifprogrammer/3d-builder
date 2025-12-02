import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Cup } from './pages/cup/cup';

@Component({
  selector: 'app-root',
  imports: [/* RouterOutlet, */ NgtCanvas],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  scene = Cup;
}
