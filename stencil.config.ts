import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'forge',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      baseUrl: '/',
      copy: [
        { 
          src: 'WW_verify_N1fhFLFTuKySnqAt.txt',   // 这里的路径相对于 src 目录
          dest: 'WW_verify_N1fhFLFTuKySnqAt.txt'   // 这里的路径相对于 www 产物根目录
        }
      ]
    },
  ],
};
