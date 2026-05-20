import { Component, h } from '@stencil/core';

@Component({
  tag: 'parent-shadow',
  shadow: true,
})
export class ParentShadow {
  render() {
    return (
      <div style={{ border: '2px solid blue', padding: '10px' }}>
        <p style={{ color: 'blue', margin: '0 0 10px 0' }}>[Nested Layer 1: Shadow DOM]</p>
        <slot></slot>
      </div>
    );
  }
}
