import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BackendService, Ticket } from '../backend.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css'],
})
export class TicketDetailsComponent implements OnInit, OnDestroy {
  destroySubject$ = new Subject<void>();
  addPendingStatus$: Observable<{ response: Ticket; pending: boolean }>;
  changeForm: FormGroup;
  formBlocked: boolean = false;
  currentTicket: Ticket;
  errorMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private services: BackendService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.changeForm = this.fb.group({
      user: ['', Validators.required],
    });
    this.addPendingStatus$ = this.route.paramMap
      .pipe(map((params) => params.get('id')))
      .pipe(
        switchMap((id) =>
          merge(
            of({ response: null, pending: true }),
            this.services.ticket(+id).pipe(
              map((response: Ticket) => {
                if (response.assigneeId !== null) {
                  this.changeForm.get('user').setValue(response.assigneeId);
                }
                this.currentTicket = response;
                return { response, pending: false };
              })
            )
          )
        )
      );
  }
  ngOnDestroy() {
    this.destroySubject$.next();
    this.destroySubject$.complete();
  }

  userChangeHandler() {
    this.errorMessage = '';
    this.formBlocked = true;
    this.changeForm.get('user').setErrors({ incorrect: true });
    this.services
      .assign(this.currentTicket.id, this.changeForm.get('user').value)
      .pipe(
        catchError((error) => {
          this.errorMessage = error;
          return of(error);
        })
      )
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(() => (this.formBlocked = false));
  }
  completeChangeHandler() {
    this.formBlocked = true;
    this.services
      .complete(this.currentTicket.id, !this.currentTicket.completed)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe(() => {
        this.formBlocked = false;
        return this.ngOnInit();
      });
  }
}
