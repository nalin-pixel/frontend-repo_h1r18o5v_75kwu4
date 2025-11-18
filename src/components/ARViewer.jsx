import { useEffect, useRef } from 'react'

// Lightweight AR viewer using <model-viewer>
// Works on: Android (Scene Viewer), iOS (Quick Look with USDZ), and WebXR where supported
// No npm dependency: we inject the script from CDN once per app session

const MODEL_VIEWER_SCRIPT = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'

export default function ARViewer({ modelUrl, poster, exposure = 1, arScale = 'fixed', onClose }) {
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    const existing = document.querySelector(`script[src="${MODEL_VIEWER_SCRIPT}"]`)
    if (existing) {
      loadedRef.current = true
      return
    }
    const s = document.createElement('script')
    s.type = 'module'
    s.src = MODEL_VIEWER_SCRIPT
    s.onload = () => { loadedRef.current = true }
    document.head.appendChild(s)
  }, [])

  const url = modelUrl || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black/60">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >Close</button>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <model-viewer
          src={url}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale={arScale}
          camera-controls
          touch-action="pan-y"
          autoplay
          exposure={exposure}
          shadow-intensity="0.7"
          environment-image="neutral"
          style={{ width: '100%', height: '70vh', background: 'linear-gradient(135deg,#0b1020,#0a0a0a)' }}
          poster={poster}
        >
          {/* Fallback instructions */}
          <div slot="poster" className="w-full h-full flex items-center justify-center text-slate-300">
            Loading AR…
          </div>
          <button slot="ar-button" className="mx-auto my-3 px-4 py-2 rounded-xl bg-blue-500/90 hover:bg-blue-400 text-white">
            View in AR
          </button>
        </model-viewer>
        <div className="p-3 text-center text-slate-300 text-sm border-t border-white/10">
          Tip: On compatible devices, tap "View in AR" to place the object in your space.
        </div>
      </div>
    </div>
  )
}
