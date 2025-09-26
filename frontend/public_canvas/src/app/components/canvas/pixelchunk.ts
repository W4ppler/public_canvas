export class PixelChunk {
  chunk_x: number;
  chunk_y: number;
  data: string;

  constructor(chunk_x: number, chunk_y: number, data: string) {
    this.chunk_x = chunk_x;
    this.chunk_y = chunk_y;
    this.data = data;
  }
}
