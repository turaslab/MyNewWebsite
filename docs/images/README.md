# Fotoğraf klasörleri

- `blog/`: blog kapakları ve yazı içi fotoğraflar
- `games/`: oyun kapakları ve ekran görüntüleri
- `general/`: site genelinde kullanılan diğer görseller

Dosya adlarında boşluk ve Türkçe karakter kullanmamak işleri kolaylaştırır. Örnek: `persona-4-kapak.jpg`.

Bir blog kapağı için Markdown dosyasının üstüne:

```yaml
image: images/blog/persona-4-kapak.jpg
image_alt: Persona 4 oyunundan sarı tonlu bir sahne.
```

Yazının içine fotoğraf koymak için:

```markdown
![Fotoğrafın kısa açıklaması](images/blog/persona-4-ekran.jpg)
```
