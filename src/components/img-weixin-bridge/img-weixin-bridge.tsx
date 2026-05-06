import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'img-weixin-bridge',
  shadow: true,
})
export class ImgWeixinBridge {
  private imageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  private pressTimer: any;

  private triggerPreview = () => {
    const windowAny = window as any;
    if (windowAny.WeixinJSBridge) {
      console.log('Calling WeixinJSBridge imagePreview via long press');
      windowAny.WeixinJSBridge.invoke('imagePreview', {
        current: this.imageUrl,
        urls: [this.imageUrl],
      });
    } else {
      alert('Long press detected! In WeChat, this would open the native preview.');
      // window.location.href = this.imageUrl;
    }
  };

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) return;
    this.pressTimer = setTimeout(() => this.triggerPreview(), 800);
  };

  private handleTouchEnd = () => clearTimeout(this.pressTimer);
  private handleTouchMove = () => clearTimeout(this.pressTimer);

  private handleMouseDown = () => {
    this.pressTimer = setTimeout(() => this.triggerPreview(), 800);
  };

  private handleMouseUp = () => clearTimeout(this.pressTimer);
  private handleMouseLeave = () => clearTimeout(this.pressTimer);

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid orange', padding: '10px' }}>
          <p style={{ color: 'orange' }}>[Shadow DOM + WeixinJSBridge]</p>
          <p style={{ fontSize: '12px' }}>Long press image to trigger native preview:</p>
          <img
            src={this.imageUrl}
            onTouchStart={this.handleTouchStart}
            onTouchEnd={this.handleTouchEnd}
            onTouchMove={this.handleTouchMove}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
            style={{ width: '100px', height: '100px', cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none' }}
            alt="Long press me"
          />
        </div>
      </Host>
    );
  }
}
