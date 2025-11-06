import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="container-fluid">
      <nav class="navbar navbar-dark bg-primary">
        <span class="navbar-brand mb-0 h1">📚 eLibrary</span>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'eLibrary';
}