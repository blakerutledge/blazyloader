# BlazyLoader 🔥

Why another lazy loader? Well, I really needed a lazy _unloader,_ and a callback system to allow for slick animations when media has _finished_ loading.

So here we are.

Built on the IntersectionObserver API, its fast and tiny, with no costly getBoundingClientRect usage. Zero dependencies.


### Usage

```
yarn add blazyloader
```

And in your javascript:


```javascript
import BlazyLoader from 'blazyloader'

// Create a new instance, all defaults shown below.
// Pass in your own values for each parameter to customize the instance's behavior
let blazy = new BlazyLoader( {
    // Is not limited to "data-attributes", can be generic attributes as well
    // <img blazy-src="http://yoururl.com/image.png">
    tag: 'blazy-src',
    
    // Multiplier of the viewport, that is the "view area"
    // Default is 2.0, which means if the viewport is 800px tall, the view area is double that,
    // and so extends 400px above and 400px below.
    view_scale: 2.0,
    
    // Set to true if you want media to be unloaded when after it exits the viewport
    // It will seamlessly reload as soon as it re-enters the view area,
    // but will free up resources while not needed. Reloading should hit the cache.
    // HTML5 Video elements on iOS webkit will not use the cache on re-load... 
    // I should add in my work around for that into this library...
    unload: false,

    // Set this to the DOM node that both has overflow scroll, and contains all assets you
    // want to lazy load+unload
    container: document.body,
    
    // If you want to bypass blazyloader and dump all blazy-src to src on instantiation
    // Useful for SEO & crawling bots
    bots: false,        
    
    // If you are using this in node.js, ie with jsdom, the `document` global is undefined
    // Pass in the virtual document, with jsdom that would be "new JSDOM().window.document"
    document: undefined 
} )

// Listen to events
blazy.on( 'blazy:set', ( node ) => {
    console.log( 'Set src attribute', node.getAttribute( 'blazy-src' ) )
} )

blazy.on( 'blazy:loaded', ( node ) => {
    console.log( 'Finished loading', node.getAttribute( 'blazy-src' ) )
} )

blazy.on( 'blazy:unset', ( node ) => {
    console.log( 'unload', node.getAttribute( 'blazy-src' ) )
} )

// Later, if you have changed the DOM elements within your container:
blazy.sync_nodes()

```

And in your html or other templates:

```html
<img blazy-src="{url}">

<iframe blazy-src="{url}" frameborder="0" allow="autoplay; fullscreen;"></iframe>

<div blazy-src="{ media.uri }"> Background Image </div>

<video blazy-src="{ url }">
    <source type="video/mp4"/>
</video>
```