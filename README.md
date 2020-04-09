# iGEM API and Team seeker

Project for subject WAP.

## Authors
* Petr Kohout <kohypetr96@gmail.com>
* Gabriela Chmelářová
* Lukáš Kúšík

## Installation

### `npm install`

##API
There are 2 kinds of records:
- team
- biobricks

Information about teams is extracted from: https://igem.org/Team_List.

Biobricks information is extracted from: 

http://parts.igem.org/Frequently_Used_Parts
http://parts.igem.org/Promoters/Catalog/Constitutive
http://parts.igem.org/Promoters/Catalog/Cell_signalling
http://parts.igem.org/Promoters/Catalog/Metal_sensitive
http://parts.igem.org/Promoters/Catalog/Phage
http://parts.igem.org/Promoters/Catalog/Madras
http://parts.igem.org/Promoters/Catalog/USTC
http://parts.igem.org/Primers/Catalog
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Composite
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Plasmid
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Plasmid_Backbone
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=dna
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Coding
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Tag
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=RBS
http://parts.igem.org/cgi/partsdb/pgroup.cgi?pgroup=Regulatory


Api support following requests
####GET
- `localhost:3001/teams`

 returns all teams registered in iGEM.
 
 - `localhost:3001/biobricks`
 
  returns all biobricks registered in iGEM.
 
 - `localhost:3001/teams/match`
 - `localhost:3001/biobricks/match`
 
 return teams (or biobricks) which are sufficient for query. Query is formed in request body:
 
```
{
    NAME:[{contain: Bool, value: String}]
    .
    .
    .
}
```
where NAME is name of label (attribute to search)
     contain is a flag if it is must be found in textfield or not. Team data structure is following...
```     
{
  "teamId": String,
  "name": String,
  "region": String,
  "country": String,
  "track": String,
  "section": String,
  "size": Number,
  "status": Number,
  "year": Number,
  "kind": String,
  "teamCode": Number,
  "division": String,
  "schoolAddress": String,
  "title": String,
  "abstract": String,
  "primaryPi": String,
  "secondaryPi": String,
  "instructors": [String],
  "studentLeaders": [String],
  "studentMembers": [String],
  "advisors": [String]
}
```

     
This example will return all teams registered in 2020 which name contains "team" but doesn't contain "2".
```
GET: localhost:3001/teams/match
{
    "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
    "year":[{"contain":true, "value": "2020"}]
}
```
####POST
- `localhost:3001/teams`
- `localhost:3001/biobricks`

With body attributes like in structure description above.

--------------------------------------------
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm server`

Runs the server in the development mode <br />
at [http://localhost:3001](http://localhost:3001).
Uses `nodemon`

The server will restart if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
