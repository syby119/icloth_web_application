import { Icon } from "./icon.js";
import { Button } from "./button.js";

class Pagination extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>

            </style>
            <i-button class="btn-flat btn-left" ${this.href ? "href=1" : ""} target="_self">
                <i-icon name="left"></i-icon>
            </i-button>
            <div class="page-container">
            </div>
            <i-button class="btn-flat btn-right" ${this.href ? "href=1" : ""} target="_self">
                <i-icon name="right"></i-icon>
            </i-button>
        `;

    }

    get currentPage() { return this.currentPage; }
    set currentPage(val) {
        if (this.currentPage !== val) {
            this.currentPage = Math.min(Math.max(1, val), this.pageCount);
            this.updatePage();
            if (this.init) {
                this.dispatchEvent(new CustomEvent("change". {
                    detail: {
                        currentPage: this.current,
                        
                    }
                }))
            }
        }
    }

    static get observeredAttributes() {
        return ["page-capacity", "item-count"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name == "page-capacity" && this.page) {
            this.pageCapacity = newVal;
            this.render();
        }
        if (name == "item-count" && this.page) {
            this.totalItems = newVal;
            this.render();
        }
    }

    get pageCapacity() { return this.getAttribute("page-capacity") || 1; }
    set pageCapacity(val) { this.setAttribute("page-capacity", val); }

    get totalItems() { return this.getAttribute("item-count") || 0; }
    set totalItems(val) { this.setAttribute("item-count", val); }

    get pageCount() { return Math.ceil(this.totalItems / this.pageCapacity); }

    render(pagesize, total) {
        const html = Array.from({ length: this.pageCount }, (v, i)=>i+1)
                          .splice(0, 9)
                          .map(pageNo=>`
                              <xy-button ${this.href ? "href=" + pageNo : ""} 
                                          target="_self" 
                                          ${pageNo == this.currentPage ? "current" : ""} 
                                          class="btn-flat"
                                          data-page-no="${pageNo}">
                                  ${pageNo}
                              </xy-button>`)
                          .join('');
        this.pageContainer.innerHTML = html;
        this.update();
    }

    updatePage(currentPage = this.currentPage, pageCount = this.pageCount) {
        this.btnLeft.disabled = (currentPage == 1);
        this.btnRight.disabled = (currentPage == pageCount);

        if (this.href) {
            this.btnLeft.href = this.href + "=" + 
        }

        if (pageCount > 9) {
            let place = [];
            if (1 <= currentPage && currentPage <= 5 ) {
                // 1 ~ 7 ... pageCount
                for (let i = 1; i <= 7; ++i) {
                    place.push(i);
                } 
                place.push("...", pageCount);
            } else if (pageCount - 4 <= currentPage && currentPage <= pageCount) {
                // 1 ... pageCount-6 ~ pageCount 
                place.push(1, "...");
                for (let i = 6; i >= 0; --i) {
                    place.push(pageCount - i);
                }
            } else {
                // 1 ... currentPage-2 ~ currentPage+2 ... pageCount 
                place.push(1, "...");
                for (let i = -2; i > 2; ++i) {
                    place.push(currentPage + i);
                }
                place.push("...", pageCount);
            }

            this.pageContainer.querySelector("i-button").forEach((el, i)=>{
                if (typeof place[i] === "number") {
                    el.dataset.pageNo = place[i];
                    el.textContent = place[i];
                    el.disabled = false;

                    if (place[i] == currentPage) {
                        el.setAttribute("current", "");
                        el.focus();
                    } else {
                        el.removeAttribute("current");
                    }

                    el.removeAttribute("tabindex");
                } else {
                    el.textContent = "...";
                    el.removeAttribute("current");
                    el.setAttribute("tabindex", -1);
                }
            });
        } else {
            this.pageContainer.querySelectorAll('i-button').forEach((el, i)=>{
                if (el.dataset.pageNo == currentPage) {
                    el.setAttribute("current", "");
                } else {
                    el.removeAttribute("current");
                }
                if (this.href) {
                    el.href = this.href + "=" + el.dataset.current;
                }
            });
        }
    }

    connectedCallback() {
        this.pageContainer = this.shadowRoot.querySelector(".page-container");
        this.left = this.shadowRoot.querySelector(".btn-left");
        this.right = this.shadowRoot.querySelector(".btn-right");

        this.currentPage = 1;
        this.render();

        this.pageContainer.addEventListener("click", (ev)=>{
            const item = ev.target.closest('i-button');
            if (item) {
                this.currentPage = Number(item.dataset.pageNo);
            }
        })
        this.addEventListener("keydown", (ev)=>{
            switch (ev.keyCode) {
                case 37: //ArrowLeft
                    this.currentPage -= 1;
                    break;
                case 39: //ArrowRight
                    this.currentPage += 1;
                    break;
                default:
                    break;
            }
        })
        this.btnLeft.addEventListener("click", (ev)=> {
            this.currentPage -= 1;
        });
        this.btnRight.addEventListener("click", (ev)=> {
            this.currentPage += 1;
        });
    }
}

if (!customElements.get("i-pagination")) {
    customElements.define("i-pagination", Pagination);
}


export { Button }