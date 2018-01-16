# Baltimore Vacant Buildings - Data Visualization

## Demo

http://www.miketmoore.com:3000

## Description

This is a web application that shows Baltimore City vacant buildings on Google Maps. It allows the user to filter the locations by variables such as date, neighborhood, and council district. 

The data is from [Open Baltimore](https://data.baltimorecity.gov/) and is loaded dynamically from a single JSON file on the server:

https://data.baltimorecity.gov/Housing-Development/Vacant-Buildings/qqcv-ihn5

![Screenshot](/images/baltimore-vacant-buildings.PNG?raw=true "Screenshot")

## Dependencies

- You will need `node.js` and the `yarn` (or `npm`) package manager

## Installation and Startup

1. Clone this repository!

    ```
    git clone https://github.com/miketmoore/baltimore-vacant-buildings-app.git
    ```

2. Install and build. This will install packages via `yarn` and `bower` and it will also build the app.

    Note: this will take a few minutes. It will also install PhantomJS, so that takes a bit of time

    ```
    yarn install
    ```
    
3. Start the web app

    ```
    yarn start
    ```
    
4. Open in browser at http://localhost:3000

## Automated Tests & Coverage

Note: this uses PhantomJS

```
yarn test
```

## Developers

```
yarn run forever
// This will run webpack with the --watch arg, so each change will trigger a rebuild
yarn run watch
```

## About

- React, UI, Single Page App
    - This is the first time I've used React. I have experience with angular, backbone, bootstrap, and jquery
    - I jumped in the deep end and didn't RTFM, so I tripped up on the virtual DOM and how jQuery "works" with React
    - Ultimately, I chose to ditch jQuery and that is a special sort of feeling! 
    - Ditching jQuery meant pulling in some UI libs for react, such as `react-widgets`
    - I am using `react-router-component` to make this a single page app. First I tried using `react-router`, but had trouble implementing it. 
    - I got to build some custom React components and this was a lot of fun - the props/state paradigm is really nice
    
- paper.js
    - I used paper.js for drawing the custom bar graphs
    - It was quite a challenge figuring out how to wire this component to render the graph on page load and when switching to the route from another 
    - Another challenge was managing multiple `PaperScope` instances... I'm not totally satisfied with how I did this. The parent component has to pass a `PaperScope` instance right now. 
    - Why draw a bar graph with paper.js... because it was fun. I've never written a custom bar graph and I had to learn about normalizing the data set.
    - The bar graph is reusable, so right now there are four instances of the same component.
    - I would like to learn how to make the canvas responsive, as the fixed size is a bit of a bummer
    
- Data model
    - I created a simple JS constructor that handles indexing the raw data after the initial load
    - The model exposes a `filter` method, which is used in the `PageHome` component for all of the ... filtering!
    - The use of the filter method could be optimized, as well as the filter method itself
    - I made use of some es6 `Map` and `Set` instances. I like these, especially `Set`, in accord with `Array.from()`

- CSS layout and styling 
    - I went with Twitter Bootstrap (CSS only) here because I've used it and didn't wanted to focus on the functionality and data initially
    - I'd love to replace this with something different or customize the existing theme/aesthetic 
   
- Server application 
    - Express
    - I did a minimum of work here - just auto-generated an express app and updated the view
 
- Transpiling 
    - I am using webpack and babel to transpile my es6 code to es5
    - This was the first time I've done this and was surprised that it can be debugged in the browser (with the map)

- Automated testing & coverage
    - Karma, mocha, chai, sinon, and PhantomJS for automated testing
    - This was challenging for me because of the transpiling that was necessary
    - I still have a lot of tests to write - I only tested my custom model
    - I need to learn how to test React components that render in the DOM
    - I have used istanbul in the past, but this time had to use isparta (which uses istanbul) because of my use of es6

