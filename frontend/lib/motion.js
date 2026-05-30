export const motion = {
  duration: {
    fast: "140ms",
    normal: "220ms",
    slow: "320ms",
  },

  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.7, 0, 0.84, 0)",
  },

  fadeIn: {
    animation: "fade-in",
    duration: "220ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },

  scaleIn: {
    animation: "scale-in",
    duration: "220ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },

  slideRight: {
    animation: "slide-right",
    duration: "260ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },

  slideLeft: {
    animation: "slide-left",
    duration: "260ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

export const motionStyles = {
  fadeOverlay: {
    animation: "fade-in 220ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  modalEnter: {
    animation: "scale-in 220ms cubic-bezier(0.16, 1, 0.3, 1)",
    transformOrigin: "center",
  },

  drawerRight: {
    animation: "slide-right 260ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  drawerLeft: {
    animation: "slide-left 260ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};
