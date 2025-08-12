import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, ElementRef, inject, AfterViewInit, ChangeDetectorRef, DOCUMENT} from '@angular/core';
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
  canvasWidth = 1000;
  canvasHeight = 500;
  screenHeight = 0;

  @ViewChild('pixelCanvas') private canvasElement!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private http = inject(HttpClient);
  private document = inject(DOCUMENT);
  private cdr = inject(ChangeDetectorRef);
  private isDrawing = false;
  private ctx!: CanvasRenderingContext2D;
  private offsetMultiplier = 0.1;

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

    this.resizeCanvas();

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
        const x = Math.floor(event.offsetX * this.offsetMultiplier);
        const y = Math.floor(event.offsetY * this.offsetMultiplier);
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

    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  private drawPixel(pixel: Pixel) {
    this.ctx.fillStyle = pixel.colour;
    this.ctx.fillRect(pixel.x, pixel.y, 1, 1);

  }

  private resizeCanvas() {
    if (this.document.defaultView && this.document.defaultView.innerHeight !== null) {
      this.screenHeight = this.document.defaultView.innerHeight;
    }

    switch (true) {
      case this.screenHeight <= 500:
        this.canvasWidth = 600;
        this.canvasHeight = 300;
        this.offsetMultiplier = 1.666;
        break;
      case this.screenHeight <= 750:
        this.canvasWidth = 900;
        this.canvasHeight = 450;
        this.offsetMultiplier = 1.111;
        break;
      case this.screenHeight <= 1000:
        this.canvasWidth = 1200;
        this.canvasHeight = 600;
        this.offsetMultiplier = 0.833;
        break;
      case this.screenHeight <= 1500:
        this.canvasWidth = 1800;
        this.canvasHeight = 900;
        this.offsetMultiplier = 0.555;
        break;
      case this.screenHeight <= 2000:
        this.canvasWidth = 2400;
        this.canvasHeight = 1200;
        this.offsetMultiplier = 0.416;
        break;
      default:
        this.canvasWidth = 3000;
        this.canvasHeight = 1500;
        this.offsetMultiplier = 0.333;
        break;
    }
  }
}
