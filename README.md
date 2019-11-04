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
Create a `KDDocumentResourceManagerParameters` JSON and `new KDDocumentResourceManager`.
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
        tagIdentifier: 'exampleStyles',
        classes: {
            'outer-container': {
                'height': '100%',
                'width': '180px',
            },
            'black-button': {
                'background-color': '#000',
                'border': '1px',
            },
        },
        ids: {
            'submit-form-button': {
                'color': '#fefefe',
                'text-align': 'center',
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
The parameter object consists of options `scripts`, `stylesheets`, and `styles` properties. `scripts` and `stylesheets` should be a URL appropriately pointing to a `.js` or `.css` file. A `styles` object consists of `tagIdentifier`, `classes`, and `ids` properties. `classes` and `ids` should have an object for each class or id, and each should consist of CSS style names as keys with the CSS value as the value. `tagIdentifier` is the DOM identifier that will be assigned to the `<style>` tag and used to avoid accidentally duplicating existing resources. See `const params` in the example above.

## API
```
.addExternalScripts(scripts)                // Pass only the `scripts` object and load separate from the other parameters.
.addExternalCSS(css)                        // Pass only the `stylesheets` object and load separate from the other parameters.
.addLocalStyles(styles)                     // Pass only the `styles` object and load separate from the other parameters.
.params()                                   // Read-only. Return the passed parameters. 
.state()                                    // Read-only. Return the ready state for each resource.
.onReady(_ => {})                           // Run the passed function once all resources are available.
```