import { Component } from '@angular/core';
import { TitleComponent } from "../../shared/utils/title/title.component";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [TitleComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

}
