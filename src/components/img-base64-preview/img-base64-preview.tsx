import { Component, h, Host, State, Prop } from '@stencil/core';

@Component({
  tag: 'img-base64-preview',
  shadow: true,
})
export class ImgBase64Preview {
  @Prop() initialSrc: string = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  @State() currentUrl: string = '';
  @State() base64Data: string = '';
  @State() loading: boolean = false;
  @State() error: string = '';
  @State() useCredentials: boolean = false; // 默认不携带 Cookie 以免触发公网图片的 CORS 限制

  componentWillLoad() {
    this.currentUrl = this.initialSrc;
  }

  private async loadImageAsBase64() {
    if (!this.currentUrl) {
      this.error = 'Please enter a valid URL';
      return;
    }

    this.loading = true;
    this.error = '';
    this.base64Data = '';
    
    try {
      console.log('Fetching image from:', this.currentUrl, 'with credentials:', this.useCredentials);
      
      const fetchOptions: RequestInit = { 
        mode: 'cors'
      };

      // 只有在用户勾选时才添加 credentials，避免触发 Access-Control-Allow-Origin: * 的限制
      if (this.useCredentials) {
        fetchOptions.credentials = 'include';
      }
      
      const response = await fetch(this.currentUrl, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result.startsWith('data:image')) {
          this.base64Data = result;
        } else {
          this.error = 'Fetched content is not a valid image';
        }
        this.loading = false;
      };
      
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Fetch error:', err);
      this.error = `${err.message}. ${this.useCredentials ? '(Note: Credentials are ON, server must not use "*" for CORS origin)' : ''}`;
      this.loading = false;
    }
  }

  private handleImageClick = () => {
    if (!this.base64Data) return;
    const windowAny = window as any;
      console.log(this.base64Data)
    if (windowAny.WeixinJSBridge) {
      windowAny.WeixinJSBridge.invoke('imagePreview', {
        current: this.base64Data,
        urls: [this.base64Data],
      });
    } else {
      alert('Base64 ready! In WeChat, this would open the native preview.');
    }
  };

  render() {
    return (
      <Host>
        <div style={{ border: '2px solid purple', padding: '15px', borderRadius: '8px', background: '#fff' }}>
          <p style={{ color: 'purple', fontWeight: 'bold', margin: '0 0 10px 0' }}>[Base64 Preview Tester]</p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Image URL:</label>
            <input 
              type="text" 
              value={this.currentUrl} 
              onInput={(e) => this.currentUrl = (e.target as HTMLInputElement).value}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id="useCreds" 
                checked={this.useCredentials} 
                onChange={(e) => this.useCredentials = (e.target as HTMLInputElement).checked} 
              />
              <label htmlFor="useCreds" style={{ fontSize: '12px', marginLeft: '5px', cursor: 'pointer' }}>
                Include Credentials (Cookies) - <i>Turn OFF for public images like GitHub/Baidu</i>
              </label>
            </div>

            <button 
              onClick={() => this.loadImageAsBase64()} 
              disabled={this.loading}
              style={{ 
                marginTop: '10px', padding: '8px 16px', background: 'purple', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
                opacity: this.loading ? '0.6' : '1'
              }}
            >
              {this.loading ? 'Converting...' : 'Convert to Base64'}
            </button>
          </div>

          {this.error && (
            <div style={{ color: 'red', fontSize: '11px', background: '#fff0f0', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}>
              {this.error}
            </div>
          )}
          
          <div style={{ textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
            {this.base64Data ? (
              <div>
                <p style={{ fontSize: '12px', color: 'green', marginBottom: '8px' }}>✓ Success! Click image to preview.</p>
                <img
                  src={this.base64Data}
                  onClick={this.handleImageClick}
                  style={{ maxWidth: '100%', maxHeight: '150px', cursor: 'pointer' }}
                />
              </div>
            ) : (
              <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', border: '1px dashed #ccc' }}>
                Preview Area
              </div>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
