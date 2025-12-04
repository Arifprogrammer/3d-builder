import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Cup } from './pages/cup/cup';
import { Car } from './pages/car/car';
import { SuperCar } from './pages/supercar/supercar';

@Component({
  selector: 'app-root',
  imports: [/* RouterOutlet, */ NgtCanvas],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  scene = SuperCar;
}
