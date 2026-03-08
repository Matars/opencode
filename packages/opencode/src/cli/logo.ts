export const logo = {
  left: ["                   ", "█▀▀█ █▀▀█ █▀▀█ █▀▀▄", "█__█ █__█ █^^^ █__█", "▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀~~▀"],
  right: ["             ▄     ", "█▀▀▀ █▀▀█ █▀▀█ █▀▀█", "█___ █__█ █__█ █^^^", "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀"],
}

export const marks = "_^~"

type LogoGlyph = {
  kind: "glyph"
  left: string[]
  right: string[]
  marks: string
}

type LogoPlain = {
  kind: "plain"
  lines: string[]
}

export type LogoFrame = LogoGlyph | LogoPlain

export type LogoConfig =
  | false
  | string
  | {
      text?: string
      lines?: string[]
      frames?: (string | string[])[]
      interval_ms?: number
      loop?: boolean
    }

export type LogoSpec = {
  hidden: boolean
  frames: LogoFrame[]
  interval_ms: number
  loop: boolean
}

const base = {
  hidden: false,
  frames: [{ kind: "glyph", left: logo.left, right: logo.right, marks }] satisfies [LogoFrame],
  interval_ms: 180,
  loop: true,
} satisfies LogoSpec

function lines(text: string) {
  return text.split(/\r?\n/)
}

function frame(input: string | string[]): LogoFrame {
  if (typeof input === "string") {
    return {
      kind: "plain",
      lines: lines(input),
    }
  }
  return {
    kind: "plain",
    lines: input,
  }
}

export function resolveLogo(input?: LogoConfig): LogoSpec {
  if (input === undefined || input === "default") return base

  if (input === false) {
    return {
      ...base,
      hidden: true,
      frames: [],
    }
  }

  if (typeof input === "string") {
    if (input.trim() === "") {
      return {
        ...base,
        hidden: true,
        frames: [],
      }
    }
    return {
      ...base,
      frames: [frame(input)],
    }
  }

  const interval = input.interval_ms ?? base.interval_ms
  const loop = input.loop ?? base.loop

  if (input.frames?.length) {
    return {
      hidden: false,
      frames: input.frames.map(frame),
      interval_ms: interval,
      loop,
    }
  }

  if (input.lines?.length) {
    return {
      hidden: false,
      frames: [frame(input.lines)],
      interval_ms: interval,
      loop,
    }
  }

  if (typeof input.text === "string") {
    if (input.text.trim() === "") {
      return {
        hidden: true,
        frames: [],
        interval_ms: interval,
        loop,
      }
    }
    return {
      hidden: false,
      frames: [frame(input.text)],
      interval_ms: interval,
      loop,
    }
  }

  return {
    ...base,
    interval_ms: interval,
    loop,
  }
}
