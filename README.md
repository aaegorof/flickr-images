# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start` - for developement
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
### `npm build` - to build production ready



## This project uses Flickr Images API
The project uses Router to navigate through, in that case you can develop more and refresh the page with no worries, also you can share the link with friends.

I decide to fit all images in the list in the squares, so it will look more accurate.

Im using Debounce function for typing the text in search input to avoid too much requests.

It uses Infinite scroll when you intersect the button at the bottom of the list, if that will not work, you can click the button.

I use React Query and Axios to create the Api calls. Why? Cause they are best, and RQ has infinite scroll out of the box, also it will cache your results and even has 'Stale' requests with autorefresh.

You can find more docs on API here https://www.flickr.com/services/api/flickr.photos.search.html

## This project uses OpenCv external library to process the images

If you click image you will be directed to detail image page. You can use back to navigate back to the list (with last search remains).

It uses Canny Edge Detection on the image, you can find more about that method here https://docs.opencv.org/master/d7/de1/tutorial_js_canny.html

The Edge detection canvas will appear just on the original image, but you can switch it off if you want to.

### Conclusion / thoughts and ToDos
I decided not to include any frameworks or ui-kit, just to show my hard skills and to stay with less code base.
I spent a lot of time on that third party library openCv, its documentation. The library is 'fat' and not adopted to use with React.
Firstly it wont work with my code, so i searched for the workaround and found it, but that library doesnt seem to be a good decision, or it should be adopted to use with React, it has lack of documentation and examples.

For styling i chose just plain SCSS, its simple and flexible, and i wrap my styles in a wrap class of the component, so its pretty much isolated,
There is no need to bring styled components here, but i can :)

I would spend more time on doing tests and writing Typescript if i had it.


