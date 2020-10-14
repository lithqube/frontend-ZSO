import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: number;
  completed: boolean;
};

function randomDelay() {
  return Math.random() * 4000;
}
//added providedIn root
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  storedTickets: Ticket[] = [
    {
      id: 0,
      description: 'Install a monitor arm',
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      description: 'Move the desk to the new location',
      assigneeId: 111,
      completed: true
    },
    {
      id: 2,
      description: 'ASdasdsada',
      assigneeId: 222,
      completed: true
    },
    {
      id: 3,
      description: 'ASdasdsada',
      assigneeId: 111,
      completed: false
    },
    {
      id: 4,
      description: 'ASdasdsada',
      assigneeId: 333,
      completed: false
    },
    {
      id: 5,
      description: 'ASdasdsada',
      assigneeId: 111,
      completed: true
    }
  ];

  storedUsers: User[] = [{ id: 111, name: 'Victor' }, { id: 222, name: 'Victor2' }, { id: 333, name: 'Victor3' }];

  lastId = 5;

  constructor() { }

  private findTicketById = id =>
    this.storedTickets.find(ticket => ticket.id === +id);
  private findUserById = id => this.storedUsers.find(user => user.id === +id);

  tickets() {
    return of(this.storedTickets).pipe(delay(randomDelay()));
  }

  ticket(id: number): Observable<Ticket> {
    return of(this.findTicketById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTicket(payload: { description: string }) {
    const newTicket: Ticket = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false
    };
    return of(newTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => {
        console.log(this.storedTickets);
        return this.storedTickets.push(ticket);
      })
    );
  }

  assign(ticketId: number, userId: number) {
    const foundTicket = this.findTicketById(+ticketId);
    const user = this.findUserById(+userId);

    if (foundTicket && user) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.assigneeId = +userId;
        })
      );
    }

    return throwError(new Error('ticket or user not found'));
  }
//added ticket.completed = completed
  complete(ticketId: number, completed: boolean) {
    const foundTicket = this.findTicketById(+ticketId);
    if (foundTicket) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.completed = completed;
        })
      );
    }

    return throwError(new Error('ticket not found'));
  }
}
