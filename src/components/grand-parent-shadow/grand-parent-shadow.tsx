import { Component, h } from '@stencil/core';

@Component({
  tag: 'grand-parent-shadow',
  shadow: true,
})
export class GrandParentShadow {
  render() {
    return (
      <div style={{ border: '2px solid green', padding: '10px' }}>
        <p style={{ color: 'green', margin: '0 0 10px 0' }}>[Nested Layer 2: Shadow DOM]</p>
        <slot></slot>
      </div>
    );
  }
}
