import { Component, h, Element } from '@stencil/core';

@Component({
  tag: 'img-repro-shadow',
  shadow: true,
})
export class ImgReproShadow {
  @Element() el!: HTMLElement;

  connectedCallback() {
    const doc = this.el.ownerDocument;

    // 确保 doc 存在，且未被劫持过
    if (doc && !(doc as any).__wechatShadowPatchApplied) {
      const originalElementFromPoint = doc.elementFromPoint;
      
      doc.elementFromPoint = function (x: number, y: number) {
        // 1. 获取原生默认返回的最外层元素
        let hostEl = originalElementFromPoint.call(doc, x, y);
        let deepEl = hostEl;
        
        // 2. 潜入 Shadow DOM 探测最深处的节点
        while (deepEl && deepEl.shadowRoot) {
          const shadowEl = deepEl.shadowRoot.elementFromPoint(x, y);
          if (!shadowEl || shadowEl === deepEl) {
            break;
          }
          deepEl = shadowEl;
        }
        
        // 3. 核心防御机制：
        // 只有当最深处的元素确实是一张图片时，才返回它给微信；
        // 否则（点击的是容器、文字等），仍然返回最外层的宿主元素，维持 Shadow DOM 封装
        if (deepEl && deepEl.tagName && deepEl.tagName.toLowerCase() === 'img') {
          return deepEl;
        }
        
        return hostEl;
      };
      
      (doc as any).__wechatShadowPatchApplied = true;
    }
  }

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
