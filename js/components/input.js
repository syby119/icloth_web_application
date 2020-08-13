import { Tip } from "./tip.js"
import { Button } from "./button.js"

class Input extends HTMLElement {
    constructor() {
        super();
        // usd object{ method: func, tip: ...} to check validation of input data
        this._customValidity = null;

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    box-sizing: border-box;
                    display: inline-block;
                    border: 1px solid var(--borderColor, rgba(0, 0, 0, 0.2));
                    border-radius: var(--borderRadius, 0.25em);
                    line-height: 1.8;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    padding: 0.25em 0.625em;
                    color: var(--fontColor, #333333);
                    font-size: 14px;
                }
                :host(.input-block) {
                    display: block;
                }
                :host([invalid]) {
                    --stateColor: var(--errorColor, #f4615c);
                    border-color: var(--errorColor, #f4615c);
                }
                :host([invalid]) i-icon {
                    color: var(--errorColor, #f4615c);
                }
                :host(:focus-within:not([disabled])), 
                :host(:hover:not([disabled])) {
                    border-color: var(--stateColor, #42b983);
                }
                :host([disabled]) {
                    opacity: 0.8;
                    cursor: not-allowed;
                }
                :host([disabled]) i-tip {
                    pointer-events: none;
                    background: rgba(0, 0, 0, 0.1);
                }
                :host([label]) input::placeholder {
                    color: transparent;
                }
                :host input::placeholder {
                    color: #999;
                }
                i-tip {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    margin: -0.25em -0.625em;
                    padding: 0.25em 0.625em;
                    font-family: inherit;
                    transition: 0.3s background-color;
                }
                input {
                    padding: 0;
                    text-align: inherit;
                    color: currentColor;
                    border: 0;
                    outline: 0;
                    line-height: inherit;
                    font-size: inherit;
                    font-family: inherit;
                    flex: 1;
                    min-width: 0;
                    background: none;
                    overflow: hidden;
                    transition: color 0.3s;
                }
                label {
                    pointer-events: none;
                    margin-left: -0.14em;
                    position: absolute;
                    transition: transform 0.3s, color 0.3s, background-color 0.3s;
                    transform-origin: left;
                    padding: 0 0.14em;
                    color: #999999;
                }
                input:not(:placeholder-shown) ~ label,
                input:focus ~ label {
                    transform: translateY(calc(-50% - 0.43em)) scale(0.8);
                    background: white;
                }
                .icon-pre {
                    display: flex;
                    margin-right: 0.25em;
                    color: #999999;
                }
                .btn-right {
                    width: 2em;
                    height: 2em;
                    margin: -0.25em -0.5em -0.25em 0.25em;
                    padding: 0;
                    color: #999999;
                    font-size: inherit;
                }
                :host(:focus-within:not([disabled])) .icon-pre,
                :host(:hover:not([disabled])) .icon-pre,
                :host(:focus-within:not([disabled])) label,
                :host(:hover:not([disabled])) label {
                    color:var(--stateColor, #42b983);
                }
            </style>
            <i-tip class="${this.tipDirection ? 'tip-' + this.tipDirection : ''} tip-error" >
                ${this.icon ? '<i-icon class="icon-pre" name="' + this.icon + '"></i-icon>' : ''}
                <input name="${this.name}" 
                       value="${this.default}"
                       type="${this.pickType(this.type)}"
                       placeholder="${this.placeholder}"
                       minlength="${this.minlength}"
                       maxlength="${this.maxlength}">
                </input>
                <slot></slot>
                ${this.label && !this.icon ? "<label>" + this.label + "</label>" : ""}
                ${this.type === "password" ? '<i-button class="btn-round btn-flat btn-right"><i-icon name="eye-close"></i-icon></i-button>' : ''}
                ${this.type === "search" ? '<i-button class="btn-round btn-flat btn-right"><i-icon name="search"></i-icon></i-button>' : ''}
            </i-tip>
        `;
    }

    get tipDirection() { return this.getAttribute("tip-direction"); }

    pickType(type) {
        switch(type) {
            case "password":
            case "email":
            case "tel":
            case "url":
                break;
            default:
                type = "text";
                break;
        }
        return type;
    }
    
    connectedCallback() {
        this.iform = this.closest("i-form");
        this.itip = this.shadowRoot.querySelector("i-tip");
        this.input = this.shadowRoot.querySelector("input");
        // listen event input
        this.input.addEventListener("input", ev => {
            ev.stopPropagation();
            this.checkValidity();
            if (this.debounce) {
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.dispatchEvent(new CustomEvent("input", {
                        detail: {
                            value: this.value
                        }
                    }));
                }, this.debounce);
            } else {
                this.dispatchEvent(new CustomEvent("input", {
                    detail: {
                        value: this.value
                    }
                }));
            }
        });
        // listen event change
        this.input.addEventListener("change", (ev) => {
            this.dispatchEvent(new CustomEvent("change", {
                detail: {
                    value: this.value
                }
            }));
        });
        // listen event focus
        this.input.addEventListener("focus", (ev) => {
            this.checkValidity();
        });
        this.input.addEventListener("blur", (ev) => {
            this.itip.show = false;
        })
        // listen event keydown
        this.input.addEventListener("keydown", (ev) => {
            switch (ev.keyCode) {
                case 13:
                    this.dispatchEvent(new CustomEvent("submit", {
                        detail: {
                            value: this.value
                        }
                    }));
                    break;
                default:
                    break;
            }
        });
        // right icon button
        this.btnRight = this.shadowRoot.querySelector(".btn-right");
        if (this.btnRight) { // suffix button search
            if (this.type == "search") {
                this.btnRight.addEventListener("click", (ev) => {
                    this.dispatchEvent(new CustomEvent("submit"), {
                        detail: {
                            value: this.value
                        }
                    })
                });
            } else if (this.type == "password") {  // suffix button password
                this.btnRight.addEventListener("click", (ev) => {
                    // definition of this.password, since !null == true
                    this.password = !this.password;
                    if (this.password) {
                        this.input.setAttribute("type", "text");
                        this.btnRight.querySelector("i-icon").name = "eye";
                    } else {
                        this.input.setAttribute("type", "password");
                        this.btnRight.querySelector("i-icon").name = "eye-close";
                    }
                    this.input.focus();
                });
            }
        }

        this.pattern = this.pattern;
        this.disabled = this.disabled;
        this.required = this.required;
        this.readonly = this.readonly;
    }

    focus() {
        this.input.focus;
    }

    reset() {
        this.input.value = this.default;
        this.itip.show = false;
        this.invalid = false;
    }

    checkValidity() {
        if (this.novalidate || this.disabled || this.iform && this.iform.novalidate) {
            return true;
        }

        if (this.input.checkValidity() && this.customValidity.method(this)) {
            this.itip.show = false;
            this.invalid = false;
            return true;
        } else {
            this.input.focus();
            this.itip.show = true;
            this.invalid = true;
            if (this.input.valueMissing) {
                this.itip.tip = this.input.validationMessage;
            } else {
                if (!this.customValidity.method(this)) {
                    this.itip.tip = this.customValidity.tips;
                } else {
                    this.itip.tip = this.errortip || this.input.validationMessage;
                }
            }
            return false;
        }
    }

    get invalid() { return this.getAttribute("invalid") !== null; }
    set invalid(val) {
        if (val === null || val === false) {
            this.removeAttribute("invalid");
        } else {
            this.setAttribute("invalid", "");
        }
    }
    // usd customValidity
    get customValidity() { return this._customValidity || { method:()=>true }; }
    set customValidity(object) { this._customValidity = object; }
    // usd error tip to help better understanding the invalid of the data.
    get errortip() { return this.getAttribute("errortip"); }

    get novalidate() { return this.getAttribute("novalidate") != null; }
    set novalidate(val) {
        if (val === null || val === false) {
            this.removeAttribute("novalidate");
        } else {
            this.setAttribute("novalidate", "");
        }
    }

    get debounce() { return this.getAttribute("debounce"); }

    static get observedAttributes() {
        return ["placeholder", "pattern", "required", "readonly", "disabled"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name == "disabled" && this.input) {
            if (newVal !== null) {
                this.input.parentNode.setAttribute("tabindex", "-1");
            } else {
                this.input.parentNode.removeAttribute("tabindex");
            }
        }

        if (name == "pattern" && this.input) {
            if (newVal !== null) {
                this.input.setAttribute("pattern", newVal);
            } else {
                this.input.removeAttribute("pattern");
            }
        }

        if (name == "placeholder" && this.input) {
            if (newVal !== null) {
                this.input.setAttribute("placeholder", newVal);
            } else {
                this.input.removeAttribute("placeholder");
            }
        }

        if (name == "required" && this.input) {
            if (newVal !== null) {
                this.input.setAttribute("required", "");
            } else {
                this.input.removeAttribute("required");
            }
        }

        if (name == "readonly" && this.input) {
            if (newVal !== null) {
                this.input.setAttribute("readonly", "");
            } else {
                this.input.removeAttribute("readonly");
            }
        }
    }

    get placeholder() { return this.getAttribute("placeholder") || this.label; }
    set placeholder(val) { this.setAttribute("placeholder", val); }

    get pattern() { return this.getAttribute("pattern"); }
    set pattern(val) {
        if (val === null || val === false) {
            this.removeAttribute("pattern");
        } else {
            this.setAttribute("pattern", val);
        }
    }

    get required() { return this.getAttribute("required") !== null; }
    set required(val) {
        if (val === null || val === false) {
            this.removeAttribute("required");
        } else {
            this.setAttribute("required", "");
        }
    }

    get readonly() { return this.getAttribute("readonly") !== null; }
    set readonly(val) { 
        if (val === null || val === false) {
            this.removeAttribute("readonly");
        } else {
            this.setAttribute("readonly", "");
        }
    }

    get disabled() { return this.getAttribute("disabled") !== null; }
    set disabled(val) {
        if (val === null || val === false) {
            this.removeAttribute("disabled");
        } else {
            this.setAttribute("disabled", "");
        }
    }
    // attention! this will access the value of the inner input directly
    get value() { return this.input.value; }
    set value(val) { this.input.value = val; }

    get name() { return this.getAttribute("name") || ""; }
    get default() { return this.getAttribute("default") || ""; }
    get type() { return this.getAttribute("type"); }
    get label() { return this.getAttribute("label") || ""; }
    get icon() { return this.getAttribute("icon"); }
    get minlength() { return this.getAttribute("minlength") || ""; }
    get maxlength() { return this.getAttribute("maxlength") || ""; }
};

if(!customElements.get('i-input')){
    customElements.define('i-input', Input);
}


export { Input }