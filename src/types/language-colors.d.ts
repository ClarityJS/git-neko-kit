declare module 'language-colors' {
  import { Color } from 'color'

  interface LanguageColors {
    [language: string]: Color
  }

  const colors: LanguageColors
  export default colors
}
