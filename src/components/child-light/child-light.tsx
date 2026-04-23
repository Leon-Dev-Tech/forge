import { Component, h } from '@stencil/core';

@Component({
  tag: 'child-light',
  shadow: false,
})
export class ChildLight {
  render() {
    return (
      <div style={{ border: '2px dashed blue', padding: '10px' }}>
        <p>[Child: Light DOM]</p>
        <img 
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
          style={{ width: '80px', height: '80px' }} 
        />
      </div>
    );
  }
}
