interface Config {
  envMode: string
  app: {
    name: string
  }
  server: {
    host: string
    port: number

    logger: any
    cors: any
    rateLimit: any
  }
}

interface AdditionalServerFlag {
  label: string
  enabled: boolean
  comment?: string
}

declare function printServerInfo(config: Config, additionalServerFlags?: AdditionalServerFlag[]): () => void

export = printServerInfo
