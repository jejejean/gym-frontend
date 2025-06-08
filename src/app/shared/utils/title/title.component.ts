import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center">
      <h1
        class="inline-block font-bold text-2xl text-stone-100 bg-amber-500 py-2 px-3 rounded-md m-3"
      >
        {{ title }}
      </h1>
    </div>
  `,
  styleUrl: './title.component.css',
})
export class TitleComponent {
  @Input({ required: true }) public title!: string;
}
