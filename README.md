# RxPrep Study Planner

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Architecture Design

I created this application as a single component instead of multiple components due to its simplicity.

I achieved separation of concerns by doing the following
  * The template (view layer) doesn't have any business logic in it.
  * The methods in the script portion of this SFC is broken into the following sections:
    * Handlers: These functions are controller-like and contain the business logic.
    * Models: These functions are there to perform CRUD operations on the data() object. These can be easily extrapolated to Vuex.
    * Utils: Utility functions.


* Local storage functionality is done cleaning simply by:
  1. Adding watcher that updates the local storage whenever a change has been made to objects I care about storing, like the topics and study plans.
  2. Adding logic under the created lifecycle hook to initialize the topics and study plan objects from localstorage upon initial application load.