import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, ElementRef, inject, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Pixel} from './pixel';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
})
export class Canvas implements AfterViewInit {
  @ViewChild('pixelCanvas') private canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private http = inject(HttpClient);
  private canvasData: Pixel[] = [];
  private cdr = inject(ChangeDetectorRef);
  isLoaded = false;
  isDrawing = false;


  async ngAfterViewInit() {
    const data = await firstValueFrom(this.http.get('/api/canvas', {headers: {'Accept': 'application/json'}}))
    this.canvasData = data as Pixel[];

    console.log('Canvas initialized with data:', this.canvasData);
    this.isLoaded = true;
    this.cdr.detectChanges();

    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.drawPixelsInitially();

    canvas.addEventListener('click', (event: MouseEvent) => {
      this.isDrawing = true;
    });

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if(this.isDrawing) {
        const x = Math.floor(event.offsetX);
        const y = Math.floor(event.offsetY);
        let colour = '#ff0000';

        const pixel = this.canvasData.find(p => p.x === x && p.y === y);
        if (pixel) {
          pixel.colour = colour;
          this.ctx.fillStyle = colour;
          this.ctx.fillRect(x, y, 5, 5);
        }
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });
  }

  private drawPixelsInitially() {
    this.canvasData.forEach(pixel => {
      this.ctx.fillStyle = pixel.colour;
      this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
    });
  }
}
