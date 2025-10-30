import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Se quiser marcar visualmente como obrigatório
   */
  requiredMark?: boolean;
}

/**
 * Label minimalista compatível com o import `@/components/ui/label`
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", requiredMark = false, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={[
          "text-sm font-medium leading-none",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
        {requiredMark && <span className="ml-0.5 text-red-600">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

export default Label;
