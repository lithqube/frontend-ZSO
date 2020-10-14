import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { BackendService, Ticket } from '../backend.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css'],
})
export class TicketListComponent implements OnInit, OnDestroy {
  destroySubject$ = new Subject<void>();
  form: FormGroup;
  newTaskForm: FormGroup;
  currentUser = 111;
  addPendingStatus$: Observable<{ response: Ticket[]; pending: boolean }>;
  addPendingStatusButton$;
  buttonPending: boolean = false;
  constructor(private services: BackendService, private fb: FormBuilder) {}

  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  ngOnInit(): void {
    this.newTaskForm = this.fb.group({
      description: ['', [Validators.required]],
    });
    this.form = this.fb.group({
      user: [''],
      //default start value in form
      filter: ['All'],
    });
    //TODO: i think that this Task should be solved by using pipe in html like "tickets | ticketFilter: ticketType, userId"
    this.addPendingStatus$ = this.form.valueChanges
      .pipe(startWith({ filter: 'All', user: '' }))
      .pipe(debounceTime(1000))
      .pipe(tap((val) => console.log(val)))
      .pipe(
        switchMap((val) =>
          merge(
            // pending status for spinner
            of({ response: null, pending: true }),
            this.services
              .tickets()
              .pipe(
                map((tickets) =>
                  tickets.filter((ticket) => {
                    // completed can be showed by userId if userId is not empty
                    if (val.filter === 'Completed') {
                      if (val.user === '') {
                        return ticket.completed;
                      } else {
                        return (
                          ticket.completed && ticket.assigneeId === +val.user
                        );
                      }
                    }
                    // all tasks should show all tasks :) better to solve via reset form button?
                    if (val.filter === 'All') {
                      return ticket;
                    }
                    // assignee can show us something if userId isnt empty
                    if (val.filter === 'Assignee') {
                      return ticket.assigneeId === +val.user;
                    }
                  })
                )
              )
              .pipe(
                map((response: Ticket[]) => {
                  this.buttonPending = false;
                  return { response, pending: false };
                })
              )
          )
        )
      );
  }
  onSubmit() {
    this.buttonPending = true;
    this.services
      .newTicket(this.newTaskForm.value)
      .pipe(
        tap((data) => {
          console.log(data);
          this.form.get('filter').setValue('All');
        })
      )
      .pipe(takeUntil(this.destroySubject$))
      .subscribe();
  }
}
