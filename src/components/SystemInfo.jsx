import { useEffect, useState } from 'react'
import { Cpu, GraphicsCard, CaretDown } from '@phosphor-icons/react'

const isElectron = typeof window !== 'undefined' && window.electronAPI

function splitLines(name) {
  const n = String(name || '').trim()
  if (!n) return ['', '']

  const b = n.match(/^(.+?)\s*\[\s*([^\]]+)\s*\]\s*$/)
  if (b && b[1] && b[2]) return [b[1].trim(), b[2].trim()]

  const tokens = n.split(/\s+/)
  const idx = tokens.findIndex(t => /^(i\d|r\d|Ryzen|A\d|GeForce|Radeon|RTX|Arc|Quadro|Ultra|EPYC|PRO\d?)/i.test(t))
  if (idx > 0) return [tokens.slice(0, idx).join(' '), tokens.slice(idx).join(' ')]

  return [n, '']
}

function InfoCol({ Icon, iconCls, label, name }) {
  const [line1, line2] = splitLines(name)
  return (
    <div className="flex items-start gap-2 min-w-0 flex-1">
      <Icon size={20} weight="duotone" className={`${iconCls} flex-shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">{label}</p>
        <p className="text-[11px] font-semibold text-white leading-snug">
          {line1}
          {line2 ? <span className="block">{line2}</span> : null}
        </p>
      </div>
    </div>
  )
}

export default function SystemInfo() {
  const [info, setInfo] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isElectron || !window.electronAPI.getSystemInfo) return
    let cancelled = false
    window.electronAPI.getSystemInfo()
      .then(r => { if (!cancelled && r) setInfo(r) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!info) return null

  return (
    <div className="absolute top-[108px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <button
        onClick={() => setOpen(v => !v)}
        className="blur-glass flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 transition-colors hover:border-white/25"
        style={{ backgroundColor: 'rgba(20,20,28,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        data-tip={open ? 'Đóng thông tin máy' : 'Xem cấu hình máy'}
      >
        <Cpu size={16} weight="duotone" className="text-cyan-400" />
        <span className="text-xs font-bold text-white/85">Cấu hình máy</span>
        <CaretDown size={14} weight="bold" className={`text-white/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="mt-2 w-[400px] max-w-[80vw] blur-glass rounded-2xl border border-white/15 p-4 dropdown-drop"
          style={{ backgroundColor: 'rgba(14,14,20,0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Thông tin cấu hình máy</p>
          <div className="flex flex-col gap-3">
            <InfoCol Icon={Cpu} iconCls="text-cyan-400" label="CPU" name={info.cpu} />
            <div className="h-px bg-white/10" />
            <InfoCol Icon={GraphicsCard} iconCls="text-emerald-400" label="GPU" name={info.gpu} />
          </div>
        </div>
      )}
    </div>
  )
}
