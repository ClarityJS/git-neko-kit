import { readJSON } from '@/common/utils'
import { pkgType } from '@/types'

export const pkg:pkgType = readJSON('package.json')
