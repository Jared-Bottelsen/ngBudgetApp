// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  /**
   * This configuration is for the --dev version of the project that only works on localhost
   */
  firebaseConfig : {
    apiKey: "AIzaSyCrxVV8wNLc81RKfGjgObMn-tiqS0tMnEI",
    authDomain: "ngbudgetapp--dev-a4ff4.firebaseapp.com",
    projectId: "ngbudgetapp--dev-a4ff4",
    storageBucket: "ngbudgetapp--dev-a4ff4.appspot.com",
    messagingSenderId: "1083681305135",
    appId: "1:1083681305135:web:a67012947c50e6dee00cda",
    measurementId: "G-4LCRZ4ERJ7"
      }    
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
