import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';
import { Observable, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-count-down',
  standalone: true,
  imports: [NgIf],
  templateUrl: './count-down.component.html',
  styleUrl: './count-down.component.css',
})
export class CountDownComponent {
  @Input() countdownValue!: number;
  @Output() countdownChange: EventEmitter<number> = new EventEmitter<number>();

  updateCountDown(value: number) {
    this.countdownChange.emit(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countdownValue']) {
      this.countdownValue = changes['countdownValue'].currentValue;
      const source = interval(1000);
      const timer$ = source.pipe(takeWhile(() => this.countdownValue > 0));
      timer$.subscribe(() => {
        this.countdownValue--;
        if (this.countdownValue === 0) {
          this.updateCountDown(0);
        }
      });
    }
  }
}
