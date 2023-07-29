import { readFile, writeFile } from "fs/promises";
import { defineConfig } from "tsup";
import type { Options } from "tsup";

// TODO: Would be nice not having to split up the client and server
// and just have esbuild keep the directives so that components with
// the directive stays a client component and the rest is server...
const client = [
  "./src/components/ui/accordion.tsx",
  "./src/components/ui/alert-dialog.tsx",
  "./src/components/ui/alert.tsx",
  "./src/components/ui/aspect-ratio.tsx",
  "./src/components/ui/avatar.tsx",
  "./src/components/ui/badge.tsx",
  "./src/components/ui/button.tsx",
  "./src/components/ui/calendar.tsx",
  "./src/components/ui/card.tsx",
  "./src/components/ui/checkbox.tsx",
  "./src/components/ui/collapsible.tsx",
  "./src/components/ui/command.tsx",
  "./src/components/ui/context-menu.tsx",
  "./src/components/ui/dialog.tsx",
  "./src/components/ui/dropdown-menu.tsx",
  "./src/components/ui/form.tsx",
  "./src/components/ui/hover-card.tsx",
  "./src/components/ui/icons.tsx",
  "./src/components/ui/input.tsx",
  "./src/components/ui/label.tsx",
  "./src/components/ui/menubar.tsx",
  "./src/components/ui/navigation-menu.tsx",
  "./src/components/ui/popover.tsx",
  "./src/components/ui/progress.tsx",
  "./src/components/ui/radio-group.tsx",
  "./src/components/ui/scroll-area.tsx",
  "./src/components/ui/select.tsx",
  "./src/components/ui/separator.tsx",
  "./src/components/ui/sheet.tsx",
  "./src/components/ui/skeleton.tsx",
  "./src/components/ui/slider.tsx",
  "./src/components/ui/switch.tsx",
  "./src/components/ui/table.tsx",
  "./src/components/ui/tabs.tsx",
  "./src/components/ui/textarea.tsx",
  "./src/components/ui/toast.tsx",
  "./src/components/ui/toaster.tsx",
  "./src/components/ui/toggle.tsx",
  "./src/components/ui/tooltip.tsx",
  "./src/components/ui/use-toast.ts",
  // "./src/components/ui/data-table.tsx",
];

const server = [
  "./src/components/ui/button.tsx",
  "./src/components/ui/icons.tsx",
  "./src/components/ui/card.tsx",
  "./src/components/ui/table.tsx",
  "./src/components/ui/toast.tsx",
];

export default defineConfig((opts) => {
  const common = {
    clean: !opts.watch,
    dts: true,
    format: ["esm"],
    minify: true,
    outDir: "dist",
  } satisfies Options;

  return [
    {
      // separate not to inject the banner
      ...common,
      entry: ["./src/index.ts", ...server],
    },
    {
      ...common,
      entry: client,
      esbuildOptions: (opts) => {
        opts.banner = {
          js: '"use client";',
        };
      },
      async onSuccess() {
        const pkgJson = JSON.parse(
          await readFile("./package.json", {
            encoding: "utf-8",
          }),
        ) as PackageJson;
        pkgJson.exports = {
          "./package.json": "./package.json",
          ".": {
            import: "./dist/index.mjs",
            types: "./dist/index.d.ts",
          },
        };
        [...client, ...server]
          .filter((e) => e.endsWith(".tsx"))
          .forEach((entry) => {
            const file = entry
              .replace("./src/components/ui/", "")
              .replace(".tsx", "");
            pkgJson.exports["./" + file] = {
              import: "./dist/" + file + ".mjs",
              types: "./dist/" + file + ".d.ts",
            };
            pkgJson.typesVersions["*"][file] = ["dist/" + file + ".d.ts"];
          });

        await writeFile("./package.json", JSON.stringify(pkgJson, null, 2));
      },
    },
  ];
});

interface PackageJson {
  name: string;
  exports: Record<string, { import: string; types: string } | string>;
  typesVersions: Record<"*", Record<string, string[]>>;
  files: string[];
  dependencies: Record<string, string>;
  pnpm: {
    overrides: Record<string, string>;
  };
}
