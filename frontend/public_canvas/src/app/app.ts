import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {Sidebar} from './components/sidebar/sidebar';
import {Canvas} from './components/canvas/canvas';
import {Toolbar} from './components/toolbar/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Canvas, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('public_canvas');
}

