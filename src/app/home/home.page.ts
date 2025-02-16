import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../services/floor.service'; // Ensure you have a service to handle API calls

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  floors: any[] = []; // Array to hold floor data

  constructor(private floorsService: FloorService, private router: Router) {}

  ngOnInit(): void {
    this.loadFloors(); // Load floors when the component initializes
  }

  // Fetch floors from the API
  loadFloors(): void {
    this.floorsService.getFloors().subscribe({
      next: (data) => {
        this.floors = data;
      },
      error: (error) => {
        console.error('Error loading floors:', error);
      }
    });
  }

  // Open the modal to add a new floor
  openAddFloorModal(): void {
    // Redirect to add-floor page or show a modal
    this.router.navigate(['/add-floor']); // Adjust according to your app routing
  }

  // Edit a specific floor
  editFloor(id: number): void {
    this.router.navigate(['/edit-floor', id]); // Redirect to the edit page
  }
}
