/**
 * JSON syntax for `KDDocumentResourceManager.addLocalStyles(styles)` parameter.
 * @typedef {object} KDDocumentResourceManagerStyles
 * @property {string=} tagIdentifier - DOM identifier for the `<style>` tag.
 * @property {object=} classes - Object containing classes and styles.
 * @property {object=} ids - Object containing ids and styles.
 */

/**
 * JSON syntax for `KDDocumentResourceManager` parameters object.
 * @typedef {object} KDDocumentResourceManagerParameters
 * @property {object=} scripts - Object with keys representing DOM identifiers and values which are URLs to javascript resources.
 * @property {object=} stylesheets - Object with keys representing DOM identifiers and values which are URLs to CSS resources.
 * @property {KDDocumentResourceManagerStyles=} styles - Object with keys for class and id names whose values are objects of CSS attributes and values.
 */

/**
 * @example
 * 
 *  const params = {
 * 
 *      scripts: {
 *          tonejs: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.3.32/Tone.js',
 *          nexusui: 'https://cdn.jsdelivr.net/npm/nexusui@2.0.10/dist/NexusUI.min.js',
 *      },
 * 
 *      stylesheets: {
 *          animateCSS: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
 *      },
 * 
 *      styles: {
 *          tagIdentifier: 'exampleStyles',
 *          classes: {
 *              'outer-container': {
 *                  'height': '100%',
 *                  'width': '180px',
 *              },
 *              'black-button': {
 *                  'background-color': '#000',
 *                  'border': '1px',
 *              },
 *          },
 *          ids: {
 *              'submit-form-button': {
 *                  'color': '#fefefe',
 *                  'text-align': 'center',
 *              },
 *          },
 *      },
 * 
 *  }
 * 
 *  const manager = new KDDocumentResourceManager(params, _ => {
 *      console.log('all resources loaded')
 *      console.log(new Tone)
 *  })
 * 
 */
class KDDocumentResourceManager {

