import { readJSON } from '@/common/utils'
import { PkgInfoType } from '@/types'

export const pkg: PkgInfoType = readJSON<PkgInfoType>('package.json')
