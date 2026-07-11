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
  plugins: [react(), copyOldWebsite()]
});
