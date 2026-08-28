import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Analyst,
  AnalystService
} from '../../core/services/analyst';

@Component({
  selector: 'app-analysts',
  imports: [CommonModule],
  templateUrl: './analysts.html',
  styleUrl: './analysts.scss'
})
export class Analysts implements OnInit {

  analysts: Analyst[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private analystService: AnalystService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAnalysts();
  }

  loadAnalysts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.analystService.getAllAnalysts().subscribe({
      next: (analysts) => {
        console.log('ANALYSTS RECEIVED', analysts);

        this.analysts = analysts;
        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load analysts.';
        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }
}