import readline from 'readline';
import PomodoroTimer from './pomodoroTimer.js';

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
let FIGLET = false;

const displayCountdown = (start, sessionNumber) => {
  const msg = sessionNumber === -1 ? '🍅Time left of break:🍅' : `🍅Time left of session ${sessionNumber}/${SESSIONS}:🍅`;
  const interval = setInterval(() => {
    const timeLeft = Math.max(0, start - Math.floor(Date.now() / 1000));
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    process.stdout.write(`\r${msg} ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    if (timeLeft === 0) {
      clearInterval(interval);
      console.log(); // New line after countdown ends
    }
  }, 1000);
};

const countdown = async (time, sessionNumber) => {
  const start = Math.floor(Date.now() / 1000) + time;
  displayCountdown(start, sessionNumber);
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
    const msg = timer.isWork ? `Time left of session ${timer.session}/${SESSIONS}:` : 'Time left of break:';
    console.log(`${msg}`);
    console.log(`⏳ ${time}  🍅`);
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
