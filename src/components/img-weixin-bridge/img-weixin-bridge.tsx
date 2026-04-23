import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'img-weixin-bridge',
  shadow: true,
})
export class ImgWeixinBridge {
  private imageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  private handleImageClick = () => {
    const windowAny = window as any;
    if (windowAny.WeixinJSBridge) {
      console.log('Calling WeixinJSBridge imagePreview');
      windowAny.WeixinJSBridge.invoke('imagePreview', {
        current: this.imageUrl,
        urls: [this.imageUrl],
      });
    } else {
      alert('Non-WeChat environment or WeixinJSBridge not ready. Redirecting...');
      window.location.href = this.imageUrl;
    }
  };

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid orange', padding: '10px' }}>
          <p style={{ color: 'orange' }}>[Shadow DOM + WeixinJSBridge]</p>
          <p style={{ fontSize: '12px' }}>Click image to trigger native preview:</p>
          <img
            src={this.imageUrl}
            onClick={this.handleImageClick}
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            alt="Click me"
          />
        </div>
      </Host>
    );
  }
}
