# Tura's Lab

Bağımlılığı ve kurulum komutu olmayan, düz HTML/CSS/JavaScript ile çalışan kişisel site.

## VS Code ile açmak

1. Depoda `docs/index.html` dosyasını aç.
2. Sağ alttaki **Go Live** düğmesine bas veya dosyaya sağ tıklayıp **Open with Live Server** seç.
3. Site tarayıcıda açılır. Kaydettikçe sayfa yenilenir.

`index.html` dosyasına çift tıklamak yerine Live Server kullanmak gerekir; tarayıcı Markdown dosyalarını güvenlik nedeniyle `file://` üzerinden okuyamaz.

## Dosya düzeni

```text
docs/
├── index.html          # ana sayfa
├── blog.html           # blog listesi + yazı okuyucu
├── games.html          # oyun listesi + oyun notu okuyucu
├── music.html
├── projects.html
├── about.html
├── blog/               # yalnızca blog verileri
│   ├── index.json
│   └── blog_template.md
├── games/              # yalnızca oyun verileri
│   ├── index.json
│   └── game_template.md
├── images/             # fotoğraflar
│   ├── blog/
│   ├── games/
│   └── general/
├── css/style.css
└── js/main.js
```

Artık sitenin ikinci bir kopyası yoktur. `dist/`, `.openai/` ve yayınlama betikleri kaldırıldı. Klasörün adının `docs` olmasının nedeni GitHub Pages'in bu klasörü doğrudan yayınlayabilmesidir.

## Blog yazısı eklemek

1. `docs/blog/blog_template.md` dosyasını kopyala.
2. Kopyaya boşluksuz bir ad ver: örneğin `persona-4-hakkinda.md`.
3. Dosyanın üstündeki başlık, tarih, özet ve etiketleri değiştir; altına yazını yaz.
4. `docs/blog/index.json` içindeki listeye dosya adını ekle:

```json
{
  "posts": [
    "persona-4-hakkinda.md"
  ]
}
```

Kaydedince yazı hem `blog.html` içinde hem ana sayfadaki son yazı kutusunda görünür. Birden fazla dosya varsa ana sayfa tarihi en yeni olanı seçer. `draft: true` yazarsan dosya listede görünmez.

## Oyun eklemek

Aynı mantıkla `docs/games/game_template.md` dosyasını kopyala ve dosya adını `docs/games/index.json` içindeki `games` listesine ekle.

```json
{
  "games": [
    "minecraft.md"
  ]
}
```

## Fotoğraf eklemek

Fotoğrafı türüne göre `docs/images/blog/`, `docs/images/games/` veya `docs/images/general/` klasörüne koy.

Bir yazının ya da oyunun kapak görseli olması için Markdown dosyasının üst bölümüne şunları yaz:

```yaml
image: images/blog/persona-4-kapak.jpg
image_alt: Persona 4 oyunundan sarı tonlu bir sahne.
```

Oyun görsellerinde yol `images/games/...` olur. Fotoğrafı yazının arasına yerleştirmek için:

```markdown
![Fotoğrafın kısa açıklaması](images/blog/persona-4-ekran.jpg)
```

Desteklenen biçimler: JPG, JPEG, PNG, WebP, GIF ve AVIF. Dosya adlarında boşluk ve Türkçe karakter kullanmamak daha güvenlidir.

## RSS hakkında

`docs/rss.xml` düz bir dosyadır. Bu sade yapıda blog yazısından otomatik RSS üretimi yoktur; yeni yazı yayımlarken RSS kaydını da elle eklemek gerekir. İleride gerçekten yorucu olursa yalnızca bu iş için küçük bir üretim betiği eklenebilir.

## Temalar

Beş tema `docs/css/style.css` içindeki CSS değişkenleriyle tanımlanır. Seçilen tema tarayıcıda saklanır.
