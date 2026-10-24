import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', standalone: true, imports: [RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" routerLink="/tasks" aria-label="Taskflow home">
          <span class="brand-mark">✓</span><span>taskflow</span>
        </a>
        <nav aria-label="Main navigation">
          <a routerLink="/tasks" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Tasks</a>
          <span class="avatar" aria-label="Profile">JD</span>
        </nav>
      </header>
      <main class="main-content"><router-outlet /></main>
      <footer class="footer">Made for focused work <span>·</span> Taskflow</footer>
    </div>`
})
export class AppComponent { }