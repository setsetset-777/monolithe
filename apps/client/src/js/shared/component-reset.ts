import styles from '../../styles/component-reset.scss?inline'

export const resetSheet = new CSSStyleSheet()
resetSheet.replaceSync(styles)
