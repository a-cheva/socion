"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"

export function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [phase, setPhase] = useState<"idle" | "ready" | "recording" | "preview" | "uploading" | "done">("idle")
  const [seconds, setSeconds] = useState(0)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const recordedBlob = useRef<Blob | null>(null)
  const timerRef = useRef<any>(null)

  async function enableCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 720 },
        audio: true,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        await videoRef.current.play()
      }
      setPhase("ready")
    } catch {
      toast.error("Não foi possível acessar câmera/microfone. Verifique as permissões.")
    }
  }

  function startRecording() {
    if (!streamRef.current) return
    chunksRef.current = []
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm"
    const rec = new MediaRecorder(streamRef.current, { mimeType: mime })
    rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      recordedBlob.current = blob
      setBlobUrl(URL.createObjectURL(blob))
      setPhase("preview")
    }
    rec.start()
    recorderRef.current = rec
    setPhase("recording")
    setSeconds(0)
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= 59) { stopRecording(); return 60 }
        return s + 1
      })
    }, 1000)
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    recorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  function reset() {
    setBlobUrl(null)
    recordedBlob.current = null
    setPhase("idle")
    setSeconds(0)
  }

  async function upload() {
    if (!recordedBlob.current) return
    setPhase("uploading")
    const form = new FormData()
    form.append("file", recordedBlob.current, "pitch.webm")
    const res = await fetch("/api/pitch-video", { method: "POST", body: form })
    if (res.ok) {
      toast.success("Vídeo de apresentação salvo!")
      setPhase("done")
    } else {
      const d = await res.json().catch(() => ({}))
      toast.error(d.error ?? "Erro ao enviar vídeo.")
      setPhase("preview")
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-gray-900">🎥 Vídeo de apresentação</h2>
        <span className="text-xs text-gray-400">aparece no feed (estilo TikTok)</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Grave até 60s contando quem você é, o que procura e o que já entregou. Sócios confiam mais em quem mostra a cara.
      </p>

      {/* Preview de gravação ou do vídeo gravado */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-[9/16] max-w-[260px] mx-auto mb-4">
        {phase === "done" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
            <span className="text-4xl">✓</span>
            <p className="text-sm">Vídeo salvo!</p>
          </div>
        ) : blobUrl && phase !== "recording" ? (
          <video src={blobUrl} controls className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} playsInline className="absolute inset-0 w-full h-full object-cover" />
        )}

        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm text-center px-4">
            Clique em "Ativar câmera" para começar
          </div>
        )}
        {phase === "recording" && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> {seconds}s
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-2 justify-center">
        {phase === "idle" && (
          <button type="button" onClick={enableCamera} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Ativar câmera
          </button>
        )}
        {phase === "ready" && (
          <button type="button" onClick={startRecording} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white" /> Gravar
          </button>
        )}
        {phase === "recording" && (
          <button type="button" onClick={stopRecording} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            ■ Parar
          </button>
        )}
        {phase === "preview" && (
          <>
            <button type="button" onClick={reset} className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium">
              Regravar
            </button>
            <button type="button" onClick={upload} className="bg-[#00a86b] hover:bg-[#009060] text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              Usar este vídeo
            </button>
          </>
        )}
        {phase === "uploading" && (
          <button type="button" disabled className="bg-[#00a86b] text-white px-5 py-2.5 rounded-lg text-sm font-medium opacity-70">
            Enviando...
          </button>
        )}
        {phase === "done" && (
          <button type="button" onClick={reset} className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium">
            Gravar outro
          </button>
        )}
      </div>
    </div>
  )
}
