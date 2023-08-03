const EventEmitter = require('events');

class PomodoroTimer extends EventEmitter {
  constructor(workDuration, breakDuration) {
    super();
    this.workDuration = workDuration;
    this.breakDuration = breakDuration;
    this.timerId = null;
    this.timeLeft = workDuration;
    this.isWork = true;
    this.session = 1; // Initialize the session to 1
  }

  start() {
    this.timerId = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft >= 0) {
        this.emit('tick', this.formatTime(this.timeLeft));
      }

      if (this.timeLeft === 0) {
        this.stop();
        this.isWork = !this.isWork;
        this.timeLeft = this.isWork ? this.workDuration : this.breakDuration;
        this.session++; // Increment the session
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

module.exports = PomodoroTimer;
