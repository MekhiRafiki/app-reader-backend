First, create a MongoDB with two collections: one with applications in it, and an empty collecton for team members (app readers). Set the MONGO_URL, APPLICATION_COLLECTION_NAME, and READERS_COLLECTION_NAME config variables in the server.js file.

Depending on the criteria you'd like to use for rating applications, the /rate route in server.js will need to be modified. Make sure the frontend and POST request also reflects these changes.

To easily deploy the backend on Heroku: https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app

You'll need the resulting app URL for the BACKEND_URL config variable in the app-reader repo.