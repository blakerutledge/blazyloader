export default class Layzr extends EventBundler {

    constructor( options ) {
        
        super()

        // Set status flag that we are ready to use the instance
        this.ready = false

        // Identifier used to select which html nodes are to be lazy loaded
        this.tag = options.src || 'lazy-src'

        // Unload mode
        this.unload = ( options.unload === true ) || false

        // Scale the viewport by this factor, to create the view area
        let vs = options.view_scale
        this.view_scale = ( vs && typeof vs === 'number' && vs >= 0 )
            ? vs
            : 2.0
        
        // Element that contains all of the media to be lazy loaded, and is also scrollable
        this.container = options.container || document.body

        // Initialize view measurements
        this.view_center = 0
        this.view_height = 0
        this.view_scroll = 0

        // Initialize status flag
        this.checking = 0

        // Initialize empty node arrays
        this.nodes = {
            unset: [],
            loading: [],
            loaded: [],
        }

        this.observer = new IntersectionObserver(
        
            ( data ) => { this.handler( data ) },
        
            {
                root: this.container,
                rootMargin: `${100 * 0.5 * ( this.view_scale - 1.0 )}% 0% ${100 * 0.5 * ( this.view_scale - 1.0 )}px 0%`,
                threshold: 0,
            },

        )
        
        // Update the node arrays
        this.sync_nodes()

        // We are ready for external use
        this.ready = true

    }

    handler( observations ) {

        observations.forEach( ( o ) => {

            let node = o.target
            let visible = o.isIntersecting

            let unset = (
                node.dataset.lazy_loading !== 'true' &&
                node.dataset.lazy_loaded !== 'true'
            )

            if ( visible && unset ) {
                this.set_source( node )
            }

            if ( !visible && !unset ) {
                this.unset_source( node )    
            }

        } )

    }

    // - - - Node handlers

    set_source( node ) {

        let type = node.tagName.toLowerCase()
        let url = node.getAttribute( this.tag )
        
        // Set the source
        if ( type === 'img' || type === 'iframe' ) {
            
            node.setAttribute(
                'src',
                url,
            )
        }
        else if ( type === 'video' ) {
            
            let source = document.createElement( 'source' )
            source.setAttribute( 'src', url )
            source.setAttribute( 'type', 'video/mp4' )
            
            node.innerHTML = ''
            node.appendChild( source )

        }
        else if ( type === 'div' ) {
            
            let temp = document.createElement( 'img' )
            temp.src = url

            temp.addEventListener( 'load', x => {
                node.style.backgroundImage = `url('${url}')`
            }, { once: true } )
            
        }

        // Update the state flags
        node.dataset.lazy_loading = true

        // Emit the event
        this.emit( 'lazy:set', node )

        // Add the load listener
        if ( type === 'video' ) {
            
            node.addEventListener( 'canplaythrough', () => {
                node.play()
                this.loaded( node )
            }, { once: true } )

        }
        else {

            node.addEventListener( 'load', () => {
                this.loaded( node )
            }, { once: true } )
            
        }

    }

    unset_source( node ) {
        
        let type = node.tagName.toLowerCase()
        
        // Unset the source
        if ( type === 'img' || type === 'iframe' ) {
            node.removeAttribute( 'src' )
        }
        else if ( type === 'video' ) {
            node.innerHTML = ''
            node.load()
        }
        else if ( type === 'div' ) {
            node.style.backgroundImage = 'unset'
        }

        // Update the state flags
        if ( node.dataset.lazy_loading ) {
            node.dataset.lazy_aborted = true
        }
        node.dataset.lazy_loading = false
        node.dataset.lazy_loaded = false

        // Remove the event listener
        node.removeEventListener( 'load', () => {
            this.loaded( node )
        }, { once: true } )

        // Emit the event
        this.emit( 'lazy:unset', node )
        
    }

    loaded( node ) {
        
        // Aborted load
        if ( node.dataset.lazy_aborted ) {
            node.dataset.lazy_aborted = false
            node.dataset.lazy_loading = false
            node.dataset.lazy_loaded = false
        }
        else {
            // Update the state flags
            node.dataset.lazy_loading = false
            node.dataset.lazy_loaded = true
            
            // Emit the event
            this.emit( 'lazy:loaded', node )
        }
        
    }
    
    sync_nodes() {
        
        // Stop watching all nodes
        this.observer.disconnect()

        // Find all nodes that match our tag
        this.nodes.all = qsa( `[${this.tag}]`, this.container )
        
        // Report them to the observer
        this.nodes.all.forEach( node => {
            this.observer.observe( node )
        } )

    }

}

// Query Selector helper function
export let qsa = ( selector, node ) => {
    if ( node ) {
        return Array.prototype.slice.call( node.querySelectorAll( selector ) ) 
    }
    else {
        return Array.prototype.slice.call( document.querySelectorAll( selector ) )
    }
}

class EventBundler {

    constructor() {
        this.events = {}
    }

    on( name, handler ) {
        this.events[ name ] = handler
    }

    once( name, handler ) {
        handler._once = true
        this.on( name, handler )
    }

    remove( name ) {
        if ( this.events[ name ] !== undefined ) {
            this.events[ name ] = null
            delete this.events[ name ]
        }
    }

    emit( name ) {
            
        if ( this.events[ name ] !== undefined ) {
            
            let arg = arguments.length >= 2
                ? arguments[ 1 ]
                : undefined

            this.events[ name ]( arg )
            
            if ( this.events[ name ]._once ) {
                this.off( name )
            }

        }

    }

}