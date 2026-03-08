import z from "zod"
import { Config } from "./config"

const KeybindOverride = z
  .object(
    Object.fromEntries(Object.keys(Config.Keybinds.shape).map((key) => [key, z.string().optional()])) as Record<
      string,
      z.ZodOptional<z.ZodString>
    >,
  )
  .strict()

const LogoFrame = z.union([z.string(), z.string().array()])

const Logo = z.union([
  z.literal(false),
  z.string(),
  z
    .object({
      text: z.string().optional().describe("Static multi-line logo as a single string"),
      lines: z.string().array().optional().describe("Static logo lines"),
      frames: LogoFrame.array().optional().describe("Logo frames for future animated logos"),
      interval_ms: z.number().int().positive().optional().describe("Animation frame interval in milliseconds"),
      loop: z.boolean().optional().describe("Whether animated logos loop"),
    })
    .strict(),
])

export const TuiOptions = z.object({
  scroll_speed: z.number().min(0.001).optional().describe("TUI scroll speed"),
  scroll_acceleration: z
    .object({
      enabled: z.boolean().describe("Enable scroll acceleration"),
    })
    .optional()
    .describe("Scroll acceleration settings"),
  diff_style: z
    .enum(["auto", "stacked"])
    .optional()
    .describe("Control diff rendering style: 'auto' adapts to terminal width, 'stacked' always shows single column"),
})

export const TuiInfo = z
  .object({
    $schema: z.string().optional(),
    theme: z.string().optional(),
    keybinds: KeybindOverride.optional(),
    logo: Logo.optional(),
  })
  .extend(TuiOptions.shape)
  .strict()
