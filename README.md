# Tura's Lab

Tura'nın kişisel yazılarını, oyunlarını, müziklerini ve projelerini odalar hâlinde bir araya getiren responsive kişisel site.

## Önizleme

```sh
python3 -m http.server 8000 --directory tugratunc.me
```

Ardından `http://localhost:8000` adresini açın.

## Mevcut odalar

- Ana widget grid'i
- Blog
- Oyun kütüphanesi
- Müzik arşivi
- Projeler
- Hakkında
- RSS

## İçerik ekleme

İlk sürüm bağımlılıksız, statik HTML/CSS/JavaScript kullanır. Sahte kişisel içerik eklenmedi; boş kütüphane durumları bilerek bırakıldı.

- Ana sayfa: `tugratunc.me/index.html`
- Blog: `tugratunc.me/blog/index.html`
- Oyunlar: `tugratunc.me/games/index.html`
- Müzik: `tugratunc.me/music/index.html`
- Projeler: `tugratunc.me/projects/index.html`
- RSS: `tugratunc.me/rss.xml`

İçerik hacmi büyüdüğünde Markdown/veri dosyalarından sayfa ve RSS üreten bir yapı eklenebilir. Yönetim paneli ancak elle düzenleme gerçek bir sorun hâline gelirse düşünülmelidir.

## Tema sistemi

Temalar `tugratunc.me/css/style.css` içindeki CSS değişkenleriyle tanımlanır. Seçim tarayıcıda saklanır.

- Paper Dashboard
- Night Garage
- City Pop Morning
- Arabesque Lounge
- Low Poly Memory
