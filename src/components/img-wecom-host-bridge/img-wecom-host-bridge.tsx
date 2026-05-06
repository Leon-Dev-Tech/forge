import { Component, h, Host, Prop, Element } from '@stencil/core';

@Component({
  tag: 'img-wecom-host-bridge',
  shadow: true,
})
export class ImgWecomHostBridge {
  @Element() el: HTMLElement;
  @Prop() src: string = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  disconnectedCallback() {
    this.el.dispatchEvent(new CustomEvent('WECOM_GHOST_UNREGISTER', { bubbles: true, composed: true }));
  }

  private handleImageLoad = () => {
    // We notify the Host application that this image needs a ghost element.
    // The Host will listen to this event, create the ghost image, and track the position.
    const event = new CustomEvent('WECOM_GHOST_REGISTER', {
      bubbles: true,
      composed: true,
      detail: {
        src: this.src,
        // Provide a callback so the host can get the exact bounding rect of the inner img
        getRect: () => {
          const innerImg = this.el.shadowRoot?.querySelector('img');
          return innerImg ? innerImg.getBoundingClientRect() : this.el.getBoundingClientRect();
        }
      }
    });
    this.el.dispatchEvent(event);
  };

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid teal', padding: '10px' }}>
          <p style={{ color: 'teal', margin: '0 0 10px 0', fontWeight: 'bold' }}>[MFE Event -&gt; Host Document Bridge]</p>
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>The MFE component emits an event. The Host application listens and creates the ghost image. Safe for code review.</p>
          <img
            src={this.src}
            style={{ width: '100px', height: '100px' }}
            alt="MFE Event Source"
            onLoad={this.handleImageLoad}
          />
          <p style={{ fontSize: '12px', margin: '0 0 10px 0' }}>another img to compare</p>
          <img
            src={this.src}
            style={{ width: '100px', height: '100px' }}
            alt="MFE Event Source"
          />
        </div>
      </Host>
    );
  }
}
