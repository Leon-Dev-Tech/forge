import { Component, h } from '@stencil/core';

@Component({
  tag: 'img-repro-shadow',
  shadow: true,
})
export class ImgReproShadow {
  render() {
    return (
      <div style={{ border: '1px solid red', padding: '10px' }}>
        <p style={{ color: 'red' }}>[Shadow DOM + Real URL]</p>
        <img 
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
          alt="Shadow DOM" 
          style={{ width: '100px', height: '100px' }} 
        />
      </div>
    );
  }
}
