# KDDocumentResourceManager

v 1.0  
Copyright 2019 justKD  
MIT License  

Dynamically load external document resources with vanilla JS. Add script, link, and style tags to the HTML document via JSON.

## Install
via CDN:  
```
<script src="https://cdn.jsdelivr.net/gh/justKD/KDDocumentResourceManager@master/KDDocumentResourceManager.min.js"></script>
```
## Basic Use
```
const manager = new KDDocumentResourceManager({
    scripts: {
        jquery: 'https://code.jquery.com/jquery-3.4.1.min.js',
    },
}, _ => {
    console.log( $(body) )
})
```

## Extended Use
```
const params = {
 
    scripts: {
        tonejs: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.3.32/Tone.js',
        nexusui: 'https://cdn.jsdelivr.net/npm/nexusui@2.0.10/dist/NexusUI.min.js',
    },

    stylesheets: {
        animateCSS: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
    },

    styles: {
        '.outer-container': {
            'height': '500px',
            'width': '500px',
            'background-color': '#000',
        },
        '.black-button': {
            'background-color': '#000',
            'border': '1px',
        },
        '#submit-form-button': {
            'color': '#fefefe',
            'text-align': 'center',
        },
        '@media only screen and (max-width: 600px)': {
            '.outer-container': {
                'height': '100px',
                'width': '100px',
            },
        },
    },
}

const manager = new KDDocumentResourceManager(params, _ => {
    console.log('all resources loaded')
    // Check that a remote resource is actually available.
    console.log(Tone)
})
```

## KDDocumentResourceManagerParameters
The parameter object consists of optional `scripts`, `stylesheets`, and `styles` properties. `scripts` and `stylesheets` should include URLs appropriately pointing to `.js` or `.css` files. A `styles` object consists of CSS style names as keys with the CSS value as the value. Can include `@media` properties which are themselves objects containing styles. See `const params` in the example above.

## API
```
.addExternalScripts(scripts)                // Pass only the `scripts` object and load separate from the other parameters.
.addExternalCSS(css)                        // Pass only the `stylesheets` object and load separate from the other parameters.
.addLocalStyles(styles)                     // Pass only the `styles` object and load separate from the other parameters.
.params()                                   // Read-only. Return the passed parameters. 
.state()                                    // Read-only. Return the ready state for each resource.
.onReady(_ => {})                           // Run the passed function once all resources are available.
```