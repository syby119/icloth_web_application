import { Button } from "./button"

class Popcon extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                
            </style>
            <div class="popcon-content">
                <div class="">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    static get obversedAttributes() {
        return [];
    }
    
    attributeChangedCallback (name, oldValue, newValue) {

    }

    connectedCallback() {
        
    }
}

if(!customElements.get('i-popcon')){
    customElements.define('i-popcon', Popcon);
}

class Popover extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    overflow: visible;
                }
            </style>
            <slot></slot>
        `;
    }




    static get obversedAttributes() {
        return [];
    }

    attributeChangedCallback (name, oldValue, newValue) {

    }

    connectedCallback() {
        this.popcon = this.shadowRoot.querySelector("i-popcon");
    }
}

if(!customElements.get('i-popover')){
    customElements.define('i-popover', Popover);
}

export { Popcon, Popover };