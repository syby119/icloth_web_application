import { Button } from "./button"

class Dropdown extends HTMLElement {
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
                :host::slotted(i-dropdown-menu) {

                }
            </style>
            <slot></slot>
        `;
    }

    static get obversedAttributes() { return []; }

    attributeChangedCallback (name, oldVal, newVal) { }

    connectedCallback() { }
}

if(!customElements.get('i-dropdown')){
    customElements.define('i-dropdown', Dropdown);
}

class DropdownMenu extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    box-sizing: border-box;
                    background: var(--themeBackground, white);
                    visibility: hidden;
                    min-width: 100px;
                }
                :host ::slotted(DropdownItem),
                :host ::slotted(DropdownHeader),
                :host ::slotted(DropdownDivider) {
                    
                }
            </style>
            <slot></slot>
        `;
    }

    
};

if(!customElements.get('i-dropdown-menu')){
    customElements.define('i-dropdown-menu', DropdownMenu);
}

class DropdownSubmenu extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                
            </style>
            <slot></slot>
        `;
    }
};

if(!customElements.get('i-dropdown-submenu')){
    customElements.define('i-dropdown-submenu', DropdownSubmenu);
}


class DropdownItem extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display:block;
                    width: 100%;
                }
                :host i-button {
                    
                }
                :host .arrow-right {
                    display: inline-block;
                    right: 0;

                }
            </style>
            <i-button>${this.name}</i-button>
            ${this.popup ? '<i-button><i-icon name= "border"></i-icon></i-button>' : ''}
        `;
    }

    get name() { return this.innerHTML; }
    get arguments() { return this.getAttribute("option") !==null; }
    set option(val) {
        if (val === null || val === false) {
            this.getAttribute
        } else {
            
        }
    }

    static get obversedAttributes() {
        return [];
    }
    
    attributeChangedCallback (name, oldValue, newValue) {

    }

    connectedCallback() {
        
    }
}

if(!customElements.get('i-dropdown-item')){
    customElements.define('i-dropdown-item', DropdownItem);
}


class DropdownHeader extends HTMLElement {

}

if(!customElements.get('i-dropdown-header')){
    customElements.define('i-dropdown-header', DropdownHeader);
}

class DropdownDivider extends HTMLElement {

}

if(!customElements.get('i-dropdown-divider')){
    customElements.define('i-dropdown-divider', DropdownDivider);
}

export { Dropdown, DropdownMenu, DropdownItem, DropdownHeader, DropdownDivider };