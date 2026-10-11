import { afterEach, describe, expect, it, vi } from "vitest";
import messages from "./zh-CN.json";
import { getLocale, initLocale, LOCALE_KEY, setLocale, t } from "./index";

afterEach(() => {
  vi.unstubAllGlobals();
  setLocale("en");
});

describe("Chinese UI localization", () => {
  it("starts new profiles in Simplified Chinese and respects saved English", async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    vi.resetModules();
    const first = await import("./index");
    expect(first.getLocale()).toBe("zh-CN");
    expect(first.t("Settings")).toBe("设置");
    first.setLocale("en");
    expect(storage.get(LOCALE_KEY)).toBe("en");
    vi.resetModules();
    expect((await import("./index")).getLocale()).toBe("en");
  });

  it("translates display labels without changing command IDs or user text", () => {
    setLocale("zh-CN");
    const command = "App: Settings";
    expect(t(command)).toBe("应用：设置");
    expect(command).toBe("App: Settings");
    const arbitrary = "Daniel's project / 私有项目";
    expect(t(arbitrary)).toBe(arbitrary);
    expect(t("claude-sonnet-4-5")).toBe("claude-sonnet-4-5");
  });

  it("preserves dynamic values and does not interpret markup or replacement syntax", () => {
    setLocale("zh-CN");
    expect(t("Delete “{0}”?", { 0: "<script>$&{count}</script>" })).toBe(
      "删除“<script>$&{count}</script>”？",
    );
    expect(t("{count} sessions in this worktree", { count: 2 })).toBe(
      "此工作树中有 2 个会话",
    );
  });

  it("keeps full English sentences when English is selected", () => {
    setLocale("en");
    expect(t("{count} sessions in this worktree", { count: 2 })).toBe(
      "2 sessions in this worktree",
    );
    expect(t("Settings")).toBe("Settings");
  });

  it("continues to work if browser storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      setItem: () => {
        throw new Error("denied");
      },
    });
    expect(() => setLocale("zh-CN")).not.toThrow();
    expect(getLocale()).toBe("zh-CN");
    expect(t("New session")).toBe("新建会话");
  });

  it("sets the document language for accessibility", () => {
    const doc = { documentElement: { lang: "" } };
    vi.stubGlobal("document", doc);
    setLocale("zh-CN");
    initLocale();
    expect(doc.documentElement.lang).toBe("zh-CN");
    setLocale("en");
    expect(doc.documentElement.lang).toBe("en");
  });

  it("keeps every interpolation placeholder in every translation", () => {
    for (const [english, chinese] of Object.entries(messages)) {
      expect(chinese.trim(), english).not.toBe("");
      expect(
        [...chinese.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort(),
        english,
      ).toEqual([...english.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort());
    }
  });
});