    constructor(params, callback) {

        const _params = {
            scripts: typeof params.scripts === 'object' ? params.scripts : null,
            stylesheets: typeof params.stylesheets === 'object' ? params.stylesheets : null,
            styles: typeof params.styles === 'object' ? params.styles : null,
            callback: callback,
        }

        const _state = {
            scripts: {
                ready: false,
                readyStates: {},
            },
            css: {
                ready: false,
                readyStates: {},
            },
        }

        let timeoutCounter = 0

        const _public = {

            /**
             * @example
             * 
             *      const scripts = {
             *          tonejs: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.3.32/Tone.js',
             *          nexusui: 'https://cdn.jsdelivr.net/npm/nexusui@2.0.10/dist/NexusUI.min.js',
             *      }
             * 
             *      const manager = new KDDocumentResourceManager()
             *      manager.addExternalScripts(scripts)
             * 
             */
            addExternalScripts: scripts => {

                const _local = {
                    // Check if all scripts are ready.
                    isReady: _ => {
                        let falseCount = 0
                        Object.values(_state.scripts.readyStates).forEach(val => val ? _ : falseCount++)
                        return falseCount == 0
                    },
                    // create the <script> tag for a script
                    addScript: (url, id) => {
                        const script = document.createElement('script')
                        script.id = id
                        script.src = url
                        script.onload = _ => {
                            _state.scripts.readyStates[id] = true
                            if (_local.isReady()) _state.scripts.ready = true
                        }
                        document.body.appendChild(script)
                    },
                }

                // Create ready state placeholders for each script
                Object.keys(scripts).forEach(id => _state.scripts.readyStates[id] = false)

                // add each script in its own <script> tag, avoid duplicating
                Object.keys(scripts).forEach(id => {
                    if (!document.getElementById(id)) _local.addScript(scripts[id], id)
                })

            },

            /**
             * @example
             * 
             *      const stylesheets = {
             *          animateCSS: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
             *      }
             * 
             *      const manager = new KDDocumentResourceManager()
             *      manager.addExternalCSS(stylesheets)
             * 
             */
            addExternalCSS: css => {

                const _local = {
                    // Check if all scripts are ready.
                    isReady: _ => {
                        let falseCount = 0
                        Object.values(_state.css.readyStates).forEach(val => val ? _ : falseCount++)
                        return falseCount == 0
                    },
                    // create the <link> tag for a stylesheet
                    addLink: (url, id) => {
                        const link = document.createElement('link')
                        link.id = id
                        link.rel = 'stylesheet'
                        link.href = url
                        link.onload = _ => {
                            _state.css.readyStates[id] = true
                            if (_local.isReady()) _state.css.ready = true
                        }
                        document.head.appendChild(link)
                    },
                }

                // Create ready state placeholders for each script
                Object.keys(css).forEach(id => _state.css.readyStates[id] = false)

                // add each script in its own <script> tag, avoid duplicating
                Object.keys(css).forEach(id => {
                    if (!document.getElementById(id)) _local.addLink(css[id], id)
                })

            },

            /**
             * Utility function to add CSS styles to a document via JSON.
             * @param {KDDocumentResourceManagerStyles} styles - Object containing keys for class and id names whose values are objects of CSS attributes and values.
             * @example
             * 
             *      const styles = {
             *          tagIdentifier: 'exampleStyles',
             *          classes: {
             *              'outer-container': {
             *                  'height': '100%',
             *                  'width': '180px',
             *              },
             *              'black-button': {
             *                  'background-color': '#000',
             *                  'border': '1px',
             *              },
             *          },
             *          ids: {
             *              'submit-form-button': {
             *                  'color': '#fefefe',
             *                  'text-align': 'center',
             *              },
             *          },
             *      }
             * 
             *      const manager = new KDDocumentResourceManager()
             *      manager.addLocalStyles(styles)
             * 
             */
            addLocalStyles: styles => {

                const _local = {
                    classes: styles.classes ? styles.classes : null,
                    ids: styles.ids ? styles.ids : null,
                    // hold complete strings for each CSS class.
                    cssStrings: {},
                    // hold complete style string with tags and css
                    css: '',
                    // Parse styles into string format.
                    createStyleString: styles => {
                        let string = ' {'
                        const keys = Object.keys(styles)
                        keys.forEach(key => string += key + ': ' + styles[key] + ';')
                        string += '}'
                        return string
                    },
                    // Add the <style> tag and classes to the document header.
                    addStyles: id => {
                        const style = document.createElement('style')
                        if (id) style.id = id
                        style.appendChild(document.createTextNode(_local.css))
                        document.head.appendChild(style)
                    },
                }

                // create class and id strings
                if (_local.classes) Object.keys(_local.classes).forEach(className => _local.cssStrings[className] = ' .' + className + _local.createStyleString(_local.classes[className]))
                if (_local.ids) Object.keys(_local.ids).forEach(idName => _local.cssStrings[idName] = ' #' + idName + _local.createStyleString(_local.ids[idName]))

                // create complete css content
                Object.values(_local.cssStrings).forEach(style => _local.css += style)

                // add style tag and content to document head - do not duplicate if a style id tag is available
                if (styles.tagIdentifier && !document.getElementById(styles.tagIdentifier)) _local.addStyles(styles.tagIdentifier)
                else _local.addStyles()

            },

        }

        const _private = {
            readyCheckAndCallback: _ => {
                if (_state.scripts.ready && _state.css.ready) {
                    if (_params.callback) _params.callback()
                } else {
                    setTimeout(_ => {
                        if (timeoutCounter < 100) {
                            timeoutCounter++
                            _private.readyCheckAndCallback()
                        } else console.log('Error loading external resources.')
                    }, 100)
                }
            },
            /** Parse `_api` into `this.method` format. */
            generateAPI: _ => Object.keys(_api).forEach(method => this[method] = _api[method]),
        }

        const _api = {
            addExternalScripts: scripts => _public.addExternalScripts(scripts),
            addExternalCSS: css => _public.addExternalCSS(css),
            addLocalStyles: (styles, styleTagID) => _public.addLocalStyles(styles, styleTagID),
            params: _ => _params,
            state: _ => _state,
        }

        const init = (_ => {
            if (params.styles) _public.addLocalStyles(params.styles)
            if (params.scripts) _public.addExternalScripts(params.scripts)
            else _state.scripts.ready = true
            if (params.stylesheets) _public.addExternalCSS(params.stylesheets)
            else _state.css.ready = true
            _private.generateAPI()
            _private.readyCheckAndCallback()
        })()

    }

}