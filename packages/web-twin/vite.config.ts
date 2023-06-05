import { genViteConfig, GlobalConfigKeyEnum } from '../../config/vite'
import { defineConfig } from 'vite'

export default defineConfig(
  genViteConfig({
    name: GlobalConfigKeyEnum.twin
  })
)
