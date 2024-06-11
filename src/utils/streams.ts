import type { Readable } from 'node:stream'

export const nodeStreamConvertor = (nodeReadable: Readable): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      nodeReadable.on('data', (chunk: Buffer) => controller.enqueue(chunk))
      nodeReadable.on('end', () => controller.close())
      nodeReadable.on('error', err => controller.error(err))
    },
    cancel() {
      nodeReadable.destroy()
    },
  })
}
