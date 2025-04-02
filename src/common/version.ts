import { readJSON } from '@/common/utils'
import { pkgType } from '@/types'

export const pkg: pkgType = readJSON<pkgType>('package.json')
