# Tura's Lab — Site Stratejisi

Durum: Dijital kimlik özeti onaylandı. Bu strateji, içerik ve geliştirme öncesi çalışma planıdır.

## 1. Konumlandırma

Tura's Lab; kullanıcının yaptığı işleri, kişisel yazılarını ve kültürel zevklerini aynı düzenli fakat keşfe açık dünyada birleştiren bağımsız dijital evidir.

Bir portfolyo sitesinin açıklığını taşır fakat portfolyo kalıbına sıkışmaz. Bir IndieWeb sitesinin kişiselliğini taşır fakat neon nostalji klişesini kullanmaz. Bir dashboard kadar düzenlidir fakat verimlilik ürünü gibi hissettirmez.

## 2. Tek Cümlelik Temel Mesaj

**Tura's Lab — yaptığım, oynadığım, dinlediğim ve üzerine düşündüğüm şeylerin internetteki odaları.**

Mesleki tanım sağlandığında ilk cümle, ziyaretçinin kullanıcının kimliğini ve yaptığı işi hemen anlayacağı biçimde tamamlanacak.

## 3. Hedef Kullanıcılar ve İhtiyaçları

### İş çevresi

- Kullanıcının kim olduğunu ve ne yaptığını hızlıca anlamak.
- Projeleri, üretim biçimini ve düşünme tarzını görmek.
- Güvenilir iletişim veya profesyonel bağlantı yolunu bulmak.

### Benzer zevklere sahip kişiler

- Oyun, müzik, film ve kitap seçimlerinde ortaklık keşfetmek.
- Kişisel yorumları ve kürasyonu görmek.
- RSS üzerinden yeni içerikleri takip etmek.

### Meraklı ziyaretçiler

- İlk ekranda ilginç bir ayrıntı yakalamak.
- Odalar arasında kaybolmadan dolaşmak.
- Mini oyun, müzik çubuğu veya Pomodoro gibi yaşayan parçalarla etkileşmek.

### Aile ve arkadaşlar

- Kullanıcının güncel üretimlerini ve ilgi alanlarını kolayca görmek.
- Teknik bilgi gerektirmeden sitede gezinmek.

## 4. Ana Deneyim Akışı

1. Ziyaretçi ilk ekranda `Tura's Lab`, kullanıcı adı ve mesleki tanımla karşılaşır.
2. Aynı ekranda ana odaların yaşayan önizlemelerini görür.
3. Bir widget içindeki güncel içeriği veya bölüm etiketini seçer.
4. Odanın tam sayfasına geçer; içerikleri tarar veya bir kaydı açar.
5. Bağlamsal bağlantılarla başka bir odaya geçer ya da RSS'e abone olur.

Ana sayfa bir karşılama metniyle alanı tüketmeyecek; kimliği kısa açıklayıp keşif yüzeyini ilk görünümde gösterecek.

## 5. Site Haritası

### İlk sürüm

- `/` — Lab / ana grid
- `/blog` — bütün kişisel yazılar
- `/blog/[slug]` — yazı ayrıntısı
- `/games` — oyun kütüphanesi
- `/music` — müzik ve albüm kütüphanesi
- `/projects` — yapılan işler ve üretim dokümantasyonu
- `/about` — kısa kimlik, yaklaşım ve bağlantılar
- `/rss.xml` — güncel yazı akışı

### Sonraki odalar

- `/films` — film kütüphanesi
- `/books` — kitap kütüphanesi
- `/play` — mini oyunlar ve küçük deneyler

İlk sürümde boş odalar navigasyonda aktif görünmeyecek. “Yakında” kartları ancak atmosfer veya beklenti açısından anlamlıysa kullanılacak.

## 6. Sayfaların Varlık Nedenleri

| Sayfa | Görevi | Ana içerik |
| --- | --- | --- |
| Ana grid | Kimliği açıklamak ve keşfi başlatmak | Son yazı, seçili oyun, müzik, proje, Pomodoro, kısa durum |
| Blog | Kullanıcının sesini taşımak | Kişisel yazılar ve gündelik dokümantasyon |
| Oyunlar | Zevki seçimler üzerinden göstermek | Oynanan/bitirilen oyunlar, kısa notlar, durum ve platform |
| Müzik | Sitenin atmosferini ve müzikal hafızayı taşımak | Albümler, sanatçılar, listeler ve music bar |
| Projeler | İş çevresine somut üretim göstermek | Proje özeti, rol, süreç, bağlantı ve dokümantasyon |
| Hakkında | İlk ekrandaki kısa kimliği derinleştirmek | Biyografi, yaklaşım, bağlantılar ve gizlilik sınırında kişisel ayrıntılar |
| RSS | Siteyi platformdan bağımsız takip ettirmek | Yeni blog yazıları |

## 7. Ana Sayfa İçerik Hiyerarşisi

