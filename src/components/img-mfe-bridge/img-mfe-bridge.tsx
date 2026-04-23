import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'img-mfe-bridge',
  shadow: true,
})
export class ImgMfeBridge {
  private imageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  private handleImageClick = () => {
    try {
      // 1. 尝试使用 globalThis (现代浏览器标准，通常不被微前端简单拦截)
      // 2. 如果 globalThis 也不行，可以使用 (0, eval)('this') 获取真正的全局上下文
      const safeGlobal = (typeof globalThis !== 'undefined') 
        ? globalThis 
        : (new Function('return this'))();

      const bridge = (safeGlobal as any).WeixinJSBridge;

      if (bridge) {
        bridge.invoke('imagePreview', {
          current: this.imageUrl,
          urls: [this.imageUrl],
        });
      } else {
        // 兜底逻辑：如果不是微信环境，则尝试静默跳转
        location.href = this.imageUrl;
      }
    } catch (e) {
      console.error('MFE Bridge Error:', e);
    }
  };

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid cyan', padding: '10px' }}>
          <p style={{ color: 'darkcyan' }}>[Shadow DOM + MFE Safe Bridge]</p>
          <p style={{ fontSize: '12px' }}>Uses globalThis to bypass window restriction:</p>
          <img
            src={this.imageUrl}
            onClick={this.handleImageClick}
            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            alt="MFE Safe Click"
          />
        </div>
      </Host>
    );
  }
}
