# VoteForStory

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Future Work

📋 Vote for Story App – Feature TODOs
🎯 User Experience Enhancements
 Show loading spinner while syncing session data

 Display “voted” status next to each user (e.g., ✅ or 🕒 before reveal)

 Animate votes when they are revealed

 Make layout responsive for mobile and tablet

 Add a dark mode toggle (optional)

🧠 Smart Voting Features
 Add voting timer to auto-reveal or auto-clear after X seconds

 Auto-reset voting round after a reveal (e.g., 10 seconds)

 Allow session creator to enter a story title per vote

 Display vote statistics (average, mode, etc.) after reveal

🔒 Stability & Cleanup
 Prevent users from voting more than once per round

 Add “Leave Session” button to allow user to exit

 Auto-delete stale sessions (e.g., no activity for 1 hour)

🚀 Deployment & DevOps
 Set up GitHub Actions for CI/CD deployment to Firebase

 Add unit tests for components and services (Jasmine + Karma)

 Create invite/share link with name pre-filled (/session/:id?name=Govind)
