// @vitest-environment happy-dom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { LanguageSettings } from "./LanguageSettings";
import { getLocale, LOCALE_KEY, setLocale } from "./index";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(async () => undefined),
  isTauri: () => true,
}));
let root: Root;
let container: HTMLDivElement;
beforeEach(async () => {
  vi.clearAllMocks();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  setLocale("zh-CN");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(createElement(LanguageSettings)));
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  localStorage.clear();
  setLocale("en");
});

it("saves both native and webview locale, deferring restart until tasks finish", async () => {
  expect(container.textContent).toContain("界面语言");
  const select = container.querySelector("select")!;
  const reload = vi.spyOn(window.location, "reload");
  await act(async () => {
    select.value = "en";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(invoke).toHaveBeenCalledWith("interface_set_locale", { locale: "en" });
  expect(localStorage.getItem(LOCALE_KEY)).toBe("en");
  expect(getLocale()).toBe("en");
  expect(container.querySelector('[role="status"]')?.textContent).toContain(
    "after your active tasks finish",
  );
  expect(reload).not.toHaveBeenCalled();
  reload.mockRestore();
});

it("keeps the existing locale if saving native preferences fails", async () => {
  vi.mocked(invoke).mockRejectedValueOnce(new Error("disk full"));
  await act(async () => {
    const select = container.querySelector("select")!;
    select.value = "en";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(getLocale()).toBe("zh-CN");
  expect(container.querySelector('[role="alert"]')?.textContent).toBe(
    "无法保存语言设置，请重试。",
  );
  expect(container.querySelector('[role="status"]')).toBeNull();
});
