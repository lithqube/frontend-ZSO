import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from './backend.service';

@Pipe({
  name: 'ticketFilter'
})
export class TicketFilterPipe implements PipeTransform {

  transform(tickets: Ticket[], ticketType, ): unknown {
    return null;
  }

}
