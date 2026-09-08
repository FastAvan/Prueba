import type { PropsWithChildren, ReactNode } from 'react'

export default function Card({
  title,
  action,
  children,
}: PropsWithChildren<{ title?: string; action?: ReactNode }>) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="text-sm font-medium text-slate-300">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
