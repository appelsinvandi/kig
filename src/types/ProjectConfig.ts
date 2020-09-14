export interface ProjectConfig {
  history: HistoryConfig
}

type HistoryConfig = HistoryConfigEnabled | HistoryConfigDisabled
interface HistoryConfigEnabled {
  enabled: true
  cacheLocation: string
  limit: number
}
interface HistoryConfigDisabled {
  enabled: false
}
