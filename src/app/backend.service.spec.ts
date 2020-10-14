import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';

describe('BackendService', () => {
  let service: BackendService;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('SERVICE.TICKET: get one ticket with id: 0', (done: DoneFn) => {
    const mockTicketId = 0;
    service = TestBed.inject(BackendService);
    service.ticket(mockTicketId).subscribe((value) => {
      expect(value.id).toEqual(0);
      done();
    });
  });

  it('SERVICE.TICKETS: get array of tickets', (done: DoneFn) => {
    service = TestBed.inject(BackendService);
    service.tickets().subscribe((value) => {
      expect(value).toBeInstanceOf(Array);
      done();
    });
  });

  it('SERVICE.USER: get user by id: 111', (done: DoneFn) => {
    service = TestBed.inject(BackendService);
    service.user(111).subscribe((value) => {
      expect(value.id).toEqual(111);
      done();
    });
  });

  it('SERVICE.USERS: get array of users', (done: DoneFn) => {
    service = TestBed.inject(BackendService);
    service.users().subscribe((value) => {
      expect(value).toBeInstanceOf(Array);
      done();
    });
  });

  it('SERVICE.NEWTICKET: check by description if new Ticket currectly added', (done: DoneFn) => {
    const payload = { description: 'test description'};
    service = TestBed.inject(BackendService);
    service.newTicket(payload).subscribe((value) => {
      expect(value.description).toEqual(payload.description);
      done();
    });
  });

  it('SERVICE.ASSIGN: check by assigneeId if new assign operation currectly gone', (done: DoneFn) => {
    const payload = { ticketId: 1, userId: 111};
    service = TestBed.inject(BackendService);
    service.assign(payload.ticketId, payload.userId).subscribe((value) => {
      expect(value.assigneeId).toEqual(payload.userId);
      done();
    });
  });

  it('SERVICE.COMPLETE: check by completed if task was currectly compelted', (done: DoneFn) => {
    const payload = { ticketId: 1, completed: true};
    service = TestBed.inject(BackendService);
    service.complete(payload.ticketId, payload.completed).subscribe((value) => {
      expect(value.completed).toEqual(payload.completed);
      done();
    });
  });
});
