"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { AdminImageField, type UploadFolder } from "./AdminImageField";
import { Button, inputCls, Switch } from "./ui";

export type AdminField =
  | { name: string; label: string; type: "text" | "textarea" | "url" | "number" | "boolean" | "image" | "rating" | "slug"; help?: string; required?: boolean; from?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; help?: string; required?: boolean }
  | { name: string; label: string; type: "list"; itemLabel: string; fields: AdminField[]; help?: string; required?: boolean };

type Values = Record<string, unknown>;

export function emptyFor(fields: AdminField[]): Values {
  const o: Values = {};
  for (const f of fields) o[f.name] = f.type === "boolean" ? false : f.type === "list" ? [] : f.type === "number" ? 0 : f.type === "rating" ? 5 : "";
  return o;
}

export function FieldRenderer({
  fields,
  values,
  onChange,
  folder = "pages",
  idPrefix = "f",
}: {
  fields: AdminField[];
  values: Values;
  onChange: (next: Values) => void;
  folder?: UploadFolder;
  idPrefix?: string;
}) {
  const set = (name: string, v: unknown) => onChange({ ...values, [name]: v });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `${idPrefix}-${f.name}`;
        const v = values[f.name];
        const full = f.type === "textarea" || f.type === "list" || f.type === "image";
        const labelEl = (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
            {f.label}
            {f.required && <span className="text-red-500"> *</span>}
          </label>
        );
        let control: React.ReactNode;

        switch (f.type) {
          case "textarea":
            control = (
              <>
                {labelEl}
                <textarea id={id} rows={4} className={inputCls} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)} />
              </>
            );
            break;
          case "number":
            control = (
              <>
                {labelEl}
                <input id={id} type="number" min={0} className={inputCls} value={Number(v ?? 0)} onChange={(e) => set(f.name, e.target.value === "" ? 0 : Number(e.target.value))} />
              </>
            );
            break;
          case "rating":
            control = (
              <>
                {labelEl}
                <select id={id} className={inputCls} value={Number(v ?? 5)} onChange={(e) => set(f.name, Number(e.target.value))}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </>
            );
            break;
          case "boolean":
            control = (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <label htmlFor={id} className="text-sm font-medium text-slate-700">
                  {f.label}
                </label>
                <Switch id={id} checked={!!v} onChange={(b) => set(f.name, b)} label={f.label} />
              </div>
            );
            break;
          case "select":
            control = (
              <>
                {labelEl}
                <select id={id} className={inputCls} value={String(v ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </>
            );
            break;
          case "image":
            control = <AdminImageField label={f.label} value={String(v ?? "")} onChange={(url) => set(f.name, url)} folder={folder} className="max-w-sm" />;
            break;
          case "list": {
            const list = Array.isArray(v) ? (v as Values[]) : [];
            const move = (i: number, d: number) => {
              const next = [...list];
              const [it] = next.splice(i, 1);
              next.splice(i + d, 0, it);
              set(f.name, next);
            };
            control = (
              <fieldset className="rounded-lg border border-slate-200 p-3">
                <legend className="px-1 text-sm font-semibold text-slate-800">{f.label}</legend>
                <div className="space-y-3">
                  {list.map((item, i) => (
                    <div key={i} className="rounded-lg bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {f.itemLabel} {i + 1}
                        </span>
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)}>
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button type="button" size="sm" variant="ghost" aria-label="Remove item" onClick={() => set(f.name, list.filter((_, j) => j !== i))}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <FieldRenderer
                        fields={f.fields}
                        values={item}
                        folder={folder}
                        idPrefix={`${id}-${i}`}
                        onChange={(nv) => set(f.name, list.map((x, j) => (j === i ? nv : x)))}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="secondary" size="sm" onClick={() => set(f.name, [...list, emptyFor(f.fields)])}>
                    <Plus className="h-4 w-4" /> Add {f.itemLabel.toLowerCase()}
                  </Button>
                </div>
              </fieldset>
            );
            break;
          }
          default:
            control = (
              <>
                {labelEl}
                <input id={id} type="text" className={inputCls} value={String(v ?? "")} required={f.required} onChange={(e) => set(f.name, e.target.value)} />
              </>
            );
        }

        return (
          <div key={f.name} className={full ? "sm:col-span-2" : ""}>
            {control}
            {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
          </div>
        );
      })}
    </div>
  );
}
