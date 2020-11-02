class Network {
  constructor({host}){
    this.host = host
  }

  parseManifestUrl({url, fileResolution, fileResolutionTag, hostTag}) {
    return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
  }

  async fetchFile(url) {
    const response = await fetch(url)
    return response.arrayBuffer()
  }

  async getProperResolution(url){
    const startNs = Date.now()
    const response = await fetch(url)
    await response.arrayBuffer()
    const endNs = Date.now()
    const durationNs = (endNs - startNs)
    
    // ao invés de calcular o troughput vamos calcular a duração
    const resolutions = [
      // pior cenário: até 20 segundos
      {start: 3001, end: 20000, resolution: 144},
      // até 3 segundos
      {start: 901, end: 3000, resolution: 360},
      // menos de um segundo
      {start: 0, end: 900, resolution: 720},
    ]

    const item = resolutions.filter(item => {
      return item.start <= durationNs && item.end >= durationNs
    })

    const LOWEST_RESOLUTION = 144
    if(!item) return LOWEST_RESOLUTION

    return item[0].resolution
  }
}