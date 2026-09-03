# Tura's Lab — Yaratıcı Yön

## Tavsiye: Analog Lab Grid

Ana yön; eski otomobil göstergelerinin işlevsel netliğini, bağımsız kültür dergilerinin editoryal düzenini ve erken dijital grafiklerin dokusunu birleştiren köşeli bir widget sistemidir.

PS1 veya Persona estetiği doğrudan taklit edilmeyecek. Bu referanslardan sınırlı renk blokları, doku, keskin tipografi hiyerarşisi ve beklenmedik oda geçişleri alınacak.

### Kişilik → tasarım → etki

| Kişilik sinyali | Tasarım kararı | Ziyaretçi üzerindeki etkisi |
| --- | --- | --- |
| Çok yönlü merak | Farklı boyutlarda ama ortak kurallı widget'lar | İçerik çeşitliliğini dağınıklık olmadan hissettirir |
| Karmaşık huzur | Sabit grid, geniş aralıklar, sınırlı vurgu renkleri | Zenginliği korurken gözün dinlenmesini sağlar |
| Zevkin seçimlerle görünmesi | Her odada küratör notu ve seçili içerik | Kişiliği doğrudan iddia yerine kanıtla gösterir |
| Eski otomobil/JDM ilgisi | Teknik etiketler, gösterge benzeri durum alanları, metalik olmayan koyu çizgiler | Mekanik karakter verir, araba sitesi taklidine dönüşmez |
| PS1 ve erken dijital grafik ilgisi | Seçili görsellerde düşük çözünürlüklü doku ve kontrollü piksel ayrıntısı | Beklenmedik “aaa” anları oluşturur |
| Sakin etkileşim tercihi | Hareketsiz temel yüzey; yalnızca Pomodoro/music bar canlı | Siteyi oyuncaklaştırmadan yaşayan bir alan hissi verir |

## İlk Tema: Paper Dashboard

İlk sürüm için en hızlı ve içerik açısından en güvenli tema.

### Renk sistemi

- Ana zemin: sıcak kırık beyaz — yaklaşık %60
- Widget yüzeyleri: kâğıt beyazı / açık gri — yaklaşık %25
- Metin ve çerçeve: kömür siyahı — yaklaşık %10
- Vurgu: koyu bordo veya pas kırmızısı — yaklaşık %5
- İkincil teknik vurgu: soluk petrol mavisi, yalnızca durum/etiket alanlarında

Kesin renk değerleri tarayıcı üzerinde kontrast kontrolüyle belirlenecek. Neon ve yüksek doygunluklu geniş yüzeylerden kaçınılacak.

### Tipografi

- Başlıklar: karakterli, dar veya hafif mekanik bir display sans.
- Gövde: uzun kişisel yazılarda rahat okunan nötr sans/serif.
- Etiketler ve durumlar: monospace; bütün siteyi monospace yapmamak gerekir.

Bu ayrım, “kişisel dergi” ile “lab göstergesi” katmanlarını birbirinden ayırır.

### Grid ve boşluk

- Masaüstünde 12 kolonlu temel grid; widget'lar 3, 4, 6 veya 8 kolon kaplayabilir.
- Tablet görünümünde iki ana kolon.
- Mobilde önem sırasına göre tek kolon; yatay taşma yok.
- Kutular arası boşluk, kutu içi boşluktan belirgin biçimde büyük olacak; böylece yoğun içerik nefes alır.

### Yüzey ve kenarlar

- Köşe yarıçapı yok veya en fazla 2–3 px.
- İnce, koyu ve belirgin çerçeveler.
- Büyük yumuşak gölgeler yerine küçük ofset gölge veya çift çizgi ayrıntısı.
- Hafif kâğıt/tarama dokusu; metin okunurluğunu etkilemeyecek düzeyde.

### İkonlar

- Basit çizgi ikonlar veya bölüm bazlı küçük özgün işaretler.
- Emoji, ikon seti ve piksel ikon aynı yüzeyde rastgele karıştırılmayacak.
- İkon, metin etiketinin yerine tek başına anlam taşımak zorunda bırakılmayacak.

### Navigasyon

- Ana site ağacı masaüstünde sabit bir widget olarak görünür.
- Mobilde üst çubuk veya açık bölüm listesi; hamburger menü tek erişim yolu olmayacak.
- Her odada Lab'e dönüş ve komşu odalara geçiş görünür kalır.

### Hareket

- Widget hover/focus durumunda 1–2 px ofset, çerçeve veya renk değişimi.
- Sayfa geçişleri kısa ve sade.
- Pomodoro ilerlemesi ve music bar zaman çizgisi işlevsel hareket sağlar.
- `prefers-reduced-motion` ile tüm dekoratif hareketler kapanır.

### CTA dili

- Büyük pazarlama butonları yerine widget başlığında metin bağlantıları.
- Köşeli, altı çizili veya çerçeveli kontroller.
- “Keşfet” gibi jenerik ifadeler yerine “Bütün yazılar”, “Kütüphaneye git”, “Arşivi aç”.

## Gelecekteki Tema Ailesi

Temalar yalnızca renk değişimi olmamalı; aynı bilgi mimarisini korurken farklı kişisel atmosferler sunmalıdır.

1. **Paper Dashboard** — açık, editoryal ve ilk varsayılan tema.
2. **Night Garage** — kömür, koyu lacivert, ölçülü gösterge ışıkları; neon cyberpunk değil.
3. **City Pop Morning** — krem, soluk gök mavisi, mercan ve arşiv baskısı dokuları.
4. **Arabesque Lounge** — koyu bordo, tütün, pirinç ve sıcak kâğıt tonları.
5. **Low Poly Memory** — düşük çözünürlüklü görsel ayrıntılar ve PS1 dönemine kontrollü gönderme.

İlk sürüm yalnızca Paper Dashboard'u uygular. Tema altyapısı CSS değişkenleri ve saklanan kullanıcı tercihiyle diğerlerini sonradan eklemeyi mümkün kılar.

## Alternatif Yönler

### 2. Night Garage

**Avantaj:** Otomobil/JDM referansını güçlü ve atmosferik biçimde taşır.

**Risk:** Kolayca neon cyberpunk veya araç dashboard'u taklidine dönüşebilir; blog okuma konforu daha zor korunur.

### 3. Independent Culture Index

**Avantaj:** Blog, müzik ve oyun kürasyonunu dergi/arşiv gibi güçlü gösterir.

**Risk:** Fazla editoryal kalırsa mini oyunlar, Pomodoro ve oda metaforu sonradan eklenmiş hissedebilir.

## Neden Analog Lab Grid?

Bu yön, ilk sürümün kolay ve hızlı uygulanmasını sağlar; ancak gelecekte Night Garage ve diğer temalara dönüşebilecek sağlam bir görsel iskelet kurar. Hem iş çevresinin aradığı açıklığı hem de meraklı ziyaretçinin beklediği kişisel sürprizi aynı ana sayfada taşıyabilir.
