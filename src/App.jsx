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
/**
 * Dragonfyre Realms — Minecraft Launcher
 * Created by FoxStudio. AI-assisted development.
 *
 * Source code : https://github.com/foxstudio-201/VoxelXLauncher
 * Website     : https://voxxelxclient.vercel.app
 *
 * NOTICE:
 *   - Dành cho mấy cháu cứ thích phỉ báng.
 *   - Launcher sử dụng ai đi kèm trong việc tạo, bản thân người tạo không tự nhận là code toàn bộ do có sự hỗ trợ của ai.
 *   - Giỏi giang thì tự code bằng năng lực của mình đang video làm toàn bộ từ đầu đến cuối, còn không làm được đừng có kích đểu ảnh hưởng đến người sử dụng.
 *   - Bạn chẳng phải là anh hùng mặc áo choàng đỏ mặc quần xịt như thằng trẻ trâu rồi lên mạng ra vẻ ta đây là người tốt, là anh hùng, là người bảo vệ công lý gì đâu :).
 *   - Vậy nên bớt ảo tưởng đi.
 *   - Nếu có sử dụng hoặc tham khảo code này, hãy ghi công cho FoxStudio.
 *   - Minecraft là một thương hiệu của Mojang Studios / Microsoft. Dự án này không liên kết với Mojang.
 */














 
















import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import TitleBar from './components/TitleBar'
import CloseModal from './components/CloseModal'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import InitialSetup from './components/InitialSetup'
import CursorTrail from './components/CursorTrail'
import TooltipProvider from './components/ui/TooltipProvider'
import UpdateModal from './components/UpdateModal'
import { AccountsProvider } from './hooks/useAccounts'
import { loadAppSettings, applyAppSettings, isInitialSetupRequired } from './utils/appSettings'
import { LangProvider } from './i18n/LangProvider'

const SettingsPage = lazy(() => import('./components/settings/SettingsPage'))
const CrashAnalyzerModal = lazy(() => import('./components/crash/CrashAnalyzerModal'))

const isElectron = typeof window !== 'undefined' && window.electronAPI

