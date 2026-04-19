import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type State = 'idle' | 'running' | 'paused' | 'stopped';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  state: State = 'idle';
  elapsed = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private startTime = 0;
  private accumulated = 0;

  get display(): string {
    const ms = this.elapsed;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}.${this.pad(cs)}`;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  start() {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsed = this.accumulated + (Date.now() - this.startTime);
    }, 10);
    this.state = 'running';
  }

  pause() {
    this.clearTimer();
    this.accumulated = this.elapsed;
    this.state = 'paused';
  }

  resume() {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsed = this.accumulated + (Date.now() - this.startTime);
    }, 10);
    this.state = 'running';
  }

  stop() {
    this.clearTimer();
    this.accumulated = this.elapsed;
    this.state = 'stopped';
  }

  delete() {
    this.clearTimer();
    this.elapsed = 0;
    this.accumulated = 0;
    this.state = 'idle';
  }

  private clearTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
