import { cn } from "@/lib/utils";

type TextProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * Eyebrow / label above a section heading — e.g. "01", "lightweight", "get started".
 * Adjust text-xs / color here to change every instance across the landing.
 */
export function SectionEyebrow({ className, ...props }: TextProps) {
  return (
    <p className={cn("text-xs text-primary", className)} {...props} />
  );
}

/**
 * Body paragraph for landing sections.
 * Adjust text-xs / leading-relaxed here to change every instance across the landing.
 */
export function SectionBody({ className, ...props }: TextProps) {
  return (
    <p
      className={cn("text-xs leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}
