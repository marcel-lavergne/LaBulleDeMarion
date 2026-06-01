/* ─────────────────────────────────────────────
   Button — La Bulle de Marion
   Variants : fill | outline | ghost
───────────────────────────────────────────── */

import styles from "./Button.module.css";

/**
 * @param {object} props
 * @param {"fill"|"outline"|"ghost"} props.variant
 * @param {"sm"|"md"} props.size
 * @param {function} props.onClick
 * @param {boolean} props.fullWidth
 */
export default function Button({
  children,
  variant = "fill",
  size = "md",
  onClick,
  fullWidth = false,
  type = "button",
  className = "",
}) {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    fullWidth ? styles["btn--full"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
