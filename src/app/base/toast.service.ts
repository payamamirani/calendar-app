import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _snackBar = inject(MatSnackBar);

  show(message: string): void {
    this._snackBar.open(message, 'X', {
      duration: 3000,
    });
  }
}
