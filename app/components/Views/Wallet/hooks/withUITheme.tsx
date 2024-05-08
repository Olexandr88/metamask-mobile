/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
export default function withUITheme(theme: string) {
  switch (theme) {
    case 'default':
      return require('../themes/01').default;
    case 'custom01':
      return require('../themes/02').default;
    case 'custom02':
      return require('../themes/03').default;
    default:
      return require('../themes/01').default;
  }
}