1. Site adı, isim ve mesleki tanım
2. Son blog yazısı — grid içindeki en geniş widget
3. Oyun kütüphanesi — seçili veya son eklenen oyun
4. Müzik çubuğu / şimdi çalıyor
5. Proje veya güncel üretim
6. Pomodoro sayacı
7. Kısa not, alıntı veya durum
8. Site ağacı ve RSS

Mobilde bu sıra korunacak; önemli widget'lar ilk ekrana yakın kalacak. Masaüstündeki görsel konum, mobilde anlamsız bir sıralamaya dönüşmeyecek.

## 8. Eylem Dili

Klasik pazarlama CTA'ları kullanılmayacak.

- Birincil: **Odayı aç** / bağlama göre doğrudan bölüm adı
- Blog: **Bütün yazılar**
- Oyun: **Kütüphaneye git**
- Müzik: **Arşivi aç**
- Projeler: **Ne yaptım?**
- RSS: **Akışı takip et**

Kontroller köşeli, metin ağırlıklı ve bağlama yerleşik olacak; yuvarlak “pill” butonlar kullanılmayacak.

## 9. Güven Oluşturan Unsurlar

- İlk ekranda açık kimlik ve mesleki tanım.
- Gerçek proje bağlantıları ve abartısız rol açıklamaları.
- Yazı ve kütüphane kayıtlarında net tarih/güncelleme bilgisi.
- Çalışan bağlantılar ve erişilebilir iletişim yolu.
- Kullanıcının kendi sesiyle yazılmış içerik.
- Gereksiz başarı sayıları, müşteri logoları veya sahte sosyal kanıt kullanılmaması.

## 10. İçerik Modeli

- Blog yazıları: Markdown/MDX dosyaları.
- Oyun, müzik ve sonraki kütüphaneler: doğrulanmış alanlara sahip düzenli veri kayıtları.
- Projeler: kısa özet, tarih, rol, süreç, teknoloji ve bağlantı alanları.
- Widget'lar: bu kaynaklardan en güncel veya küratör tarafından seçilen kaydı otomatik çeker.
- Yönetim paneli: ilk sürüm dışında; gerçek içerik hacmi dosya yönetimini zorlaştırırsa yeniden değerlendirilir.

## 11. Teknik Yön

Mevcut saf HTML/CSS taslağı fikir prototipi olarak korunabilir; fakat çok sayfalı içerik, Markdown, otomatik RSS ve tema sistemi için statik site üretimi uygun olacaktır.

Önerilen yaklaşım: içerik odaklı, az istemci JavaScript'i kullanan statik bir mimari. Pomodoro, müzik çubuğu ve tema seçici yalnızca ihtiyaç duydukları kadar etkileşim kodu yükler. Nihai teknoloji kararı uygulama öncesi mevcut kodun dönüşüm maliyetiyle birlikte verilecek.

## 12. SEO ve Paylaşım Yapısı

- Her sayfa için özgün başlık ve açıklama.
- Blog yazıları için tarih, yazar ve sosyal paylaşım verileri.
- Projeler ve kişisel kimlik için uygun yapılandırılmış veri.
- Kalıcı, okunabilir URL'ler.
- Site haritası ve RSS.
- Sosyal paylaşım kartı; kullanıcı adı/mesleki tanım kesinleşince hazırlanacak.

## 13. Entegrasyonlar

### İlk sürüm

- RSS üretimi.
- Müzik çubuğunun yerel ve erişilebilir oynatma durumu.
- Tema tercihinin cihazda saklanması.

### Şimdilik kapsam dışı

- Giriş sistemi.
- Kullanıcı dashboard'u.
- Yönetim paneli.
- Minecraft veya spekülatif servis entegrasyonları.

## 14. Başarı Ölçütleri

- Ziyaretçi ilk ekranda kullanıcının kim olduğunu ve ne yaptığını anlayabiliyor.
- İlk ekranda en az üç farklı içerik odası keşfedilebiliyor.
- Blog, oyun ve müzik alanlarına mobilde rahatça ulaşılabiliyor.
- Yeni içerik eklemek kodu yeniden tasarlamayı gerektirmiyor.
- RSS geçerli ve güncel içerik üretiyor.
- Klavye navigasyonu, kontrast ve azaltılmış hareket tercihi çalışıyor.
- Site hızlı açılıyor ve gereksiz bağımlılık taşımıyor.

Gizlilik dostu analitik daha sonra eklenirse; oda geçişleri, içerik açılma oranı, geri dönen ziyaretçi ve RSS tıklaması gözlemlenebilir. Analitik zorunlu değildir.

## 15. Aşamalı Uygulama

1. Tasarım sistemi, responsive grid ve ana sayfanın gerçek içerikli ilk kesiti.
2. Blog içerik modeli, liste/ayrıntı sayfaları ve RSS.
3. Oyun kütüphanesi ve ana sayfa widget'ı.
4. Müzik kütüphanesi ile erişilebilir music bar.
5. Projeler ve hakkında sayfası.
6. Pomodoro ve kontrollü mikro etkileşimler.
7. Film, kitap, mini oyun ve ek temalar.
