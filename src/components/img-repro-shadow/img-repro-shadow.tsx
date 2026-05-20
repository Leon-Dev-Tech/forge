import { Component, h, Element } from '@stencil/core';

@Component({
  tag: 'img-repro-shadow',
  shadow: true,
})
export class ImgReproShadow {
  // 1. 获取当前组件的宿主元素
  @Element() el!: HTMLElement;

  // 2. 在组件挂载到 DOM 时执行注入逻辑
  connectedCallback() {
    // 通过宿主元素获取当前的 document 对象
    const doc = this.el.ownerDocument;

    // 确保 doc 存在，并且没有被劫持过（防止页面中有多个该组件导致重复劫持）
    if (doc && !(doc as any).__wechatShadowPatchApplied) {
      const originalElementFromPoint = doc.elementFromPoint;
      
      // 重写当前沙箱/微前端环境下的 document 的 elementFromPoint
      doc.elementFromPoint = function (x: number, y: number) {
        let element = originalElementFromPoint.call(doc, x, y);
        
        while (element && element.shadowRoot) {
          const shadowEl = element.shadowRoot.elementFromPoint(x, y);
          if (!shadowEl || shadowEl === element) {
            break;
          }
          element = shadowEl;
        }
        
        return element;
      };
      
      // 在当前的 doc 实例上打上标记
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
