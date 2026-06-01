/* ─────────────────────────────────────────────
   BrandIcons — La Bulle de Marion
   Icônes officielles de la charte graphique
   (fleur, gouttes, trèfle, nuage, petits pieds).

   Les fichiers sources sont des silhouettes : on les
   affiche via "mask" pour pouvoir les colorer librement
   avec la prop `color` (blanc dans les pastilles, terracotta
   sur fond clair, etc.). L'API reste identique : size + color.
───────────────────────────────────────────── */

import iconFlower from "../../assets/icons/icon-flower.png";
import iconDrops  from "../../assets/icons/icon-drops.png";
import iconClover from "../../assets/icons/icon-clover.png";
import iconFeet   from "../../assets/icons/icon-feet.png";
import iconCloud  from "../../assets/icons/icon-cloud.png";

const DEFAULT_COLOR = "#a2381c"; // terracotta

function MaskIcon({ url, size = 40, color = DEFAULT_COLOR }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export const IconFlower = (props) => <MaskIcon url={iconFlower} {...props} />;
export const IconDrops  = (props) => <MaskIcon url={iconDrops}  {...props} />;
export const IconClover = (props) => <MaskIcon url={iconClover} {...props} />;
export const IconFeet   = (props) => <MaskIcon url={iconFeet}   {...props} />;
export const IconCloud  = (props) => <MaskIcon url={iconCloud}  {...props} />;
