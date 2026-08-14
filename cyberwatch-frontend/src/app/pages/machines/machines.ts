import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Machine,
  MachineService
} from '../../core/services/machine';

@Component({
  selector: 'app-machines',
  imports: [CommonModule],
  templateUrl: './machines.html',
  styleUrl: './machines.scss'
})
export class Machines implements OnInit {

  machines: Machine[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private machineService: MachineService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMachines();
  }

  loadMachines(): void {
    this.loading = true;
    this.errorMessage = '';

    this.machineService.getAllMachines().subscribe({
      next: (machines) => {
        console.log('MACHINES RECEIVED', machines);

        this.machines = machines;
        this.loading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Unable to load machines.';
        this.loading = false;

        this.cdr.markForCheck();
      }
    });
  }

  changeStatus(
    machine: Machine,
    status: 'ONLINE' | 'OFFLINE' | 'COMPROMISED'
  ): void {

    this.machineService
      .updateStatus(machine.id, status)
      .subscribe({

        next: (updatedMachine) => {

          const index = this.machines.findIndex(
            item => item.id === updatedMachine.id
          );

          if (index !== -1) {
            this.machines[index] = updatedMachine;
          }

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error(error);

          this.errorMessage =
            'Unable to update machine status.';

          this.cdr.markForCheck();
        }
      });
  }
}