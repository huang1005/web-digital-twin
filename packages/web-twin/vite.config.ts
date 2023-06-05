import { defineConfig } from 'vite'
import { GlobalConfigKeyEnum, genViteConfig } from '../../config/vite'

export default defineConfig(
  genViteConfig({
    name: GlobalConfigKeyEnum.twin,
  }),
)
