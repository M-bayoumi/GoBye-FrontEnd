import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBusRead } from '../../../models/bus/ibus-read';
import { IBranchRead } from '../../../models/branch/ibranch-read';
import { TripService } from '../../../services/trip/trip.service';
import { BranchService } from '../../../services/branch/branch.service';
import { BusService } from '../../../services/bus/bus.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITripDetails } from '../../../models/trip/itrip-details';
import { IResponse } from '../../../models/iresponse';

@Component({
  selector: 'app-update-trip',
  templateUrl: './update-trip.component.html',
  styleUrls: ['./update-trip.component.scss'],
})
export class UpdateTripComponent {
  tripForm: FormGroup;
  buses: IBusRead[] = [];

  startBranches: IBranchRead[] = [];
  endBranches: IBranchRead[] = [];

  startBranchesIds: number[] = [];
  endBranchesIds: number[] = [];

  branchChanged: boolean = false;
  today: string | null = '';

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private branchService: BranchService,
    private busService: BusService,
    private toastr: ToastrService,
    private dPipe: DatePipe,
    public dialog: MatDialogRef<UpdateTripComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITripDetails
  ) {
    this.tripForm = this.fb.group({
      startBranchId: [data.startBranchId, [Validators.required]],
      endBranchId: [data.endBranchId, [Validators.required]],
      departureDate: [data.departureDate, [Validators.required]],
      arrivalDate: [data.arrivalDate, [Validators.required]],
      price: [data.price, [Validators.required]],
      busId: [data.busId, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.GetAllStartBranches();
    this.GetAllEndBranches();
    this.GetAllAvailableBuses();
  }
  Update() {
    this.tripService.UpdateTrip(this.data.id, this.tripForm.value).subscribe({
      next: (v) => {
        let response = v as IResponse;
        this.toastr.success(response.messages.toString());
        this.dialog.close(true);
      },
      // error: (e) => console.log(e),
      // complete: () => console.log('complete'),
    });
  }

  GetAllAvailableBuses() {
    this.busService.GetAllAvailableBuses().subscribe({
      next: (v) => {
        let response = v as IResponse;
        this.buses = response.data;
      },
      // error: (e) => console.log(e),
      // complete: () => console.log('complete'),
    });
  }

  changeStartBranch(selectStartBranch: any) {
    console.log('ok');
    this.branchChanged = true;
    let branch = this.startBranches.find(
      (x) => x.id == selectStartBranch.value
    ) as IBranchRead;
    console.log(branch);
    this.branchService
      .GetBranchesByDestinationId(branch.destinationId)
      .subscribe({
        next: (v) => {
          let response = v as IResponse;
          let startBranches: IBranchRead[] = response.data;
          this.startBranchesIds = startBranches.map((x) => x.id);
          console.log(this.startBranchesIds);
        },
        // error: (e) => console.log(e),
        // complete: () => console.log('complete'),
      });
  }

  changeEndBranch(selectEndBranch: any) {
    this.branchChanged = true;
    let branch = this.endBranches.find(
      (x) => x.id == selectEndBranch.value
    ) as IBranchRead;
    console.log(branch);
    this.branchService
      .GetBranchesByDestinationId(branch.destinationId)
      .subscribe({
        next: (v) => {
          let response = v as IResponse;
          let endBranches: IBranchRead[] = response.data;
          this.endBranchesIds = endBranches.map((x) => x.id);
          console.log(this.endBranchesIds);
        },
        // error: (e) => console.log(e),
        // complete: () => console.log('complete'),
      });
  }

  GetAllStartBranches() {
    this.branchService.GetAllStartBranches().subscribe({
      next: (v) => {
        let response = v as IResponse;
        console.log(response);
        this.startBranches = response.data;
      },
      // error: (e) => console.log(e),
      //complete: () => console.log('startBranches'),
    });
  }

  GetAllEndBranches() {
    this.branchService.GetAllEndBranches().subscribe({
      next: (v) => {
        let response = v as IResponse;
        console.log(response);

        this.endBranches = response.data;
      },
      // error: (e) => console.log(e),
      // complete: () => console.log('EndBranches'),
    });
  }

  get startBranchId() {
    return this.tripForm.get('startBranchId');
  }
  get endBranchId() {
    return this.tripForm.get('endBranchId');
  }
  get departureDate() {
    return this.tripForm.get('departureDate');
  }
  get arrivalDate() {
    return this.tripForm.get('arrivalDate');
  }
  get price() {
    return this.tripForm.get('price');
  }
  get busId() {
    return this.tripForm.get('busId');
  }
}
