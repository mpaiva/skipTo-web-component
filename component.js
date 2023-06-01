class SkipTo extends HTMLElement {
  constructor() {
    super();
  }

  resolvePaths(obj, rootObj = obj) {
    const resolvedObj = {};
  
    for (const key in obj) {
      const value = obj[key];
  
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const path = value.slice(1, -1);
        const nestedValue = this.resolveNestedPaths(rootObj, path);
        resolvedObj[key] = nestedValue;
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        resolvedObj[key] = this.resolvePaths(value, rootObj);
      } else {
        resolvedObj[key] = value;
      }
    }
  
    return resolvedObj;
  }
  
  resolveNestedPaths(obj, path) {
    // Follow nested value paths within object until all values are found and properly assigned, then return the resolved object
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (typeof value === 'undefined') {
        return undefined;
      }
      value = value[key];
    }
  
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      const nestedPath = value.slice(1, -1);
      value = this.resolveNestedPaths(obj, nestedPath);
    }
  
    return value;
  }

  setUserDefinedValues() {
    let r = document.querySelector(':root');
    if (this.getAttribute('font-family')) r.style.setProperty('--skipToFontFamily', this.getAttribute('font-family'))
    if (this.getAttribute('font-size')) r.style.setProperty('--skipToFontSize', this.getAttribute('font-size'))
    if (this.getAttribute('button-background')) r.style.setProperty('--skipToButtonBackgroundColor', this.getAttribute('button-background'))
    if (this.getAttribute('text-color')) r.style.setProperty('--skipToMenuTextColor', this.getAttribute('text-color'))
    if (this.getAttribute('focus-border-color')) r.style.setProperty('--skipToFocusBorderColor', this.getAttribute('focus-border-color'))
    if (this.getAttribute('focus-text-color')) r.style.setProperty('--skipToMenuTextColor', this.getAttribute('focus-text-color'))
    if (this.getAttribute('menu-background')) r.style.setProperty('--skipToMenuBackgroundColor', this.getAttribute('menu-background'))
    if (this.getAttribute('item-focus-background')) r.style.setProperty('--skipToMenuitemFocusBackgroundColor', this.getAttribute('item-focus-background'))
    if (this.getAttribute('item-focus-text-color')) r.style.setProperty('--skipToMenuitemFocusTextColor', this.getAttribute('item-focus-text-color'))
    
    
  }

  connectedCallback() {
    // Check if skipTo.js has been referenced in <head>
    // If not, append link to hosted file
    // TODO: create more specific src variable that matches final filepath name
    let head = document.getElementsByTagName("head")[0];

    let script_src = 'skipto.js';
    let script_exists = [...document.querySelectorAll('script')].find(item => item.src.indexOf(script_src) > -1);
    if (!script_exists) {
      let s = document.createElement("script");
      s.type = "text/javascript";
      s.src = script_src;
      head.appendChild(s);
    }

    // Check if any custom CSS file we need has been referenced
    // if not, add
    // TODO: this should probably be a <style> insert with an ID to match against, rather than having a CSS file to keep track of
    let style_src = 'skipTo.css';
    let style_exists = [...document.querySelectorAll('link')].find(item => item.href.indexOf(style_src) > -1);
    if (!style_exists) {
      let c = document.createElement("link");
      c.type = "text/css";
      c.rel = "stylesheet";
      c.href = style_src;
      head.appendChild(c);
    }

    // Build CSS vars
    let r = document.querySelector(':root');
    let var_check = getComputedStyle(r);
    if (!var_check.getPropertyValue('--skipToFontFamily')) {
      r.style.setProperty('--skipToFontFamily', "'Verdana', sans-serif");
      r.style.setProperty('--skipToFontSize', '1rem');
      r.style.setProperty('--skipToButtonBackgroundColor', '#121212');
      r.style.setProperty('--skipToMenuTextColor', 'white');
      r.style.setProperty('--skipToFocusBorderColor', '#bb86fc');
      r.style.setProperty('--skipToMenuBackgroundColor', '#121212');
      r.style.setProperty('--skipToMenuitemFocusBackgroundColor', '#bb86fc');
      r.style.setProperty('--skipToMenuitemFocusTextColor', 'white');
    }

    // Set defaults
    let skipToButtonLabel = "Skip to a section";
    let skipToFontFamily = "var(--skipToFontFamily)";
    let skipToFontSize = "var(--skipToFontSize)";
    let skipToButtonBackgroundColor = "var(--skipToButtonBackgroundColor)";
    let skipToMenuTextColor = "var(--skipToMenuTextColor)";
    let skipToFocusBorderColor = "var(--skipToFocusBorderColor) !important";
    let skipToMenuBackgroundColor = "var(--skipToMenuBackgroundColor)";
    let skipToMenuitemFocusBackgroundColor = "var(--skipToMenuitemFocusBackgroundColor)";
    let skipToMenuitemFocusTextColor = "var(--skipToMenuitemFocusTextColor)";
    let skipToPosition = "calc((100vw - 135px)/2)";

    if (this.getAttributeNames().length) {
      // if the user defined a design token path, let's use those
      if (this.getAttribute('token-path')) {
        let path = this.getAttribute('token-path');
        fetch(path)
          .then(response => {
            return response.json();
          })
          .then(tokens => {
            const resolvedTokens = this.resolvePaths(tokens);

            // Update CSS variables with resolved values
            // Apply resolved values to CSS variables
            for (const key in resolvedTokens.colors.components['skip-to']) {
              const value = resolvedTokens.colors.components['skip-to'][key];
              r.style.setProperty(`--${key}`, value);
            }

            // now apply any user set values
            this.setUserDefinedValues()
          
          });
      } else this.setUserDefinedValues()
    }

    // Attach skipTo object to page
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.async = true;
    script.text = `
      var SkipToConfig = {
        settings: {
          skipTo: {
            landmarks: "[role=alert],[role=main],main,[role=banner],header,nav,[role=navigation],section,[role=region],[role=search],aside,[role=complementary],footer,[role=contentinfo]",
            headings: "h1, h2, h3, h4, h5, h6",
            positionLeft: "${skipToPosition}",
            containerRole: "navigation",
            fontFamily: "${skipToFontFamily}",
            fontSize: "${skipToFontSize}",
            buttonLabel: "${skipToButtonLabel}",
            menuTextColor: "${skipToMenuTextColor}",
            buttonBackgroundColor: "${skipToButtonBackgroundColor}",
            menuitemFocusTextColor: "${skipToMenuitemFocusTextColor}",
            focusBorderColor: "${skipToFocusBorderColor}",
            menuBackgroundColor: "${skipToMenuBackgroundColor}",
            menuitemFocusBackgroundColor: "${skipToMenuitemFocusBackgroundColor}",
            menuitemFocusTextColor: "${skipToMenuitemFocusTextColor}",
          },
        },
      }
    `;
    document.body.appendChild(script);

    // TODO: make this 'theme' based so the end user only has to set a theme variable rather than having to input each var as an individual HTML attribute

    // Be sure to fully hide <skip-to /> from screen readers, etc. We are only using it to invoke the skipTo script and pass along config settings
  }
}

customElements.define("skip-to", SkipTo);