function AppInner() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [logPanelOpen, setLogPanelOpen] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)

  const [instances, setInstances] = useState(new Map())
  
  const instancesRef = useRef(new Map())

  const [launchState, setLaunchState] = useState('idle')
  const [progress, setProgress]       = useState(null)
  const [launchError, setLaunchError] = useState(null)
  const [activeKey, setActiveKey]     = useState(null)
  const [crashData, setCrashData]     = useState(null)

  const cleanupRef = useRef([])

  const updateInstance = useCallback((key, patch) => {
    setInstances(prev => {
      const next = new Map(prev)
      const cur  = next.get(key) || {}
      const updated = { ...cur, ...patch }
      next.set(key, updated)
      instancesRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    if (!isElectron) return

    cleanupRef.current.forEach(fn => fn?.())
    cleanupRef.current = []

    const unsubProgress = window.electronAPI.onLaunchProgress((data) => {
      setProgress(data)
      if (data.phase === 'running') {
        setLaunchState('running')
        
        window.electronAPI.lanStartScan?.().catch?.(() => {})
      }
      if (data.phase === 'error') {
        setLaunchState('error')
        setLaunchError(data.error || data.log)
      }

      setActiveKey(currentKey => {
        if (currentKey) {
          setInstances(prev => {
            const next = new Map(prev)
            const cur  = next.get(currentKey)
            if (cur) {
              const newState = data.phase === 'error'   ? 'error'       :
                               data.phase === 'running'  ? 'running'     : 'downloading'

              const extraLog = (data.phase === 'error' && (data.error || data.log))
                ? [`[ERR] ${data.error || data.log}`]
                : []
              next.set(currentKey, {
                ...cur,
                progress: data,
                state: newState,
                logs: extraLog.length > 0
                  ? [...(cur.logs || []).slice(-499), ...extraLog]
                  : cur.logs,
              })
            }
            instancesRef.current = next
            return next
          })
        }
        return currentKey
      })
    })

    const unsubLog = window.electronAPI.onLaunchLog((data) => {
      setActiveKey(currentKey => {
        if (currentKey) {
          setInstances(prev => {
            const next = new Map(prev)
            const cur  = next.get(currentKey)
            if (cur) {
              const newLog = data.line
              const newLogs = [...(cur.logs || []).slice(-1999), newLog]
              const newLauncherLogs = newLog.startsWith('[Launcher]')
                ? [...(cur.launcherLogs || []).slice(-1999), newLog]
                : (cur.launcherLogs || [])
              next.set(currentKey, { ...cur, logs: newLogs, launcherLogs: newLauncherLogs })
            }
            instancesRef.current = next
            return next
          })
        }
        return currentKey
      })
    })

    const unsubLogUpdate = window.electronAPI.onLaunchLogUpdate?.((data) => {
      setActiveKey(currentKey => {
        if (currentKey) {
          setInstances(prev => {
            const next = new Map(prev)
            const cur  = next.get(currentKey)
            if (cur) {
              const logs = cur.logs || []
              const updated = logs.length > 0
                ? [...logs.slice(0, -1), data.line]
                : [data.line]
              next.set(currentKey, { ...cur, logs: updated })
            }
            instancesRef.current = next
            return next
          })
        }
        return currentKey
      })
    })

    const unsubStop = window.electronAPI.onGameStopped((data) => {
      const realKey = data?.profileId && data?.accountId
        ? `${data.profileId}::${data.accountId}`
        : null

      
      window.electronAPI.lanStopScan?.().catch?.(() => {})

      
      
      const exitCode = data?.code ?? 0
      if (exitCode !== 0 && isElectron) {
        const currentInstances = instancesRef.current

        
        let inst = realKey ? currentInstances.get(realKey) : null
        if (!inst && data?.profileId) {
          inst = currentInstances.get(`${data.profileId}::`)
        }
        if (!inst && data?.profileId) {
          
          inst = [...currentInstances.values()].find(i => i.profileId === data.profileId)
        }

        const logs = inst?.logs || []

        
        window.electronAPI.getProfiles().then(profilesData => {
          const profile = profilesData?.profiles?.find(p => p.id === data.profileId)
          setCrashData({
            logs,
            profileId: data.profileId,
            accountId: data.accountId || null,
            instancePath: profile?.instancePath || null,
            gameVersion: profile?.gameVersion || null,
            loader: profile?.loader || null,
            profileName: inst?.profileName || profile?.name || '',
            exitCode,
          })
        }).catch(() => {
          setCrashData({
            logs,
            profileId: data.profileId,
            accountId: data.accountId || null,
            instancePath: null,
            gameVersion: null,
            loader: null,
            profileName: inst?.profileName || '',
            exitCode,
          })
        })
      }

      setInstances(prev => {
        const next = new Map(prev)

        if (realKey && next.has(realKey)) {
          next.set(realKey, { ...next.get(realKey), state: 'stopped' })
          setTimeout(() => setInstances(p => { const n = new Map(p); n.delete(realKey); instancesRef.current = n; return n }), 3000)
          instancesRef.current = next
          return next
        }

        if (data?.profileId) {
          for (const [k, inst] of next) {
            if (inst.profileId === data.profileId) {
              next.set(k, { ...inst, state: 'stopped' })
              setTimeout(() => setInstances(p => { const n = new Map(p); n.delete(k); instancesRef.current = n; return n }), 3000)
              break
            }
          }
        }
        instancesRef.current = next
        return next
      })

      setLaunchState('idle')
      setProgress(null)
      setLaunchError(null)
      setActiveKey(null)
    })

    cleanupRef.current = [unsubProgress, unsubLog, unsubLogUpdate, unsubStop]
    return () => { cleanupRef.current.forEach(fn => fn?.()) }
  }, [])

  const handleLaunch = useCallback(async (profileId, ramMb, profileName, accountName, serverAddress, accountId) => {
    if (!isElectron) return
    setLaunchState('downloading')
    setLaunchError(null)
    setProgress({ phase: 'starting', log: 'Preparing...', percent: 0 })

    const aid = accountId || ''
    const tempKey = `${profileId}::${aid}`
    setActiveKey(tempKey)
    setInstances(prev => {
      const next = new Map(prev)
      next.set(tempKey, {
        key: tempKey, profileId, accountId: aid,
        profileName: profileName || profileId,
        accountName: accountName || '',
        state: 'downloading', progress: null, logs: [],
      })
      instancesRef.current = next
      return next
    })

    const result = await window.electronAPI.launchGame({ profileId, ramMb, serverAddress, accountId: aid })
    if (result?.error) {
      setLaunchError(result.error)
      setLaunchState('error')
      setProgress({ phase: 'error', log: result.error, percent: 0 })
      updateInstance(tempKey, {
        state: 'error',
        logs: [`[ERR] ${result.error}`],
      })
    }
  }, [updateInstance])

  const handleLaunchReset = useCallback(() => {
    setLaunchState('idle')
    setLaunchError(null)
    setProgress(null)
    if (activeKey) {
      setInstances(prev => { const next = new Map(prev); next.delete(activeKey); return next })
      setActiveKey(null)
    }
  }, [activeKey])

  const handleKillInstance = useCallback((key) => {
    if (!isElectron) return
    const inst = instances.get(key)
    if (!inst) return
    window.electronAPI.stopGame({ profileId: inst.profileId, accountId: inst.accountId })
  }, [instances])

  const handleCloseRequest = useCallback(async () => {
    if (!isElectron) return
    const settings = await window.electronAPI.getSettings()
    if (settings.closeBehavior === 'quit') { window.electronAPI.quitApp(); return }
    if (settings.closeBehavior === 'tray') { window.electronAPI.closeWindow(); return }
    setShowCloseModal(true)
  }, [])

  const instanceList = Array.from(instances.values())

  function renderPage() {
    return (
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <HomePage
          launchState={launchState}
          progress={progress}
          launchError={launchError}
          onLaunch={handleLaunch}
          onLaunchReset={handleLaunchReset}
          instances={instanceList}
          onKillInstance={handleKillInstance}
          onLogPanelOpen={setLogPanelOpen}
        />
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative z-10" style={{ background: 'transparent' }}>
      <TitleBar instances={instanceList} onKillInstance={handleKillInstance} onCloseRequest={handleCloseRequest} />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          <NavBar
            onOpenSettings={() => setSettingsOpen(true)}
          />
          {renderPage()}
        </main>
      </div>
      {crashData && (
        <Suspense fallback={null}>
          <CrashAnalyzerModal
            crashData={crashData}
            onClose={() => setCrashData(null)}
          />
        </Suspense>
      )}

      {settingsOpen && (
        <Suspense fallback={null}>
          <SettingsPage onClose={() => setSettingsOpen(false)} />
        </Suspense>
      )}

      {showCloseModal && (
        <CloseModal onClose={() => setShowCloseModal(false)} />
      )}
      <UpdateModal />
      <CursorTrail />
      <TooltipProvider />
    </div>
  )
}

export default function App() {
  const [initialSettings, setInitialSettings] = useState(null)
  const [initialSetupOpen, setInitialSetupOpen] = useState(false)
  const [initialSetupChecked, setInitialSetupChecked] = useState(false)

  useEffect(() => {
    loadAppSettings().then(s => {
      setInitialSettings(s)
      applyAppSettings(s)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    isInitialSetupRequired().then(required => {
      setInitialSetupOpen(required)
      setInitialSetupChecked(true)
    }).catch(() => setInitialSetupChecked(true))
  }, [])

  return (
    <LangProvider>
      <AccountsProvider>
          <AppInner />
          {initialSetupChecked && initialSetupOpen && (
            <InitialSetup
              initialSettings={initialSettings || {}}
              onComplete={(settings) => {
                setInitialSettings(settings)
                setInitialSetupOpen(false)
              }}
            />
          )}
      </AccountsProvider>
    </LangProvider>
  )
}

