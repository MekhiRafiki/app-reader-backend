First, create a MongoDB with two collections: one with the applications in it, and another empty collecton that will keep track of app readers (team members). Set the MONGO_URL, APPLICATION_COLLECTION_NAME, and READERS_COLLECTION_NAME config variables in the server.js file. Also change the LOGIN_PASSWORD.

Depending on the criteria you'd like to use for rating applications, the /rate route in server.js will need to be modified. Make sure the app-reader frontend and POST request(s) also reflect these changes.

To easily deploy the backend on Heroku:  
 https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app

You'll need the resulting app URL for the BACKEND_URL config variable in the app-reader repo.