import { ViewEvent } from "types";
import { bezier } from "./bezier";

const slideIn = bezier(0.25, 1, 0.5, 1);

export const closeTabAnimationConfig: ViewEvent = {
  duration: 400,
  start(closeView, activeView) {
    const closeStyle = closeView.ref.style;
    const activeStyle = activeView?.ref.style;
    closeStyle.display = "1";
    if (activeStyle) {
      activeStyle.display = "block";
      activeStyle.opacity = "1";
    }
  },
  animate(t, closeView, activeView) {
    const closeStyle = closeView.ref.style;
    const activeStyle = activeView?.ref.style;

    const p = slideIn(t);
    closeStyle.transform = `translateX(${p * 100}%)`;
    if (activeStyle) {
      activeStyle.filter = `brightness(${t * 20 + 80}%)`;
      activeStyle.transform = `translateX(${(p - 1) * 0.2 * 100}%)`;
    }
  },
  end(closeView, activeView) {
    const closeStyle = closeView.ref.style;
    const activeStyle = activeView?.ref.style;

    closeStyle.opacity = "0";
    closeStyle.display = "none";
    if (activeStyle) {
      activeStyle.opacity = "1";
    }
  },
};

export const openTabAnimationConfig: ViewEvent = {
  duration: 300,
  start(newView) {
    const newViewStyle = newView.ref.style;
    newViewStyle.display = "block";
    newViewStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newViewStyle = newView.ref.style;
    const prevViewStyle = prevView?.ref.style;

    if (prevViewStyle) {
      prevViewStyle.opacity = `${1 - t}`;
    }
    newViewStyle.opacity = `${t}`;
  },
  end(newView, prevView) {
    const prevViewStyle = prevView?.ref.style;
    if (prevViewStyle) {
      prevViewStyle.display = "none";
    }
  },
};

export const onEnterContainerConfig: ViewEvent = {
  duration: 300,
  animate(t, activeView) {
    const activeViewStyle = activeView.ref.style;
    activeViewStyle.opacity = `${0.5 + 0.5 * t}`;
  },
};

export const onLeaveContainerConfig: ViewEvent = {
  duration: 500,
  start() {},
  animate() {},
  end() {},
};

export const activateTabConfig: ViewEvent = {
  duration: 200,
  start(newView) {
    const newStyle = newView.ref.style;
    newStyle.display = "block";
    // newStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newStyle = newView.ref.style;
    const prevStyle = prevView?.ref.style;
    newStyle.opacity = `${t}`;
    if (prevStyle) {
      prevStyle.opacity = `${1 - t}`;
    }
  },
  end(newView, prevView) {
    const prevViewStyle = prevView?.ref.style;
    if (prevViewStyle) {
      prevViewStyle.opacity = "1";
      // prevViewStyle.display = "none";
    }
  },
};

export const activateTabConfig2: ViewEvent = {
  duration: 200,
  start(newView, prevView) {
    const newStyle = newView.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newStyle = newView.ref.style;
    const prevStyle = prevView?.ref.style;
    newStyle.opacity = `${t}`;
    if (prevStyle) {
      prevStyle.opacity = `${1 - t}`;
    }
  },
  end(newView, prevView) {
    const prevViewStyle = prevView?.ref.style;
    if (prevViewStyle) {
      prevViewStyle.display = "none";
    }
  },
};

export const openTabContainerConfig: ViewEvent = {
  duration: 400,
  start(newView, prevView) {
    const newStyle = newView.ref.style;
    const prevStyle = prevView?.ref?.style;
    newStyle.display = "block";
    newStyle.zIndex = "2";
    newStyle.transform = "translateX(100%)";

    if (prevStyle) {
      prevStyle.zIndex = "1";
    }
  },
  animate(t, newView, prevView) {
    const p = slideIn(t);
    const newStyle = newView.ref.style;
    const prevStyle = prevView?.ref?.style;
    newStyle.transform = `translateX(${100 * (1 - p)}%)`;

    if (prevStyle) {
      prevStyle.transform = `translateX(${-p * 100 * 0.2}%)`;
      prevStyle.filter = `brightness(${(1 - t) * 20 + 80}%)`;
    }
  },
  end(newView, prevView) {
    const prevStyle = prevView?.ref?.style;
    if (prevStyle) {
      prevStyle.display = "block";
    }
  },
};

export const onEnterTabContainerConfig: ViewEvent = {
  duration: 400,
  start() {},
  animate() {},
  end() {},
};

export const openPartialTabAnimationConfig: ViewEvent = {
  duration: 300,
  start(newView) {
    const newStyle = newView.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newStyle = newView.ref.style;
    const prevViewStyle = prevView?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevViewStyle) {
      prevViewStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const activePartialTabAnimationConfig: ViewEvent = {
  duration: 300,
  start(newView) {
    const newStyle = newView.ref.style;
    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newStyle = newView.ref.style;
    const prevViewStyle = prevView?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevViewStyle) {
      prevViewStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const leaveContainerMasterTabAnimationConfig: ViewEvent = {
  duration: 300,
  start(newView) {
    const newStyle = newView.ref.style;

    newStyle.display = "block";
    newStyle.opacity = "0";
  },
  animate(t, newView, prevView) {
    const newStyle = newView.ref.style;
    const prevViewStyle = prevView?.ref.style;

    newStyle.opacity = `${t}`;
    if (prevViewStyle) {
      prevViewStyle.opacity = `${1 - t / 2}`;
    }
  },
};

export const onOpenToastConfig: ViewEvent = {
  duration: 300,
  start(newView) {
    const newViewStyle = newView.ref.style;
    newViewStyle.position = "relative";
    newViewStyle.zIndex = "1";
    newViewStyle.opacity = "0";
  },
  animate(t, newView) {
    const newViewStyle = newView.ref.style;
    newViewStyle.opacity = `${t}`;
  },
};

export const onCloseToastConfig: ViewEvent = {
  duration: 300,
  start(closeView) {
    const closedViewStyle = closeView.ref.style;
    closedViewStyle.zIndex = "0";
  },
  animate(t, closeView) {
    const p = slideIn(t);
    const closedViewStyle = closeView.ref.style;
    closedViewStyle.opacity = `${1 - t}`;
    const offsetHeight = closeView.ref.offsetHeight;
    closedViewStyle.marginTop = `${-offsetHeight * p}px`;
  },
  end() {},
};
