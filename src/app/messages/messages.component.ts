import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
  constructor(
    public messageService: MessageService,
  ) {}
}
