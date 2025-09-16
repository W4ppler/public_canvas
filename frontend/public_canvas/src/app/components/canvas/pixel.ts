export class Pixel {
  x: number;
  y: number
  colour: string;
  thiccness: number;

  constructor(x: number, y: number, colour: string, thiccness: number) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.thiccness = thiccness;
  }
}
