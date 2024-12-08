import ffmpeg from "fluent-ffmpeg"
import { basename, extname, join } from "path"
import { existsSync, mkdirSync } from "fs"

function extractAudio(videoPath, outputDir = ".") {
  return new Promise((resolve, reject) => {
    if (!existsSync(videoPath)) {
      return reject(new Error(`Arquivo de vídeo não encontrado: ${videoPath}`))
    }

    const outputFileName = `${basename(videoPath, extname(videoPath))}.mp3`
    console.log({ outputFileName })
    const outputPath = join(outputDir, outputFileName)

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    ffmpeg(videoPath)
      .output(outputPath)
      .audioCodec("libmp3lame")
      .on("end", () => {
        console.log(`Áudio extraído com sucesso: ${outputPath}`)
        resolve(outputPath)
      })
      .on("error", (err) => {
        console.error(`Erro ao extrair áudio: ${err.message}`)
        reject(err)
      })
      .run()
  })
}

;(async () => {
  const videoPath = "/home/robert/2024-12-08 17-46-29.mkv"
  const outputDir = "./background.mp3"

  try {
    const audioPath = await extractAudio(videoPath, outputDir)
    console.log(`Áudio salvo em: ${audioPath}`)
  } catch (error) {
    console.error(`Falha ao extrair áudio: ${error.message}`)
  }
})()
