/**
 * Dragonfyre Realms — Minecraft Launcher
 * Created by FoxStudio. AI-assisted development.
 *
 * Source code : https://github.com/foxstudio-201/VoxelXLauncher
 * Website     : https://voxxelxclient.vercel.app
 *
 * NOTICE:
 *   - This software is provided as-is without warranty of any kind.
 *   - Do not redistribute or resell without explicit permission from FoxStudio.
 *   - If you use or reference this code, please credit FoxStudio.
 *   - Minecraft is a trademark of Mojang Studios / Microsoft. This project is not affiliated with Mojang.
 */
import { Gear } from '@phosphor-icons/react'
import dragonfyreIcon from '../assets/DragonfyreRealms.png'
import { useLang } from '../i18n/LangProvider'

export default function NavBar({ activePage, onNavigate, onOpenSettings, hidden }) {
  const { t } = useLang()

  return (
    <nav className={`absolute left-0 right-0 top-9 z-50 h-[64px] flex items-center justify-center px-4 transition-all duration-300 ${
      hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>

      {}
      <div className="flex items-center gap-2 px-2 py-1 rounded-2xl blur-glass border border-white/10"
        style={{ backgroundColor: 'rgba(20,20,28,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
        <button
          onClick={() => onNavigate('home')}
          data-tip={t('sidebar.home')}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
        >
          <img
            src={dragonfyreIcon}
            alt=""
            draggable={false}
            className={`object-contain rounded-lg transition-all duration-200 ${activePage === 'home' ? 'w-11 h-11' : 'w-9 h-9'}`}
          />
        </button>
      </div>

      {}
      <div className="absolute right-3">
        <button
          onClick={onOpenSettings}
          data-tip={t('sidebar.settings')}
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
        >
          <Gear size={28} weight="duotone" />
        </button>
      </div>
    </nav>
  )
}
