class SkipTo extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
        // Check if skipTo.js has been referenced in <head>
        // If not, append link to hosted file

        // Check if any custom CSS file we need has been referenced
        // if not, add

        // Build skipTo config object from HTML attributes

        // Be sure to fully hide <skip-to /> from screen readers, etc. We are onlu using it to invoke the skipTo script and pass along config settings
    }
  }
  
  customElements.define("skip-to", SkipTo);