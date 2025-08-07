import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {SidebarLeft} from './components/sidebar-left/sidebar-left';
import {SidebarRight} from './components/sidebar-right/sidebar-right';
import {Canvas} from './components/canvas/canvas';
import {Toolbar} from './components/toolbar/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, SidebarLeft, SidebarRight, Canvas, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('public_canvas');
}

