import readline from 'readline';
import PomodoroTimer from './PomodoroTimer.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {
  const workSeconds = 25 * 60;
  const breakSeconds = 5 * 60;
  const longBreakSeconds = 20 * 60;
  const sessions = 4;
  const autoStartBreak = true;
  const autoStartWork = true;

  const timer = new PomodoroTimer(workSeconds, breakSeconds, longBreakSeconds, sessions, autoStartBreak, autoStartWork);

  timer.on('tick', (time) => {
    console.clear();
    const emoji = timer.isWork ? ' ' : '⏳';
    const msg = timer.isWork ? `Time left of session ${timer.session}/${sessions}:` : '🍅Time left of break:🍅';
    console.log(`${msg}`);
    console.log(`${emoji} ${time}  🍅`);
  });

  timer.on('completed', (isWork) => {
    console.clear();
    if (isWork) {
      console.log(`Session ${timer.session} completed!`);
      timer.session++; // Increment the session only when the work timer ends
      if (timer.session > sessions) {
        console.log('All sessions completed! Take a long break!');
        timer.timeLeft = timer.longBreakDuration;
        timer.isWork = false;
        timer.start();
      } else {
        timer.timeLeft = timer.breakDuration;
        timer.isWork = false;
        if (timer.autoStartBreak) {
          timer.start();
        } else {
          rl.question('Press any key to start the break...', (answer) => {
            console.clear();
            timer.start();
          });
        }
      }
    } else {
      if (timer.session > sessions) {
        console.log('Long break completed! Exiting the app...');
        process.exit(0);
      } else {
        console.log('Break completed!');
        timer.isWork = true; // Switch to work
        timer.timeLeft = timer.workDuration; // Set the time for the work
        if (timer.autoStartWork) {
          timer.start();
        } else {
          rl.question('Press any key to start the next session...', (answer) => {
            console.clear();
            timer.start();
          });
        }
      }
    }
  });

  timer.start();
};

main();

export default main;

