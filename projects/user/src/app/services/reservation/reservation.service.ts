import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IReservation } from '../../models/ireservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  AddReservation(reservation: IReservation) {
    return this.http.post(`${environment.Api}/reservations`, reservation);
  }

  GetReservationById(reservationId: number) {
    return this.http.get(`${environment.Api}/reservations/${reservationId}`);
  }

  DeleteReservation(reservationId: number) {
    return this.http.delete(`${environment.Api}/reservations/${reservationId}`);
  }
}
