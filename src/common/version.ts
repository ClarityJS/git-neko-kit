import { readJSON } from '@/common/utils'
import { PkgInfoType } from '@/types'

export const pkg: PkgInfoType = await readJSON('package.json')
