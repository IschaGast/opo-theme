import opoLight from './opo-light.json'
import opoDark from './opo-dark.json'

// Same shape as defineShikiSetup from @slidev/types, without the dependency.
export default function () {
  return {
    themes: {
      light: opoLight,
      dark: opoDark,
    },
  }
}
