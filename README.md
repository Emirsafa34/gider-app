📱 Gider Takip Uygulaması

Kişisel harcamaları takip eden, kategorilere ayıran ve aylık bütçe kontrolü sağlayan mobil bir uygulama.
React Native + Expo + SQLite ile geliştirilmiştir. Offline-first, hafif ve hızlıdır.

🚀 Özellikler

Harcama / gelir ekleme

Kategorilere ayırma

Aylık bazda toplam gider görüntüleme

SQLite üzerinde offline depolama

Sekmeli navigasyon (Özet, İşlemler, Bütçe, Ayarlar)

Basit, temiz UI

TypeScript destekli mimari

Yakında:

Bütçe limitleri (%80 / %100 uyarı)

Kategori grafikleri

CSV içe/dışa aktarma

Supabase ile bulut senkronizasyonu

🛠️ Kullanılan Teknolojiler

React Native / Expo

Expo Router

SQLite (expo-sqlite)

Zustand (lightweight state)

Dayjs, Dinero.js

Victory Native (grafikler)

TypeScript
📁 Proje Yapısı
gider-app/
  app/
    _layout.tsx
    index.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      transactions.tsx
      budgets.tsx
      settings.tsx
  src/
    db/
      schema.sql
      client.ts
      queries.ts
    state/
      useStore.ts
    utils/
      date.ts
      money.ts
    components/
      TransactionForm.tsx
  assets/
  package.json
  README.md
  Kurulum

Projeyi klonladıktan sonra:
npm install
npx expo start

Veritabanı ...
SQLite schema (schema.sql):

accounts

categories

transactions

budgets

Tutarlar kuruş olarak integer tutulur (ör: 120,50 TL → 12050).

🎯 Yol Haritası

 Proje iskeleti

 Tab navigasyon

 İşlem ekleme ekranı

 Bütçe modülü

 Grafik ekranı

 CSV import/export

 Supabase senkronizasyonu



