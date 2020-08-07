class Icon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                font-size: inherit;
                display:inline-block;
            }
            .icon {
                display: block;
                width: 1em;
                height: 1em;
                margin: auto;
                fill: currentColor;
                overflow: hidden;
            }
        </style>
        <svg class="icon" aria-hidden="true" viewBox="0 0 1024 1024">
            <use></use>
        </svg>
        `;

        this.icon = this.shadowRoot.querySelector("svg");
        this.use = this.icon.querySelector("use");
    }

    static get observedAttributes() {
        return ["name", "size", "color"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name == "name") {
            this.use.setAttribute("href", `./assets/images/icons/iconfont.svg#icon-${newVal}`);
        }

        if (name == "color") {
            this.icon.style.color = newVal;
        }

        if (name == "size") {
            this.icon.style.fontSize = newVal;
        }
    }

    get name() {
        return this.getAttribute("name");
    }

    get color() {
        return this.getAttribute("color");
    }

    get size() {
        return this.getAttribute("size");
    }

    set name(val) {
        this.setAttribute("name", val);
    }

    set color(val) {
        this.setAttribute("color", val);
    }

    set size(val) {
        this.setAttribute("size", val);
    }
}

if (!customElements.get("i-icon")) {
    customElements.define("i-icon", Icon);
}

export { Icon }