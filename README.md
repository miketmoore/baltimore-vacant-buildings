# Baltimore Vacant Buildings - Data Visualization

## Description

This is a web application that shows Baltimore City vacant buildings on Google Maps. It allows the user to filter the locations by variables such as date, neighborhood, and council district. 

The data is from [Open Baltimore](https://data.baltimorecity.gov/) and is loaded dynamically from a single JSON file on the server:

https://data.baltimorecity.gov/Housing-Development/Vacant-Buildings/qqcv-ihn5

![Screenshot](/images/baltimore-vacant-buildings-screenshot.PNG?raw=true "Screenshot")

## Dependencies

- You will need `node.js` and the `npm` package manager

## Installation and Startup

1. Clone this repository!

    ```
    git clone https://github.com/miketmoore/baltimore-vacant-buildings-app.git
    ```

2. Install and build. This will install packages via `npm` and `bower` and it will also build the app.

    ```
    npm install
    ```
    
3. Start the web app

    ```
    npm start
    ```
    
4. Open in browser at http://localhost:3000

## Under the Hood

### React

- Since I didn't RTFM at first, I ran into some difficulty learning the React lifecycle
- I initially tried to use jQuery, but ran into trouble. After reading more from the online community about jQuery and React, I chose to ditch jQuery completely. Everything worked much better after that.
- I used a few different UI libs for React: 
    - `react-widgets` for `DropdownList` and `MultiSelect`
    - `react-google-maps`
    - `react-router-component`
    - `react-data-grid`
- Custom React components
  - This was the fun part!
  
### Data model

- This is a simple JS constructor that is nice and intimate with the Open Baltimore data. They get along well together.
- I implemented a filter method here that is used whenever a UI filter is interacted with. I think there are some optimizations I can make here at a later time.
- The model indexes the data by it's fields/columns in some es6 `Map` and `Set` instances

### CSS layout and styling 

- Twitter bootstrap (CSS only)
 
### HTML5 Canvas Drawing

- PaperJS for drawing custom visualizations on the HTML5 canvas
- I struggled a bit learning how to maintain multiple `PaperScope` instances, but once this was ironed out, I was able to support two separate scopes and two separate canvases on screen at once.
   
### Server application
 
- Express
- I did a minimum of work here - just auto-generated an express app and updated the view
 
### Transpiling es6 to es5 

- webpack and babel

### Automated testing

- Karma, mocha, chai, sinon, and PhantomJS for automated testing
  - This was challenging for me because of the transpiling necessary

The app is written with some es6 spattered about, so the browser code is transpiled to es5 via webpack and babel. 

## Automated Tests

```
npm test
```
