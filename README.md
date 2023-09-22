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

// Create a new instance
let blazy = new BlazyLoader( {
    tag: 'blazy-src',   // default, can also do data-my-src or anything you like
    view_scale: 2.0,    // default, multiplier of the viewport, that is the "view area"
    unload: true,       // default is false
    container: document.querySelector( '.container' ) //default is document.body
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