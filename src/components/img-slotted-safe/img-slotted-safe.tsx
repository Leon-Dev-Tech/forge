import { Component, h, Host, Element, Prop, State } from '@stencil/core';

/**
 * Solution: Slotted Light DOM Image
 * 
 * This component solves the WeChat/WeCom Shadow DOM image recognition issue by 
 * placing the <img> element in the Light DOM (as a child of the host element) 
 * and projecting it into the Shadow DOM via a <slot>.
 * 
 * Since the <img> is technically in the Light DOM, WeChat's native long-press 
 * detection can "see" it and show the save/preview menu.
 */
@Component({
  tag: 'img-slotted-safe',
  styleUrl: 'img-slotted-safe.css',
  shadow: true,
})
export class ImgSlottedSafe {
  @Element() el: HTMLElement;

  @Prop() src: string;
  @Prop() alt: string = '';

  @State() isLoaded = false;

  private imgEl: HTMLImageElement;

  componentWillLoad() {
    this.createLightImage();
  }

  componentDidUpdate() {
    if (this.imgEl && this.imgEl.src !== this.src) {
      this.imgEl.src = this.src;
    }
    if (this.imgEl && this.imgEl.alt !== this.alt) {
      this.imgEl.alt = this.alt;
    }
  }

  disconnectedCallback() {
    if (this.imgEl) {
      this.imgEl.remove();
      this.imgEl = null;
    }
  }

  private createLightImage() {
    const doc = this.el.ownerDocument || document;
    this.imgEl = doc.createElement('img');
    this.imgEl.src = this.src;
    this.imgEl.alt = this.alt;
    
    // We apply styles to ensure it fills the slot correctly
    this.imgEl.style.width = '100%';
    this.imgEl.style.height = '100%';
    this.imgEl.style.display = 'block';
    this.imgEl.style.objectFit = 'contain';
    
    this.imgEl.onload = () => {
      this.isLoaded = true;
    };

    // Append to Light DOM
    this.el.appendChild(this.imgEl);
  }

  render() {
    return (
      <Host>
        <div class={{ 'img-container': true, 'is-loaded': this.isLoaded }}>
          <slot></slot>
          {!this.isLoaded && <div class="placeholder">Loading...</div>}
        </div>
      </Host>
    );
  }
}
