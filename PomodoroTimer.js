import EventEmitter from 'events';

class PomodoroTimer extends EventEmitter {
  constructor(workDuration, breakDuration, longBreakDuration, sessions, autoStartBreak, autoStartWork) {
    super();
    this.workDuration = workDuration;
    this.breakDuration = breakDuration;
    this.longBreakDuration = longBreakDuration;
    this.sessions = sessions;
    this.session = 1;
    this.autoStartBreak = autoStartBreak;
    this.autoStartWork = autoStartWork;
    this.timerId = null;
    this.timeLeft = workDuration;
    this.isWork = true;
  }

  start() {
    this.timerId = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft >= 0) {
        this.emit('tick', this.formatTime(this.timeLeft));
      }

      if (this.timeLeft === 0) {
        this.stop();
        this.emit('completed', this.isWork);
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

export default PomodoroTimer;