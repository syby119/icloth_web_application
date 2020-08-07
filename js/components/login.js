const template = document.createElement('template');

template.innerHTML = `
<style>
</style>

<div class="login">
    <div class="header">
        <div>
        </div>
        <div>
        </div>
    </div>
    <div class="body">
    </div>
    <div class="footer">
    </div>
</div>
`;


class Login extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode:'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));



    }
};

window.customElements.define('i-login', Login);


export { Login }