import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function copyOldWebsite() {
  return {
    name: 'copy-old-website',
    closeBundle() {
      const sourceDir = path.resolve(__dirname, 'mobile');
      const targetDir = path.resolve(__dirname, 'dist', 'mobile');

      if (!fs.existsSync(sourceDir)) {
        return;
      }

      fs.mkdirSync(path.dirname(targetDir), { recursive: true });
      fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
    }
  };
}

export default defineConfig({
  plugins: [react(), copyOldWebsite()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        caseStudies: path.resolve(__dirname, 'case-studies/index.html'),
        kpmgAnthropic: path.resolve(__dirname, 'case-studies/kpmg-anthropic-alliance/index.html'),
        scoutlineCapital: path.resolve(__dirname, 'partners/scoutline-capital/index.html'),
        privacyPolicy: path.resolve(__dirname, 'legal/privacy-policy.html'),
        termsConditions: path.resolve(__dirname, 'legal/terms-conditions.html'),
        loadingScreen: path.resolve(__dirname, 'loading-screen-v2.html'),
      }
    }
  }
});
