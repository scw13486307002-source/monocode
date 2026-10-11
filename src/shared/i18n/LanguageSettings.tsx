import { invoke, isTauri } from "@tauri-apps/api/core";
import { useState } from "react";
import { getLocale, setLocale, t, type Locale } from "./index";

export function LanguageSettings() {
  const [selected, setSelected] = useState<Locale>(getLocale);
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const onChange = async (next: Locale) => {
    setSaving(true);
    setError("");
    try {
      if (isTauri()) await invoke("interface_set_locale", { locale: next });
      setLocale(next);
      setSelected(next);
      setChanged(true);
    } catch {
      setError(t("Could not save the language preference. Please try again."));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section
      className="mb-6 rounded-xl border border-stroke p-4"
      data-setting-id="language"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <label
            htmlFor="interface-language"
            className="text-[13px] font-medium"
          >
            {t("Interface language")}
          </label>
          <p className="mt-1 text-[12px] text-content/50">
            {t(
              "Choose the language of MonoCode. Agent responses follow your prompts.",
            )}
          </p>
        </div>
        <select
          id="interface-language"
          value={selected}
          disabled={saving}
          onChange={(event) => void onChange(event.target.value as Locale)}
          className="rounded-md border border-stroke bg-surface px-3 py-1.5 text-[13px] text-content"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en">English</option>
        </select>
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[12px] text-red-400">
          {error}
        </p>
      ) : null}
      {changed ? (
        <div className="mt-3 text-[12px] text-content/60" role="status">
          {t(
            "Language saved. Restart MonoCode after your active tasks finish to apply it to every window and menu.",
          )}
        </div>
      ) : null}
    </section>
  );
}
