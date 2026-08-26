
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'web-app';

  ngOnInit(): void {
    initFlowbite();
  }
}