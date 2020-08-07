class Button extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position:relative;
                    display:inline-flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 1.8;
                    padding: calc(0.25em + 1px) calc(0.625em + 1px);
                    box-sizing: border-box;
                    color: black;
                    background-color: white;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    font-size: 14px;
                    border-radius: 0.25em;
                    cursor: pointer;
                    overflow: hidden;
                }
                :host(.btn-primary), :host(.btn-toggle[checked]) {
                    background-color: rgb(20, 115, 230);
                    border-color: rgb(20, 115, 230);
                    color: white;
                }
                :host(.btn-secondary), :host(.btn-toggle) {
                    background-color: white;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    color: black;
                }
                :host(.btn-round) {
                    border-radius: 1024px;
                    padding: 0.25em 0.25em;
                }
                :host(.btn-block) {
                    display: flex;
                }
                :host([disabled]) {
                    cursor: not-allowed;
                    pointer-events: none;
                    opacity: 0.6;
                }
                :host([disabled]) .btn {
                    cursor: not-allowed;
                    pointer-events: all;
                }
                .btn {
                    background: none;
                    outline: 0;
                    border: 0;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    user-select: none;
                    cursor: unset;
                }
                .btn::after {
                    content: "";
                    position: absolute;
                    display: block;
                    width: 100%;
                    height: 100%;
                    left: var(--x, 0);
                    top: var(--y, 0);
                    transform: translate(-50%, -50%) scale(12);
                    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 11%);
                    background-position: 50%;
                    background-repeat: no-repeat;
                    opacity: 0;
                    pointer-events: none;
                    transition: transform 0.3s, opacity 0.8s;
                }
                :host(:not([disabled])) .btn:active::after {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                    transition: 0s;
                }
            </style>
            <${this.href ? "a" : "button"} 
             ${this.type ? 'type="' + this.type + '"' : ''} 
             ${(this.download&&this.href) ? 'download="' + this.download + '"' : ''} 
             ${this.href ? 'href="' + this.href + '" target="' + this.target + '" rel=' + this.rel + '"' : ''} 
             class="btn">
            </${this.href ? "a" : "button"}>
            <slot>button</slot>
        `;
    }

    // button: value in [submit, reset, button]
    // a: hints at the linked URL’s format with a MIME type. No built-in functionality.
    get type() { return this.getAttribute("type"); }
    set type(val) { return this.setAttribute("type", val); }

    // usd: whether respond to any event
    get disabled() { return this.getAttribute("disabled") !== null; }
    set disabled(val) { 
        if (val === false || val === null) { 
            this.removeAttribute("disabled"); 
        } else {
            this.setAttribute("disabled", "");
        }
    }

    // usd: .btn-toggle[checked]
    get checked() { return this.getAttribute("checked") !== null;} 
    set checked(val) { 
        if (val === false || val === null) {
            this.removeAttribute("checked")
        } else {
            this.setAttribute("checked", "");
        }
    }

    // button: submitted as a pair with the button’s value as part of the form data
    get name() { return this.getAttribute("name"); }
    set name(val) { return this.setAttribute("name", val); }
    
    // a: the URL that the hyperlink points to 
    get href() { return this.getAttribute("href"); }
    set href(val) { this.setAttribute("href", val); }
    
    // a: where to display the linked URL, value in [_self, _blank, _parent, _top]
    //    _self suggests open in the current browsing content, _blank suggests open in new content
    get target() { return this.getAttribute("target") || "_blank"; }

    // a: The relationship of the linked URL as space-separated link types. used with target
    get rel() { return this.getAttribute("rel"); }
    
    // a: prompts the user to save the linked URL instead of navigating to it
    //    can be used with or without value, value suggests the filename
    get download() { return this.getAttribute("download"); }

    static get observedAttributes() { 
        return ["href", "type", "disabled"]; 
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (!this.btn) {
            return;
        }

        if (name == "href") {
            if (!this.disabled) {
                this.btn.href = newVal;
            }
        }

        if (name == "type") {
            this.btn.type = newVal;
        }

        if (name == "disabled") {
            if (newVal !== null) {
                this.btn.setAttribute("disabled", "disabled");
                if (this.hasAttribute("href")) {
                    this.btn.removeAttribute("href");
                }
            } else {
                this.btn.removeAttribute("disabled");
                if (this.hasAttribute("href")) {
                    this.btn.setAttribute("href", this.href);
                }
            }
        }
    }

    connectedCallback() {
        this.btn = this.shadowRoot.querySelector(".btn");
        // add ripple animation when click
        this.btn.addEventListener("mousedown", function(e) {
            if (!this.disabled) {
                const { x, y } = this.getBoundingClientRect();
                this.style.setProperty("--x", (e.clientX - x) + "px");
                this.style.setProperty("--y", (e.clientY - y) + "px");
            }
        });
    }
};

alert("button的hover还没做！！！");

if (!customElements.get("i-button")) {
    customElements.define("i-button", Button);
}

export { Button }