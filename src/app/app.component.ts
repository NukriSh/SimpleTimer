import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type SwState = 'running' | 'paused';

interface Stopwatch {
  id: number;
  name: string;
  state: SwState;
  elapsed: number;
  accumulated: number;
  startTime: number;
  intervalId: ReturnType<typeof setInterval> | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  stopwatches: Stopwatch[] = [];
  private nextId = 1;

  format(elapsed: number): string {
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const cs = Math.floor((elapsed % 1000) / 10);
    return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}.${this.pad(cs)}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  startNew() {
    const sw: Stopwatch = {
      id: this.nextId++,
      name: '',
      state: 'running',
      elapsed: 0,
      accumulated: 0,
      startTime: Date.now(),
      intervalId: null,
    };
    sw.intervalId = setInterval(() => {
      sw.elapsed = sw.accumulated + (Date.now() - sw.startTime);
    }, 10);
    this.stopwatches.unshift(sw);
  }

  pause(sw: Stopwatch) {
    if (sw.intervalId) {
      clearInterval(sw.intervalId);
      sw.intervalId = null;
    }
    sw.accumulated = sw.elapsed;
    sw.state = 'paused';
  }

  resume(sw: Stopwatch) {
    sw.startTime = Date.now();
    sw.intervalId = setInterval(() => {
      sw.elapsed = sw.accumulated + (Date.now() - sw.startTime);
    }, 10);
    sw.state = 'running';
  }

  delete(sw: Stopwatch) {
    if (sw.intervalId) clearInterval(sw.intervalId);
    this.stopwatches = this.stopwatches.filter(s => s.id !== sw.id);
  }

  trackById(_: number, sw: Stopwatch): number {
    return sw.id;
  }

  ngOnDestroy() {
    this.stopwatches.forEach(sw => {
      if (sw.intervalId) clearInterval(sw.intervalId);
    });
  }
}
