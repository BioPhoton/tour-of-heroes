import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {map} from "rxjs/operators";

type Message = string;

interface MessageServiceState {
  messages: Message[];
}

const initState: MessageServiceState = {
  messages: []
};

@Injectable({providedIn: 'root'})
export class MessageService {

  messagesState = new BehaviorSubject<MessageServiceState>(initState);
  readonly messages$ = this.messagesState.asObservable().pipe(map(s => s.messages));

  constructor() {

  }

  add(message: string) {
    this.messagesState.next({messages: [...this.messagesState.getValue().messages, message]});
  }

  clear() {
    this.messagesState.next({messages: []});
  }
}
