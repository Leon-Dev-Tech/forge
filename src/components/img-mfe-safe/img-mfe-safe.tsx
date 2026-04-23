import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'img-mfe-safe',
  shadow: true,
})
export class ImgMfeSafe {
  private imageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid purple', padding: '10px' }}>
          <p style={{ color: 'purple' }}>[Shadow DOM + MFE Safe (No Window)]</p>
          <p style={{ fontSize: '12px' }}>Try clicking the image below:</p>
          
          {/* 方案 A: 纯 HTML 链接包裹 */}
          <a href={this.imageUrl} target="_blank" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <img
              src={this.imageUrl}
              style={{ width: '100px', height: '100px', border: '1px solid #ccc' }}
              alt="MFE Safe Image"
            />
            <p style={{ fontSize: '10px', textAlign: 'center', margin: '5px 0' }}>Click to Open Original</p>
          </a>
        </div>
      </Host>
    );
  }
}
