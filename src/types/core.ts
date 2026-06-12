export interface Code {
  code: string
  name: string
  englishName?: string
  order?: number
}

export type Codes = Record<string, Code[]>
