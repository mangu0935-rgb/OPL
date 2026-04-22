# QA Checklist — Tombol Download (PDF & Excel)

Pastikan tombol-tombol pilihan format download di aplikasi tetap
**berlatar putih dengan teks navy yang terbaca** pada semua
kombinasi tema aplikasi & OS.

## Lingkup
Halaman / modal yang terdampak:
- **Invoice Management** → tombol toolbar **Download** → modal "Download Invoice"
  - Tombol **Excel (.xlsx)**
  - Tombol **PDF (.pdf)**
- (Tambahkan halaman lain di sini bila modal serupa ditambahkan)

Kelas CSS yang dipakai: `.btn-format-light` (lihat `src/index.css`).
Kelas ini memaksa `background-color: #ffffff !important` sehingga
warna tidak terbawa cascade tema gelap.

## Matriks pengujian manual

| # | Tema Aplikasi | OS prefers-color-scheme | Hasil yang diharapkan |
|---|---------------|--------------------------|------------------------|
| 1 | Light         | Light                    | BG putih, teks navy, ikon biru |
| 2 | Light         | Dark                     | BG putih, teks navy, ikon biru |
| 3 | Dark          | Light                    | BG putih, teks navy, ikon biru |
| 4 | Dark          | Dark                     | BG putih, teks navy, ikon biru |

### Cara mengubah tema
- **Tema aplikasi**: klik ikon ☀️/🌙 di header.
- **OS dark mode**:
  - macOS: System Settings → Appearance → Dark
  - Windows: Settings → Personalization → Colors → Dark
  - Linux (GNOME): Settings → Appearance → Dark
  - Atau di DevTools: Cmd/Ctrl+Shift+P → "Emulate CSS prefers-color-scheme: dark"

### Langkah uji setiap baris
1. Atur tema aplikasi & OS sesuai baris matriks.
2. Buka **Dashboard → Invoice Management**.
3. Klik tombol **Download** di toolbar kanan atas.
4. Pada modal "Download Invoice":
   - [ ] Latar tombol **Excel (.xlsx)** = putih solid (#FFFFFF).
   - [ ] Latar tombol **PDF (.pdf)** = putih solid (#FFFFFF).
   - [ ] Teks "Excel (.xlsx)" / "PDF (.pdf)" tampak gelap (navy), kontras tinggi.
   - [ ] Ikon (FileDown / Printer) berwarna biru brand.
   - [ ] Saat hover: BG tetap putih, border berubah biru, ada elevasi shadow ringan.
   - [ ] Saat keyboard focus (Tab): ada outline biru jelas.
5. Tutup modal, verifikasi tombol toolbar lain tidak berubah.

## Verifikasi otomatis
Test unit memverifikasi kelas `.btn-format-light` selalu terpasang
pada kedua tombol di ketiga skenario tema:

```
src/test/download-buttons.test.tsx
```

Jalankan via tool **run-tests** atau:
```
npx vitest run src/test/download-buttons.test.tsx
```

## Regresi yang harus dihindari
- ❌ Mengganti kelas `.btn-format-light` dengan `border-input` /
      `bg-card` polos — keduanya akan mengikuti token tema gelap.
- ❌ Menambahkan `dark:bg-*` yang menimpa putih.
- ❌ Membuat modal download baru tanpa memakai `.btn-format-light`.

Jika menambah modal download baru, **pakai ulang** `.btn-format-light`
dan tambahkan baris baru di tabel Lingkup di atas.
