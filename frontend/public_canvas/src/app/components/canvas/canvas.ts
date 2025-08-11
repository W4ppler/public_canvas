import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, ElementRef, inject, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Pixel} from './pixel';
import {firstValueFrom} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas implements AfterViewInit {
  isLoaded = false;

  @ViewChild('pixelCanvas') private canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private isDrawing = false;
  private ctx!: CanvasRenderingContext2D;

  // websockets
  private wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  private wsUrl = `${this.wsProtocol}://${window.location.host}/ws/canvas/`;
  private socket$ = webSocket(this.wsUrl);


  async ngAfterViewInit() {
    const initialData = await firstValueFrom(this.http.get('/api/canvas/', {headers: {'Accept': 'application/json'}})) as Pixel[];

    this.isLoaded = true;
    this.cdr.detectChanges();
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;

    for (const pixel of initialData) {
      this.drawPixel(pixel);
    }
    this.socket$.subscribe({
      next: (message) => {
        this.drawPixel(message as Pixel);
      },
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });


    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDrawing = true;
    });


    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDrawing) {
        const x = Math.floor(event.offsetX*0.1);
        const y = Math.floor(event.offsetY*0.1);
        let colour = '#ff0000';

        this.drawPixel(new Pixel(x, y, colour));

        this.socket$.next({
          type: 'draw',
          x: x,
          y: y,
          colour: colour,
        })
      }
    });


    this.canvas.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });
  }

  private drawPixel(pixel: Pixel) {
    this.ctx.fillStyle = pixel.colour;
    this.ctx.fillRect(pixel.x, pixel.y, 1, 1);

  }
}
