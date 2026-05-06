import { Component, h, Host, Prop, Element } from '@stencil/core';

@Component({
  tag: 'img-wecom-document',
  shadow: true,
})
export class ImgWecomDocument {
  @Element() el: HTMLElement;
  @Prop() src: string = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  private ghostImage: HTMLImageElement;
  private resizeObserver: ResizeObserver;
  private boundUpdatePosition: () => void;

  componentDidLoad() {
    this.boundUpdatePosition = this.updateGhostPosition.bind(this);
    this.createGhostImage();
    this.setupTracking();
  }

  disconnectedCallback() {
    this.cleanupGhostImage();
  }

  private createGhostImage() {
    // Use ownerDocument to avoid direct 'document' global variable usage
    const doc = this.el.ownerDocument;
    if (!doc) return;

    this.ghostImage = doc.createElement('img');
    this.ghostImage.src = this.src;
    // Position fixed makes it easy to stick to the viewport position provided by getBoundingClientRect()
    this.ghostImage.style.position = 'fixed';
    // Opacity 0.01 is visually invisible but often passes browser/WeChat hit-test checks for image saving
    this.ghostImage.style.opacity = '0.01'; 
    this.ghostImage.style.zIndex = '999999';
    this.ghostImage.style.pointerEvents = 'auto'; // Must receive touch events to trigger long-press
    this.ghostImage.style.transition = 'none'; // Ensure no delay when moving
    this.ghostImage.style.userSelect = 'none';
    this.ghostImage.style.webkitUserSelect = 'none';
    
    // Optional: add some inline identifier for debugging
    this.ghostImage.setAttribute('data-wecom-ghost', 'true');

    // Forward clicks back to the original element if needed
    this.ghostImage.addEventListener('click', (e) => {
      this.el.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true, detail: e }));
    });

    doc.body.appendChild(this.ghostImage);
  }

  private updateGhostPosition = () => {
    if (!this.ghostImage) return;
    
    // Get the inner img element's rect
    const innerImg = this.el.shadowRoot?.querySelector('img');
    if (!innerImg) return;

    const rect = innerImg.getBoundingClientRect();
    
    // If it's not visible (e.g., width 0 or out of viewport), hide the ghost
    if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > (window.innerHeight || document.documentElement.clientHeight)) {
      this.ghostImage.style.display = 'none';
      return;
    }
    
    this.ghostImage.style.display = 'block';
    this.ghostImage.style.top = `${rect.top}px`;
    this.ghostImage.style.left = `${rect.left}px`;
    this.ghostImage.style.width = `${rect.width}px`;
    this.ghostImage.style.height = `${rect.height}px`;
  };

  private setupTracking() {
    const globalWin = typeof window !== 'undefined' ? window : (globalThis as any);
    
    // 1. Listen to scroll events on window to update fixed position
    globalWin.addEventListener('scroll', this.boundUpdatePosition, { passive: true, capture: true });
    globalWin.addEventListener('resize', this.boundUpdatePosition, { passive: true });

    // 2. Use ResizeObserver on the host to detect size changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.boundUpdatePosition();
      });
      this.resizeObserver.observe(this.el);
    }
    
    // Initial sync
    setTimeout(this.boundUpdatePosition, 100);
  }

  private cleanupGhostImage() {
    if (this.ghostImage && this.ghostImage.parentNode) {
      this.ghostImage.parentNode.removeChild(this.ghostImage);
      this.ghostImage = null;
    }
    const globalWin = typeof window !== 'undefined' ? window : (globalThis as any);
    globalWin.removeEventListener('scroll', this.boundUpdatePosition, { capture: true });
    globalWin.removeEventListener('resize', this.boundUpdatePosition);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid blue', padding: '10px' }}>
          <p style={{ color: 'blue', margin: '0 0 10px 0', fontWeight: 'bold' }}>[Document Ghost Image (WeCom Hack)]</p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>A transparent ghost image is mounted to <code>ownerDocument.body</code> over this image. Long-press should work natively in WeCom.</p>
          <img
            src={this.src}
            style={{ width: '100px', height: '100px' }}
            alt="Original inside Shadow DOM"
            onLoad={this.boundUpdatePosition}
          />
        </div>
      </Host>
    );
  }
}
