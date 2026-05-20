// import { Component, h } from '@stencil/core';

// @Component({
//   tag: 'img-repro-shadow',
//   shadow: true,
// })
// export class ImgReproShadow {
//   render() {
//     return (
//       <div style={{ border: '1px solid red', padding: '10px' }}>
//         <p style={{ color: 'red' }}>[Shadow DOM + Real URL]</p>
//         <img 
//           src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
//           alt="Shadow DOM" 
//           style={{ width: '100px', height: '100px' }} 
//         />
//       </div>
//     );
//   }
// }

import { Component, h } from '@stencil/core';

// --- 开始注入：穿透 Shadow DOM 的全局垫片 ---
// 1. 确保在浏览器环境下执行 (避免在 Stencil SSR/Prerender 时报错)
// 2. 使用 __wechatShadowPatchApplied 防止如果有多个文件引入此代码时发生重复劫持
if (typeof document !== 'undefined' && !(document as any).__wechatShadowPatchApplied) {
  const originalElementFromPoint = document.elementFromPoint;
  
  document.elementFromPoint = function (x: number, y: number) {
    // 先获取 Light DOM 里的最外层元素
    let el = originalElementFromPoint.call(document, x, y);
    
    // 如果元素存在且包含 shadowRoot，则继续往里层探测
    while (el && el.shadowRoot) {
      const shadowEl = el.shadowRoot.elementFromPoint(x, y);
      // 如果探测不到更深层的元素，或者返回的就是自己，说明到底了，停止穿透
      if (!shadowEl || shadowEl === el) {
        break;
      }
      el = shadowEl;
    }
    
    return el; // 最终返回穿透到最底层的元素（如 <img>）
  };
  
  // 打上标记，保证全局只执行一次
  (document as any).__wechatShadowPatchApplied = true;
}
// --- 注入结束 ---

@Component({
  tag: 'img-repro-shadow',
  shadow: true,
})
export class ImgReproShadow {
  render() {
    return (
      <div style={{ border: '1px solid red', padding: '10px' }}>
        <p style={{ color: 'red' }}>[Shadow DOM + Real URL + 修复微信]</p>
        <img 
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
          alt="Shadow DOM" 
          style={{ width: '100px', height: '100px' }} 
        />
      </div>
    );
  }
}
