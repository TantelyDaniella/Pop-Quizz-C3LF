import { createPortal } from "react-dom";
import type { ReactNode, ReactPortal } from "react";

type Props = { children: ReactNode; target?: Element | null };

export const Portal = ({ children, target = document.body }: Props): ReactPortal | null => {
  if (!target) return null;
  return createPortal(children, target);
};
