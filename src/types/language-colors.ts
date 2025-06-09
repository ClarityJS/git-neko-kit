declare module 'language-colors' {
  import type Color from 'color'

  interface LanguageColors {
    [language: string]: Color
  }

  const colors: LanguageColors
  export default colors
}
