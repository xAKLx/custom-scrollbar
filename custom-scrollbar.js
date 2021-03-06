import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * `custom-scrollbar`
 * Implementation of a custom scrollbar based on simplebar
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class CustomScrollbar extends PolymerElement {
  static get template() {
    return html`
  <div class="data-simplebar">
    <div class="simplebar-mask">
      <div id="simplebar-offset" style="right: -17px;">
        <div id="simplebar-content-wrapper">
          <div class="simplebar-content">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  
    <div class="simplebar-track simplebar-vertical">
      <div id="simplebar-scrollbar" style="height: 689px; top: 0; ">
      </div>
    </div>
  </div>
  
  <style>
  .data-simplebar {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .simplebar-mask {
    position: absolute;
    overflow: hidden;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  
  #simplebar-offset {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  
  #simplebar-content-wrapper {
    height: 100%;
    overflow: auto;
  }
  
  .simplebar-track.simplebar-vertical {
    top: 0;
    width: 11px;
  }
  
  .simplebar-track {
    position: absolute;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
  
  .simplebar-track.simplebar-vertical #simplebar-scrollbar::before {
    top: 2px;
    bottom: 2px;
  }
  
  .simplebar-track #simplebar-scrollbar.simplebar-visible::before {
    opacity: 0.5;
    transition: opacity 0s linear;
  }
  
  .simplebar-track #simplebar-scrollbar.simplebar-invisible::before {
    opacity: 0;
    transition: opacity 0s linear;
  }
  
  #simplebar-scrollbar::before {
    position: absolute;
    content: '';
    background: black;
    border-radius: 7px;
    left: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s linear;
  }
  
  #simplebar-scrollbar {
    position: absolute;
    right: 2px;
    width: 7px;
    min-height: 10px;
  }
  </style>
    `;
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback();

    this._scroll = this.shadowRoot.getElementById('simplebar-content-wrapper');
    this.scrollBar = this.shadowRoot.getElementById('simplebar-scrollbar');
    this.scrollBarOffset = this.shadowRoot.getElementById('simplebar-offset');
    this.updateScrollbar = this.updateScrollbar.bind(this);

    window.addEventListener('resize', this.updateScrollbar);
    window.addEventListener('load', this.updateScrollbar);

    const config = { attributes: true, childList: true, subtree: true };
    this._observer = new MutationObserver(this.updateScrollbar);
    this._observer.observe(this, config);
    
    this.updateScrollbar();
  }

  updateScrollbar() {
    const {_scroll: scroll, scrollBar, scrollBarOffset} = this;
    const height = scroll.getBoundingClientRect().height;

    const scrollBarHeightPercentage = (100 * (height / scroll.scrollHeight));
    scrollBar.style.height = scrollBarHeightPercentage + '%';

    const maxScrollTop = scroll.scrollHeight - height;

    if (maxScrollTop < 1) {
      scroll.onscroll = null;
      scrollBar.className = "simplebar-invisible";
      scrollBarOffset.style.removeProperty('right');
    } else {
      scroll.onscroll = () => {
        const scrollPercentage = scroll.scrollTop / maxScrollTop;
        scrollBar.style.top = `${(100 - scrollBarHeightPercentage) * scrollPercentage}%`;
      }
      scroll.onscroll();
      scrollBar.className = "simplebar-visible";
      scrollBarOffset.style.right = "-17px";
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }
}

window.customElements.define('custom-scrollbar', CustomScrollbar);
