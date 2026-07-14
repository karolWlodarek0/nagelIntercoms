# Nagel — Systemy Domofonowe

Nowoczesna, responsywna strona wizytówka (POC) firmy montującej **domofony i wideodomofony**
oraz systemy kontroli dostępu. Tryb jasny i ciemny, animacje, formularz kontaktowy.

Strona jest w 100% statyczna (HTML + CSS + JavaScript, bez frameworków i bez kroku budowania),
więc łatwo ją modyfikować i hostować w dowolnym miejscu.

## Struktura

```
nagelIntercoms/
├── index.html        # cała treść strony (sekcje: hero, oferta, o nas, proces, realizacje, opinie, FAQ, kontakt)
├── styles.css        # style + motyw jasny/ciemny (zmienne CSS w :root i [data-theme="dark"])
├── script.js         # motyw, menu mobilne, animacje, liczniki, walidacja formularza
└── .claude/
    ├── serve.js      # prosty lokalny serwer statyczny (Node, bez zależności)
    └── launch.json   # konfiguracja podglądu
```

## Uruchomienie lokalne

Wymagany Node.js. Z katalogu projektu:

```bash
node .claude/serve.js
```

Następnie otwórz **http://localhost:4321** w przeglądarce.
Port można zmienić: `PORT=8080 node .claude/serve.js`.

Alternatywnie dowolny serwer statyczny, np. `npx serve` albo `py -m http.server 4321`.

## Co można łatwo podmienić (POC → produkcja)

- **Dane firmy** — nazwa „Nagel", telefon `500 100 200`, e-mail `kontakt@nagel.pl`, adres — w `index.html`.
- **Kolory / motyw** — zmienne `--brand`, `--brand-2` na górze `styles.css`.
- **Treści** — teksty sekcji oferta / o nas / opinie / FAQ w `index.html`.
- **Zdjęcia** — obecnie użyto gradientów i grafik SVG (żeby strona działała offline);
  w sekcji „Realizacje" wystarczy podmienić `.shot-media` na `<img>`.
- **Formularz** — teraz działa jako demo (bez backendu). Do wysyłki podłącz własny
  endpoint / usługę (np. Formspree) w `script.js` w miejscu oznaczonym `// POC: no backend`.
