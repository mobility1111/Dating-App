import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

}
