class SkipTo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Check if skipTo.js has been referenced in <head>
    // If not, append link to hosted file
    // TODO: create more specific src variable that matches final filepath name
    let script_src = 'skipto.js';
    let script_exists = [...document.querySelectorAll('script')].find(item => item.src.indexOf(script_src) > -1);
    if (!script_exists) {
      let head = document.getElementsByTagName("head")[0];
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.src = script_src;
      head.appendChild(s);
    }

    // Check if any custom CSS file we need has been referenced
    // if not, add
    let style_src = 'skipTo.css';
    let style_exists = [...document.querySelectorAll('link')].find(item => item.href.indexOf(style_src) > -1);
    if (!style_exists) {
      let head = document.getElementsByTagName("head")[0];
      var c = document.createElement("link");
      c.type = "text/css";
      c.rel = "stylesheet";
      c.href = style_src;
      head.appendChild(c);
    }

    console.log(this.getAttributeNames());

    var skipToButtonLabel = "Skip to a section"
		var skipToFontFamily = "var(--skipToFontFamily)"
		var skipToFontSize = "var(--skipToFontSize)"
		var skipToButtonBackgroundColor = "var(--skipToButtonBackgroundColor)"
		var skipToMenuTextColor = "var(--skipToMenuTextColor)"
		var skipToFocusBorderColor = "var(--skipToFocusBorderColor) !important"
		var skipToMenuBackgroundColor = "var(--skipToMenuBackgroundColor)"
		var skipToMenuitemFocusBackgroundColor = "var(--skipToMenuitemFocusBackgroundColor)"
		var skipToMenuitemFocusTextColor = "var(--skipToMenuitemFocusTextColor)"
		var skipToPosition = "calc((100vw - 135px)/2)"

    // TODO: make this 'theme' based so the end user only has to set a theme variable rather than having to input each var as an individual HTML attribute

    // Build skipTo config object from HTML attributes

    // Be sure to fully hide <skip-to /> from screen readers, etc. We are only using it to invoke the skipTo script and pass along config settings
  }
}

customElements.define("skip-to", SkipTo);