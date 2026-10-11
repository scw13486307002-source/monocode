import { t } from "../../../shared/i18n/index";
import { displayPath } from "../../../shared/lib/paths";

/** Requires reconnecting the project before the user retries submission. */
export class ProjectNotFoundError extends Error {
  constructor(cwd: string) {
    super(
      t("Project folder not found: {0}. Reopen the folder to reconnect it.", {
        "0": displayPath(cwd),
      }),
    );
    this.name = "ProjectNotFoundError";
  }
}
