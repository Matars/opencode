import { TextAttributes, RGBA } from "@opentui/core"
import { createMemo, For, Show, type JSX } from "solid-js"
import { useTheme, tint } from "@tui/context/theme"
import { resolveLogo } from "@/cli/logo"
import { useTuiConfig } from "../context/tui-config"

const esc = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export function Logo() {
  const { theme } = useTheme()
  const cfg = useTuiConfig()
  const spec = createMemo(() => resolveLogo(cfg.logo))
  const item = createMemo(() => {
    const logo = spec()
    if (logo.hidden) return undefined
    return logo.frames[0]
  })

  const renderLine = (
    line: string,
    fg: RGBA,
    bold: boolean,
    marker: RegExp,
    fill: string,
    mix: string,
    top: string,
  ): JSX.Element[] => {
    const shadow = tint(theme.background, fg, 0.25)
    const attrs = bold ? TextAttributes.BOLD : undefined
    const elements: JSX.Element[] = []
    let i = 0

    while (i < line.length) {
      const rest = line.slice(i)
      const markerIndex = rest.search(marker)

      if (markerIndex === -1) {
        elements.push(
          <text fg={fg} attributes={attrs} selectable={false}>
            {rest}
          </text>,
        )
        break
      }

      if (markerIndex > 0) {
        elements.push(
          <text fg={fg} attributes={attrs} selectable={false}>
            {rest.slice(0, markerIndex)}
          </text>,
        )
      }

      const char = rest[markerIndex]
      if (char === fill) {
        elements.push(
          <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
            {" "}
          </text>,
        )
      }
      if (char === mix) {
        elements.push(
          <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
            ▀
          </text>,
        )
      }
      if (char === top) {
        elements.push(
          <text fg={shadow} attributes={attrs} selectable={false}>
            ▀
          </text>,
        )
      }

      i += markerIndex + 1
    }

    return elements
  }

  return (
    <Show when={item()}>
      {(value) => {
        const art = value()

        if (art.kind === "plain") {
          return (
            <box flexDirection="column">
              <For each={art.lines}>
                {(line) => (
                  <text fg={theme.text} selectable={false}>
                    {line}
                  </text>
                )}
              </For>
            </box>
          )
        }

        const shadow = art.marks
        const fill = shadow[0] ?? "_"
        const mix = shadow[1] ?? "^"
        const top = shadow[2] ?? "~"
        const marker = new RegExp(`[${esc(`${fill}${mix}${top}`)}]`)

        return (
          <box>
            <For each={art.left}>
              {(line, index) => (
                <box flexDirection="row" gap={1}>
                  <box flexDirection="row">{renderLine(line, theme.textMuted, false, marker, fill, mix, top)}</box>
                  <box flexDirection="row">
                    {renderLine(art.right[index()] ?? "", theme.text, true, marker, fill, mix, top)}
                  </box>
                </box>
              )}
            </For>
          </box>
        )
      }}
    </Show>
  )
}
