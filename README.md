# BlazyLoader

Why another lazy loader? Well, I really needed a lazy _unloader_.

So here we are.

### Usage

```yarn add blazyloader```

And in your javascript:


```
import BlazyLoader from 'blazyloader'

let blazy = new BlazyLoader( {
    view_scale: 2.0,
    unload: true,
    container: document.querySelector( '.container' ),
} )

lazy.on( 'lazy:set', ( node ) => {
    console.log( 'loading', node.getAttribute( 'lazy-src' ) )
} )

lazy.on( 'lazy:loaded', ( node ) => {
    console.log( 'loaded', node.getAttribute( 'lazy-src' ) )
} )

lazy.on( 'lazy:unset', ( node ) => {
    console.log( 'unload', node.getAttribute( 'lazy-src' ) )
} )
```

And in your html or other templates:

```
<img lazy-src="{url}">

<iframe blazy-src="{url}" frameborder="0" allow="autoplay; fullscreen;"></iframe>

<div blazy-src="{ media.uri }"> Background Image </div>

<video blazy-src="{ url }">
    <source type="video/mp4"/>
</video>
```