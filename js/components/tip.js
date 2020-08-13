class Tip extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                }
                :host::before, 
                :host::after {
                    content: "";
                    display: block;
                    position: absolute;
                    transform: translate(-50%, -20px);
                    opacity: 0;
                    transition: all .15s .15s, left 0s, top 0s;
                    visibility: hidden;
                    pointer-events: none;
                }
                /* for text of the tip */
                :host::before {
                    content: attr(tip);
                    border-radius: 3px;
                    padding: 6px 10px;
                    line-height: 18px;
                    font-size: 12px;
                    color: white;
                    background-color: var(--color, rgba(0, 0, 0, 0.75));
                    width: max-content;
                    max-width: 200px;
                }
                /* for arrow of the tip */
                :host::after {
                    width: 0;
                    height: 0;
                    color: var(--color, rgba(0, 0, 0, 0.75));
                }
                /* show everything */
                :host([tip]:not([tip=""]):hover:not([show=false]))::before,
                :host([tip]:not([tip=""]):focus-within:not([show=false]))::before,
                :host([tip]:not([tip=""])[show=true])::before,
                :host([tip]:not([tip=""]):hover:not([show=false]))::after,
                :host([tip]:not([tip=""]):focus-within:not([show=false]))::after,
                :host([tip]:not([tip=""])[show=true])::after {
                    visibility: visible;
                    opacity: 1;
                }

                /* top(default) */
                :host::before,
                :host(.tip-top)::before,
                :host::after,
                :host(.tip-top)::after {
                    top: auto;
                    right: auto;
                    bottom: 100%;
                    left: 50%;
                    transform: translate(-50%, -20px);
                }
                :host::after,
                :host(.tip-top)::after {
                    margin: 0 0 -12px 0;
                    border: 6px solid transparent;
                    border-top-color: currentColor;
                }
                :host(:hover:not([show=false]))::before,
                :host([show=true])::before,
                :host(:focus-within:not([show=false]))::before,
                :host(:hover:not([show=false]))::after,
                :host([show=true])::after,
                :host(:focus-within:not([show=false]))::after,
                :host(.tip-top:hover:not([show=false]))::before,
                :host(.tip-top[show=true])::before,
                :host(.tip-top:focus-within:not([show=false]))::before,
                :host(.tip-top:hover:not([show=false]))::after,
                :host(.tip-top[show=true])::after,
                :host(.tip-top:focus-within:not([show=false]))::after {
                    transform: translate(-50%, -10px);
                }

                /* top-left */
                :host(.tip-top-left)::before,
                :host(.tip-top-left)::after {
                    left: 0%;
                    top: auto%;
                    right: auto;
                    bottom: 100%;
                    transform: translate(0, -20px);
                }
                :host(.tip-top-left)::after {
                    left: 10px;
                    margin: 0 0 -12px 0;
                    border: 6px solid transparent;
                    border-top-color: currentColor;
                }
                :host(.tip-top-left:hover:not([show=false]))::before,
                :host(.tip-top-left:focus-within:not([show=false]))::before,
                :host(.tip-top-left[show=true])::before,
                :host(.tip-top-left:hover:not([show=false]))::after,
                :host(.tip-top-left:focus-within:not([show=false]))::after,
                :host(.tip-top-left[show=true])::after {
                    transform: translate(0px, -10px);
                }

                /* top-right */
                :host(.tip-top-right)::before,
                :host(.tip-top-right)::after {
                    left: auto;
                    top: auto;
                    right: 0;
                    bottom: 100%;
                    transform: translate(0, -20px);
                }
                :host(.tip-top-right)::after {
                    right: 10px;
                    margin: 0 0 -12px 0;
                    border: 6px solid transparent;
                    border-top-color: currentColor;
                }
                :host(.tip-top-right:hover:not([show=false]))::before,
                :host(.tip-top-right:focus-within:not([show=false]))::before,
                :host(.tip-top-right[show=true])::before,
                :host(.tip-top-right:hover:not([show=false]))::after,
                :host(.tip-top-right:focus-within:not([show=false]))::after,
                :host(.tip-top-right[show=true])::after {
                    transform: translate(0px, -10px);
                }
                
                /* right */
                :host(.tip-right)::before,
                :host(.tip-right)::after {
                    left: 100%;
                    top: 50%;
                    right: auto;
                    bottom: auto;
                    transform: translate(20px, -50%);
                }
                :host(.tip-right)::after {
                    margin: 0 0 0 -12px;
                    border: 6px solid transparent;
                    border-right-color: currentColor;
                }
                :host(.tip-right:hover:not([show=false]))::before,
                :host(.tip-right:focus-within:not([show=false]))::before,
                :host(.tip-right[show=true])::before,
                :host(.tip-right:hover:not([show=false]))::after,
                :host(.tip-right:focus-within:not([show=false]))::after,
                :host(.tip-right[show=true])::after {
                    transform: translate(10px, -50%);
                }

                /* right-top */
                :host(.tip-right-top)::before,
                :host(.tip-right-top)::after {
                    left: 100%;
                    top: 0;
                    right: auto;
                    bottom: auto;
                    transform: translate(20px, 0);
                }
                :host(.tip-right-top)::after {
                    top: 10px;
                    margin: 0 0 0 -12px;
                    border: 6px solid transparent;
                    border-right-color: currentColor;
                }
                :host(.tip-right-top:hover:not([show=false]))::before,
                :host(.tip-right-top:focus-within:not([show=false]))::before,
                :host(.tip-right-top[show=true])::before,
                :host(.tip-right-top:hover:not([show=false]))::after,
                :host(.tip-right-top:focus-within:not([show=false]))::after,
                :host(.tip-right-top[show=true])::after {
                    transform: translate(10px, 0);
                }

                /* right-bottom */
                :host(.tip-right-bottom)::before,
                :host(.tip-right-bottom)::after {
                    left: 100%;
                    top: auto;
                    right: auto;
                    bottom: 0;
                    transform: translate(20px, 0);
                }
                :host(.tip-right-bottom)::after {
                    bottom: 10px;
                    margin: 0 0 0 -12px;
                    border: 6px solid transparent;
                    border-right-color: currentColor;
                }
                :host(.tip-right-bottom:hover:not([show=false]))::before,
                :host(.tip-right-bottom:focus-within:not([show=false]))::before,
                :host(.tip-right-bottom[show=true])::before,
                :host(.tip-right-bottom:hover:not([show=false]))::after,
                :host(.tip-right-bottom:focus-within:not([show=false]))::after,
                :host(.tip-right-bottom[show=true])::after {
                    transform: translate(10px, 0);
                }

                /* bottom */
                :host(.tip-bottom)::before,
                :host(.tip-bottom)::after {
                    left: 50%;
                    top: 100%;
                    right: auto;
                    bottom: auto;
                    transform: translate(-50%, 20px);
                }
                :host(.tip-bottom)::after {
                    margin: -12px 0 0 0;
                    border: 6px solid transparent;
                    border-bottom-color: currentColor;
                }
                :host(.tip-bottom:hover:not([show=false]))::before,
                :host(.tip-bottom:focus-within:not([show=false]))::before,
                :host(.tip-bottom[show=true])::before,
                :host(.tip-bottom:hover:not([show=false]))::after,
                :host(.tip-bottom:focus-within:not([show=false]))::after,
                :host(.tip-bottom[show=true])::after {
                    transform: translate(-50%, 10px);
                }

                /* bottom-left */
                :host(.tip-bottom-left)::before,
                :host(.tip-bottom-left)::after {
                    left: 0;
                    top: 100%;
                    right: auto;
                    bottom: auto;
                    transform: translate(0, 20px);
                }
                :host(.tip-bottom-left)::after {
                    left: 10px;
                    margin: -12px 0 0 0;
                    border: 6px solid transparent;
                    border-bottom-color: currentColor;
                }
                :host(.tip-bottom-left:hover:not([show=false]))::before,
                :host(.tip-bottom-left:focus-within:not([show=false]))::before,
                :host(.tip-bottom-left[show=true])::before,
                :host(.tip-bottom-left:hover:not([show=false]))::after,
                :host(.tip-bottom-left:focus-within:not([show=false]))::after,
                :host(.tip-bottom-left[show=true])::after {
                    transform: translate(0, 10px);
                }

                /* bottom-right */
                :host(.tip-bottom-right)::before,
                :host(.tip-bottom-right)::after {
                    left: auto;
                    top: 100%;
                    right: 0;
                    bottom: auto;
                    transform: translate(0, 20px);
                }
                :host(.tip-bottom-right)::after {
                    right: 10px;
                    margin: -12px 0 0 0;
                    border: 6px solid transparent;
                    border-bottom-color: currentColor;
                }
                :host(.tip-bottom-right:hover:not([show=false]))::before,
                :host(.tip-bottom-right:focus-within:not([show=false]))::before,
                :host(.tip-bottom-right[show=true])::before,
                :host(.tip-bottom-right:hover:not([show=false]))::after,
                :host(.tip-bottom-right:focus-within:not([show=false]))::after,
                :host(.tip-bottom-right[show=true])::after {
                    transform: translate(0, 10px);
                }

                /* left*/
                :host(.tip-left)::before,
                :host(.tip-left)::after {
                    left: auto;
                    top: 50%;
                    right: 100%;
                    bottom: auto;
                    transform: translate(-20px, -50%);
                }
                :host(.tip-left)::after {
                    margin: 0 -12px 0 0;
                    border: 6px solid transparent;
                    border-left-color: currentColor;
                }
                :host(.tip-left:hover:not([show=false]))::before,
                :host(.tip-left:focus-within:not([show=false]))::before,
                :host(.tip-left[show=true])::before,
                :host(.tip-left:hover:not([show=false]))::after,
                :host(.tip-left:focus-within:not([show=false]))::after,
                :host(.tip-left[show=true])::after {
                    transform: translate(-10px, -50%);
                }

                /* left-top*/
                :host(.tip-left-top)::before,
                :host(.tip-left-top)::after {
                    left: auto;
                    top: 0;
                    right: 100%;
                    bottom: auto;
                    transform: translate(-20px, 0);
                }
                :host(.tip-left-top)::after {
                    top: 10px;
                    margin: 0 -12px 0 0;
                    border: 6px solid transparent;
                    border-left-color: currentColor;
                }
                :host(.tip-left-top:hover:not([show=false]))::before,
                :host(.tip-left-top:focus-within:not([show=false]))::before,
                :host(.tip-left-top[show=true])::before,
                :host(.tip-left-top:hover:not([show=false]))::after,
                :host(.tip-left-top:focus-within:not([show=false]))::after,
                :host(.tip-left-top[show=true])::after {
                    transform: translate(-10px, 0);
                }

                /* left-bottom*/
                :host(.tip-left-bottom)::before,
                :host(.tip-left-bottom)::after {
                    left: auto;
                    top: auto;
                    right: 100%;
                    bottom: 0;
                    transform: translate(-20px, 0);
                }
                :host(.tip-left-bottom)::after {
                    bottom: 10px;
                    margin: 0 -12px 0 0;
                    border: 6px solid transparent;
                    border-left-color: currentColor;
                }
                :host(.tip-left-bottom:hover:not([show=false]))::before,
                :host(.tip-left-bottom:focus-within:not([show=false]))::before,
                :host(.tip-left-bottom[show=true])::before,
                :host(.tip-left-bottom:hover:not([show=false]))::after,
                :host(.tip-left-bottom:focus-within:not([show=false]))::after,
                :host(.tip-left-bottom[show=true])::after {
                    transform: translate(-10px, 0);
                }

                /* success */
                :host(.tip-success) {
                    --color: var(--successColor, #52c41a);
                }
                /* error */
                :host(.tip-error) {
                    --color: var(--errorColor, #f4615c);
                }
                /* warning */
                :host(.tip-warning) {
                    --color: var(--warningColor, #faad14);
                }
            </style>
            <slot>tip</slot>
        `;
    }
    
    get tip() { return this.getAttribute("tip"); }
    set tip(val) { return this.setAttribute("tip", val); }
    // boolean: true / false
    get show() { return this.getAttribute("show"); }
    set show(val) { return this.setAttribute("show", val); }
};

if (!customElements.get("i-tip")) {
    customElements.define("i-tip", Tip);
}

export { Tip };