export const field = "mt-1 block w-full rounded-xl border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700";
export const card = "rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950";
export function Field({ name, label, value = "", maxLength = 120, multiline = false }: { name: string; label: string; value?: string; maxLength?: number; multiline?: boolean }) {
  return <label className="block text-sm font-medium">{label}{multiline ? <textarea name={name} defaultValue={value} maxLength={maxLength} rows={4} required className={field} /> : <input name={name} defaultValue={value} maxLength={maxLength} required className={field} />}</label>;
}
