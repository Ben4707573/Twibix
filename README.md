# Twibix - Rubik's Cube Timer (Beta)

A feature-rich Rubik's Cube timer application built with Next.js for speedcubers of all levels.

#Updates#
Added compatability on mobile, Fxed errors, Added a sitemap, Added a Costum 404 page. 

## ⚠️ Beta Version Notice

**This is a beta version and not a full release.** Some features may not work as expected or may have bugs. Please report any issues you encounter in the comments.

## Features

- **Multiple Puzzle Support**: 
  - 2x2, 3x3, 4x4, 5x5, 6x6, 7x7 cubes
  - Pyraminx
  - Skewb
  - Square-1
  - Clock

- **Scramble Generation**:
  - Proper random state scrambles for all supported puzzles
  - in works: Visualized scrambles for 2x2-7x7 cubes 

- **Timer Features**:
  - Space bar or click control
  - WCA-style inspection time (configurable)
  - Sound cues at 8s and 12s during 15s inspection
  - Optional 0.5s hold delay before starting
  - Hide UI during solves option for distraction-free solving

- **Statistics**:
  - Mean of 3 (MO3)
  - Average of 5 (AO5)
  - Average of 12 (AO12)
  - Average of 100 (AO100)

- **Session Management**:
  - Multiple sessions per puzzle type
  - Add, delete, and switch between sessions
  - Session times are saved locally in your browser

- **Solve History**:
  - Complete solve history with scrambles
  - +2 penalty and DNF support
  - Retry specific solves
  - Delete unwanted solves
  - Share solves with others

- **User Interface**:
  - Dark/light mode
  - Responsive design for all devices
  - Customizable settings with tabbed organization
  - Scramble visualizer for supported puzzles

## Getting Started

### For Users

1. Visit the application in your web browser
2. Select your cube type from the dropdown
3. Press space bar or click "Start" to begin a solve
4. Press space bar or click "Stop" to end the solve
5. Your times will be automatically saved

### For Developers

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technical Information

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The app uses:
- Next.js for the framework
- React for the UI components
- Local storage for saving times and settings
- Web Audio API for sound effects
- Custom scramble generation algorithms

## Known Issues

- Scramble visualization may not work correctly for some puzzles
- Statistics calculation may occasionally be inaccurate
- Mobile experience needs optimization
- Some browsers may have issues with the space bar controls

## Future Improvements

- Better scramble visualizations for all puzzles
- More statistics options
- Data export/import functionality
- Cloud synchronization
- Keyboard shortcuts for common actions
- Improved mobile experience

## Credits

- Scramble visualization logic adapted from [CSTimer](https://cstimer.net/)
- Cube notation follows World Cube Association standards

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) because it incorporates code from CSTimer, which is GPL-3.0 licensed. The GPL-3.0 is a copyleft license that requires anyone who distributes this code or derivative works to make the source available under the same license.

[View the full license text](LICENSE)

---

Created with ❤️ for the cubing community | © 2025
