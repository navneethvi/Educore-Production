import { useEffect } from "react";
import { useAnimate, stagger, DOMSegmentWithTransition, MotionValueSegmentWithTransition } from "framer-motion";

function useSidebarAnimation(isCollapsed: boolean) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sidebarAnimations: Array<DOMSegmentWithTransition | MotionValueSegmentWithTransition> = isCollapsed
      ? [
          [
            ".sidebar-container",
            { width: "4rem" }, // collapsed width
            { ease: "easeOut", duration: 0.3 }
          ],
          [
            "li",
            { opacity: 0, scale: 0.5, filter: "blur(10px)" },
            { delay: stagger(0.05, { from: "last" }), ease: "easeOut" }
          ]
        ]
      : [
          [
            ".sidebar-container",
            { width: "15rem" }, // expanded width
            { ease: "easeOut", duration: 0.3 }
          ],
          [
            "li",
            { opacity: 1, scale: 1, filter: "blur(0px)" },
            { delay: stagger(0.05), ease: "easeOut" }
          ]
        ];

    animate(sidebarAnimations);
  }, [isCollapsed, animate]);

  return scope;
}

export default useSidebarAnimation;
