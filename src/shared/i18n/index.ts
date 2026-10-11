import messages from "./zh-CN.json";

export type Locale = "zh-CN" | "en";
export const LOCALE_KEY = "monocode.locale";
let locale: Locale = readLocale();

function readLocale(): Locale {
  try {
    return localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "zh-CN";
  } catch {
    return "zh-CN";
  }
}

export function getLocale(): Locale {
  return locale;
}

/** Changes take effect fully on the next launch (module-level option catalogs
 * are also translated). Never reload automatically: active agents must keep
 * their connections until the user chooses to restart. */
export function setLocale(next: Locale): void {
  locale = next;
  try {
    localStorage.setItem(LOCALE_KEY, next);
  } catch {
    // Translation still works for this window when storage is unavailable.
  }
  if (typeof document !== "undefined") document.documentElement.lang = next;
}

/** Only application UI passes through here. Agent output, file contents,
 * commands, IDs and user-created names are never translated. */
export function t(
  source: string,
  values?: Record<string, string | number>,
): string {
  const dictionary = messages as Record<string, string>;
  const command = source.match(
    /^(App|Tab|Pane|Terminal|Editor|Composer|View): (.+)$/,
  );
  const translated =
    locale === "zh-CN"
      ? (dictionary[source] ??
        (command
          ? `${dictionary[command[1]] ?? command[1]}：${dictionary[command[2]] ?? command[2]}`
          : source))
      : source;
  return values
    ? translated.replace(/\{(\w+)\}/g, (match, key: string) =>
        values[key] === undefined ? match : String(values[key]),
      )
    : translated;
}

export function initLocale(): void {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
}
