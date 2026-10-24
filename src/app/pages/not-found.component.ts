import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, selector: 'app-not-found', imports: [RouterLink],
  template: `<section class="not-found"><div class="not-found-code">404</div><h1>Page not found</h1><p class="muted">The page you're looking for doesn't exist or may have moved.</p><a class="button primary" routerLink="/tasks">Back to tasks</a></section>`
})
export class NotFoundComponent {}