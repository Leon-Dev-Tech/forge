import { Component, h } from '@stencil/core';

@Component({
  tag: 'img-repro-light',
  shadow: false
})
export class ImgReproLight {
  render() {
    return (
      <div style={{ border: '1px solid blue', padding: '10px' }}>
        <p style={{ color: 'blue' }}>[Light DOM + Real URL]</p>
        <img 
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
          alt="Light DOM" 
          style={{ width: '100px', height: '100px' }} 
        />
      </div>
    );
  }
}
