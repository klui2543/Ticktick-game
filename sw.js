/**
 * sw.js — service worker
 *
 * แคชเฉพาะเปลือกแอป (HTML/manifest/icon) เพื่อให้เปิดขึ้นทันทีแม้เน็ตช้า
 * ไม่แคชการเรียก API เด็ดขาด — ข้อมูลเควสต้องสดเสมอ
 * และ response ของ Apps Script มี token อยู่ใน URL ไม่ควรค้างในแคช
 */

const CACHE = 'taskgame-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ปล่อยผ่านทุกอย่างที่ไม่ใช่ไฟล์ของเราเอง (โดยเฉพาะ script.google.com)
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  // เปลือกแอป: ใช้แคชก่อนเพื่อความไว แล้วอัปเดตเบื้องหลัง
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request)
        .then(res => {
          if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
