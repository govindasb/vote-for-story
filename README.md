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


##ToDo

1. Make Create and Join segments into Two Individual Blocks or section and user should enter while joining through that block.

2. Outlier highlighting when someone vote greate than mean vote of others

3. End Session upOn clicking

4. 🧍‍♂️ Deduplicate Users by UUID

Avoid adding same user multiple times on rejoin.

Use uuid instead of userName in userProfiles and votes.

5. 🔐 Enforce Admin Permissions (Backend)

Add Firestore security rules:

Only admins can call revealVotes, clearVotes, and deleteSession.

6. 🧠 Link Votes with User Metadata

Extend Vote type to include uuid and permission.

Align Vote and UserProfile data more structurally.

7. 📋 Show Users from userProfiles, Not Just Votes

Display names, roles (👑 admin), and sort consistently from userProfiles.

8. 🃏 Replace Vote Buttons with Card Images

Use POKER_CARD_IMAGES_AND_VALUES array.

Bind [src] to image, (click) to vote function.

9. 📥 Fetch Session Title on Join

Pull session title from Firestore in JoinSessionByLinkComponent on ngOnInit

