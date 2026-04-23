import { Component, h } from '@stencil/core';

@Component({
  tag: 'parent-shadow',
  shadow: true,
})
export class ParentShadow {
  render() {
    return (
      <div style={{ border: '2px solid red', padding: '10px' }}>
        <p>[Parent: Shadow DOM]</p>
        <child-light></child-light>
      </div>
    );
  }
}
