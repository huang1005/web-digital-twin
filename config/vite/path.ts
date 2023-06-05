import path from 'node:path'

const ROOT = path.resolve(__dirname, '../../')
const ASSETS = path.resolve(ROOT, './asserts')
const PACKAGRS = path.resolve(ROOT, './packages')
const digit = path.resolve(PACKAGRS, './web-digit')
const twin = path.resolve(PACKAGRS, './web-twin')

export const PATHS = {
  ROOT,
  PACKAGRS,
  ASSETS,
  digit,
  twin,
}
