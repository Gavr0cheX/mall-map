import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  private apiUrl = 'http://localhost:3000/api/floors'; // Update with your actual API URL

  constructor(private http: HttpClient) {}

  // Fetch all floors
  getFloors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Add a new floor
  addFloor(floor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, floor);
  }

  // Update an existing floor
  updateFloor(id: number, floor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, floor);
  }

  // Delete a floor
  deleteFloor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
