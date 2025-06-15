import { readJSON } from '@/common/utils'
import type { PkgInfoType } from '@/types'

export const pkg: PkgInfoType = readJSON('package.json')
