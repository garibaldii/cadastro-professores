import * as React from "react";

/**
 * Componente Card minimalista (compatível com o import `@/components/ui/card`)
 * — Não depende de nenhuma lib externa.
 */
export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-xl border border-neutral-200 bg-white shadow-sm",
        "dark:border-neutral-800 dark:bg-neutral-900",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

// Exports opcionais para compatibilidade futura com shadcn/ui (se quiser usar)
export function CardHeader({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4", className].join(" ")} {...props} />;
}
export function CardContent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["p-4 pt-0", className].join(" ")} {...props} />;
}
export function CardFooter({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["p-4 pt-0 flex items-center justify-end", className].join(" ")}
      {...props}
    />
  );
}
export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={["text-base font-semibold leading-none", className].join(" ")} {...props} />
  );
}
export function CardDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={["text-sm text-neutral-500", className].join(" ")} {...props} />
  );
}
