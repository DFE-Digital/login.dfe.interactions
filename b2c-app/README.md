# Azure B2C UI
To run the application, you will need to run `npm i` at the root this will construct everything needed to run the B2C stuff.

# ReactJS
The project makes use of ReactJS's Server Side Rendering capability to ensure that GDS need not worry about JS being disabled.

## Testing through the server
To test through the server npm i will have had to be run, and the can go to `https://[DOMAIN]:[PORT]/b2c/template`.

## testing through the browser
This is the best way for development, though does require JS to be enabled. in the `b2c-app` sub folder run `npm run start` this should start 
a server on `http://localhost:3000` for you to navigate to (it may even open a tab for you automatically). However images will not work.