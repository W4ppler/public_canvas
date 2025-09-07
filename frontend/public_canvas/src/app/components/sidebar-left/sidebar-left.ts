import {Component, Input, WritableSignal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ColorPickerModule } from 'primeng/colorpicker';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-sidebar-left',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ColorPickerModule,
    FormsModule,
    MatSliderModule
  ],
  templateUrl: './sidebar-left.html',
})
export class SidebarLeft {
  @Input() public colour!: WritableSignal<string>;
  @Input() public thiccness!: WritableSignal<number>;

  displayThiccness(value: number): string {
    return `${value}` + "px";
  }
}
