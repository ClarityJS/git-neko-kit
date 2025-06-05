declare module 'language-colors' {
  import type Color from '@types/color'

  interface LanguageColors {
    [language: string]: Color
  }

  const colors: LanguageColors
  export default colors
}
