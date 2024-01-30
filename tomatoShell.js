import readline from 'readline';
import PomodoroTimer from './PomodoroTimer.js';

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

const handleArguments = (args, defaultWorkMinutes, defaultBreakMinutes, defaultSessions) => {
  let workMinutes = defaultWorkMinutes;
  let breakMinutes = defaultBreakMinutes;
  let sessions = defaultSessions;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-r':
        // Implement this part to read the log and calculate total hours spent
        console.log('Total hours spent focused: ...');
        process.exit(0);
        break;
      case '-t':
        workMinutes = parseInt(args[i + 1], 10);
        i++; // Skip the next argument since it's already used
        break;
      case '-d':
        breakMinutes = parseInt(args[i + 1], 10);
        i++;
        break;
      case '-n':
        sessions = parseInt(args[i + 1], 10);
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

  return { workMinutes, breakMinutes, sessions };
};

const main = async (defaultWorkMinutes = 25, defaultBreakMinutes = 5, defaultSessions = 3) => {
  const args = process.argv.slice(2);
  const { workMinutes, breakMinutes, sessions } = handleArguments(args, defaultWorkMinutes, defaultBreakMinutes, defaultSessions);

  // Convert time and delay from minutes to seconds
  const workSeconds = workMinutes * 60;
  const breakSeconds = breakMinutes * 60;

  const timer = new PomodoroTimer(workSeconds, breakSeconds, sessions);

  timer.on('tick', (time) => {
    console.clear();
    const emoji = timer.isWork ? '⬅️' : '⏳';
    const msg = timer.isWork ? `Time left of session ${timer.session}/${sessions}:` : 'Time left of break:';
    console.log(`${msg}`);
    console.log(`${emoji} ${time} 🍅`);
  });

  timer.on('completed', (isWork) => {
    if (!isWork) {
      if (timer.session > sessions) {
        console.log('\nAll sessions completed. Take a longer break!');
        rl.close();
        process.exit(0);
      }
    }
  });

  timer.start();
};

main();

export default main;