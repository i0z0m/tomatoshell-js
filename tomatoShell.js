import { EventEmitter } from 'events';
import readline from 'readline';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const HELP = `
-r, prints total hours spent using tomatoshell and exits
-t, time for every session in minutes [default:25 minutes]
-d, delay between sessions in minutes [default:5 minutes]
-n, total sessions [default:3]
-f, figlet on
-h, shows this
`;

// Defaults
let TIME = 25;
let DELAY = 5;
let SESSIONS = 3;

const displayCountdown = (start, sessionNumber) => {
  const emoji = sessionNumber === -1 ? '⏳' : '⬅️';
  const msg = sessionNumber === -1 ? `${emoji}Time left of break:` : `${emoji}Time left of session ${sessionNumber}/${SESSIONS}:`;
  const timer = new PomodoroTimer(start, DELAY);
  const interval = setInterval(() => {
    const timeLeft = Math.max(0, timer.timeLeft);
    process.stdout.write(`\r${msg} ${timer.formatTime(timeLeft)}`);
    if (timeLeft === 0) {
      clearInterval(interval);
      console.log(); // New line after countdown ends
    }
  }, 1000);
};

const main = async () => {
  // Argument handling
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-r':
        // Implement this part to read the log and calculate total hours spent
        console.log('Total hours spent focused: ...');
        process.exit(0);
        break;
      case '-t':
        TIME = parseInt(args[i + 1], 10);
        i++; // Skip the next argument since it's already used
        break;
      case '-d':
        DELAY = parseInt(args[i + 1], 10);
        i++;
        break;
      case '-n':
        SESSIONS = parseInt(args[i + 1], 10);
        i++;
        break;
      case '-f':
        FIGLET = true;
        break;
      case '-h':
        console.log(HELP);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option ${arg}`);
        process.exit(1);
    }
  }

  // Convert time and delay from minutes to seconds
  TIME = TIME * 60;
  DELAY = DELAY * 60;

  const timer = new PomodoroTimer(TIME, DELAY);

  timer.on('tick', (time) => {
    console.clear();
    const emoji = timer.isWork ? '⬅️' : '⏳';
    const msg = timer.isWork ? `Time left of session ${timer.session}/${SESSIONS}:` : 'Time left of break:';
    console.log(`${msg}`);
    console.log(`${emoji} ${time} 🍅`);
  });

  timer.on('completed', (isWork) => {
    if (!isWork) {
      if (timer.session > SESSIONS) {
        console.log('\nAll sessions completed. Take a longer break!');
        rl.close();
        process.exit(0);
      }
    }
  });
  timer.start();
};

main();
