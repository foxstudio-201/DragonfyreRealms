<div align="center">

<br/>

<!-- Logo -->
<img src="https://raw.githubusercontent.com/foxstudio-201/dragonfyrerealms/main/public/icon.png" width="96" height="96" alt="Dragonfyre Realms Logo" />

<h1>Dragonfyre Realms</h1>

<p>
  <strong>Dragonfyre Realms — Minecraft Launcher</strong>
  <br/>
  Forge 1.20.1 · Tự động vào server Dragonfyre Realms · Hiệu ứng sao bay tím huyền bí
</p>

<p>
  <a href="https://github.com/foxstudio-201/dragonfyrerealms/releases"><img src="https://img.shields.io/github/package-json/v/foxstudio-201/dragonfyrerealms?style=for-the-badge&label=version&labelColor=0a0a0a&color=a78bfa" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-a78bfa?style=for-the-badge&labelColor=0a0a0a" alt="License" /></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Windows-0078D4?style=flat-square&labelColor=0a0a0a&logo=windows11&logoColor=0078D4" alt="Windows" />
  <img src="https://img.shields.io/badge/Linux-FCC624?style=flat-square&labelColor=0a0a0a&logo=linux&logoColor=FCC624" alt="Linux" />
  <img src="https://img.shields.io/badge/Arch_(AUR)-1793D1?style=flat-square&labelColor=0a0a0a&logo=archlinux&logoColor=1793D1" alt="Arch AUR" />
  <img src="https://img.shields.io/badge/Electron-47848F?style=flat-square&labelColor=0a0a0a&logo=electron" alt="Electron" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&labelColor=0a0a0a&logo=react" alt="React" />
</p>

<p>
  <a href="#features"><b>Features</b></a> &nbsp;·&nbsp;
  <a href="#getting-started">Build from Source</a> &nbsp;·&nbsp;
  <a href="#aur">AUR Local</a>
</p>

<br/>

</div>

---

## Features

| | Feature | Description |
|:--:|---|---|
| <img src="https://api.iconify.design/ph:rocket-duotone.svg?color=%23a78bfa&width=24" width="24" /> | **Forge 1.20.1 cố định** | Một profile duy nhất, tự cấu hình và khởi chạy ngay |
| <img src="https://api.iconify.design/ph:server-duotone.svg?color=%23a78bfa&width=24" width="24" /> | **Tự vào server** | Nút Play mở thẳng Dragonfyre Realms Server, hiển thị ping/online/người chơi trực tiếp |
| <img src="https://api.iconify.design/ph:star-duotone.svg?color=%23a78bfa&width=24" width="24" /> | **Sao bay theo chuột** | Hiệu ứng sao bay có bloom, bật/tắt trong cài đặt giao diện |
| <img src="https://api.iconify.design/ph:terminal-window-duotone.svg?color=%23a78bfa&width=24" width="24" /> | **Log trong trang** | Console hiển thị dạng modal bên cạnh thông tin profile |
| <img src="https://api.iconify.design/ph:palette-duotone.svg?color=%23a78bfa&width=24" width="24" /> | **Giao diện tím huyền ảo** | Nền launcher riêng, giao diện tối giản chỉ 1 trang chính |

> Game chạy ở chế độ **offline** (tên người chơi nhập trực tiếp, tự lưu tài khoản).

---

## Getting Started

Build Dragonfyre Realms từ mã nguồn.

### Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

### Install & Run

```bash
git clone git@github.com:foxstudio-201/dragonfyrerealms.git
cd dragonfyrerealms

npm install

# Chạy ở chế độ phát triển
npm run electron:dev
```

### Package

```bash
npm run build          # Vite build
npx electron-builder --linux dir   # đóng gói Electron cho Linux → dist-electron/
```

---

## AUR (Arch Linux)

Gói local tại [`packaging/aur/`](packaging/aur/):

```bash
cd packaging/aur
makepkg -i
```

Sau mỗi lần đổi code phải **tăng `pkgrel`** trong `PKGBUILD` và `.SRCINFO`, rồi:
`tar -hcJf linux-unpacked.tar.xz -C ../../dist-electron linux-unpacked && makepkg -f`.

> Ảnh nền launcher đặt tại `src/assets/ciscobackground.png`.
> Logo launcher: `src/assets/DragonfyreRealms.png`.
> Logo homepage: `src/assets/dragonfyre-logo-better.png`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS 4 |
| **Desktop Shell** | Electron |
| **IPC** | Electron contextBridge / ipcMain |
| **Packaging** | electron-builder · AUR (makepkg) |

---

## License

Released under the [MIT License](LICENSE).

---

<div align="center">

Made with care by **FoxStudio**

<a href="https://github.com/foxstudio-201/dragonfyrerealms">Star on GitHub</a>

</div>
