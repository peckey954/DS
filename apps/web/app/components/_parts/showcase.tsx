import { cn } from "@repo/ui/lib/utils";

/** หัวข้อหมวด + กริดของ demo ข้างใน */
export function Section({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {hint ? (
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** กล่อง demo 1 component — หัวกล่องคือชื่อไฟล์ใน @repo/ui/components/ui */
export function Demo({
  name,
  hint,
  wide,
  bodyClassName,
  children,
}: {
  name: string;
  hint?: string;
  wide?: boolean;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        wide && "md:col-span-2"
      )}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
        <code className="text-xs font-medium">{name}</code>
        {hint ? (
          <span className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-wrap items-start gap-3 p-4",
          bodyClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
