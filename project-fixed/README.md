# KN-Studio Website — Projektstruktur & Launch-Checkliste

## Ordnerstruktur

```
project/
├── index.html              Startseite
├── 404.html                Fehlerseite (bei Hosting als Standard-404 einrichten)
├── robots.txt               Crawler-Steuerung
├── sitemap.xml               Seitenverzeichnis für Suchmaschinen
├── css/
│   ├── style.css             Haupt-Styles (Layout, Theme, Animationen)
│   └── fonts.css             Lokal gehostete Schriftarten (DSGVO-konform)
├── js/
│   └── script.js             Gesamte Funktionalität (Theme-Toggle, Slider, Formular, etc.)
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── before.jpg        Vorher-Bild im Slider
│   │   └── after.jpg         Nachher-Bild im Slider
│   └── fonts/                ⚠️ noch leer — siehe css/fonts.css für Anleitung
└── legal/
    ├── impressum.html        ⚠️ Platzhalter, vor Launch ausfüllen
    ├── datenschutz.html      ⚠️ Platzhalter, vor Launch ausfüllen
    ├── agb.html               ⚠️ Platzhalter, vor Launch ausfüllen
    └── legal.css              Gemeinsames Stylesheet für die Rechts-Seiten
```

Lokal testen: Ordner mit einem einfachen lokalen Server öffnen (nicht per
Doppelklick als `file://`, da manche Browser dann Skripte blockieren), z.B.:

```
cd project
python3 -m http.server 8000
```

Dann im Browser: `http://localhost:8000`

---

## ✅ Checkliste vor dem Go-Live

### 1. Rechtliches (Pflicht in Deutschland)
- [ ] `legal/impressum.html` mit echten Unternehmensdaten ausfüllen
- [ ] `legal/datenschutz.html` prüfen/ergänzen, sobald Analyse- oder
      Marketing-Tools (Google Analytics, Meta-Pixel etc.) hinzukommen
- [ ] `legal/agb.html` durch echte AGB ersetzen (idealerweise anwaltlich
      geprüft, besonders bei Verträgen mit Privatkunden)
- [ ] Alle Inhalte juristisch prüfen lassen, bevor die Seite live geht

### 2. Schriftarten (DSGVO)
- [ ] Anleitung in `css/fonts.css` befolgen: Space Grotesk + Inter als
      `.woff2`-Dateien herunterladen und in `assets/fonts/` ablegen
- [ ] Ohne diesen Schritt nutzt der Browser automatisch System-Schriften
      (die Seite funktioniert, sieht aber leicht anders aus)

### 3. Cookies & Tracking
- [ ] Aktuell werden NUR technisch notwendige Speicher genutzt
      (Theme-Einstellung, Passwortschutz) — kein Cookie-Banner nötig
- [ ] Sobald Analytics/Tracking hinzukommt: echtes Cookie-Consent-Tool
      mit Opt-in einbauen (z.B. Klaro, CookieYes, Borlabs) UND
      Datenschutzerklärung entsprechend ergänzen
- [ ] Datenschutzfreundliche Alternative erwägen: Plausible oder
      selbst gehostetes Matomo statt Google Analytics

### 4. Formular
- [ ] `js/script.js` → `sendForm()`: echten Versanddienst anbinden
      (siehe Kommentar in der Datei — Formspree ist der schnellste Weg)
- [ ] Ohne diesen Schritt gehen alle Formular-Einsendungen aktuell verloren!

### 5. SEO
- [ ] `sitemap.xml` und `robots.txt`: Platzhalter-Domain durch die
      echte Domain ersetzen
- [ ] `index.html`: `<link rel="canonical">` und Open-Graph-Tags mit
      echter Domain aktualisieren
- [ ] LocalBusiness-Schema (`<script type="application/ld+json">` im
      `<head>`) mit echten Unternehmensdaten füllen
- [ ] Echtes Favicon ergänzen (aktuell wird das Logo als Notlösung genutzt)
- [ ] Google Search Console einrichten und Sitemap einreichen, sobald live

### 6. Passwortschutz entfernen
- [ ] Sobald die Seite final ist: Passwort-Gate-Logik in `index.html`
      (Element `#pwgate`) und den zugehörigen Code in `js/script.js`
      entfernen, damit Besucher nicht mehr danach gefragt werden

### 7. Technisches
- [ ] SSL-Zertifikat / HTTPS aktivieren (bei den meisten Hosting-Anbietern
      heute automatisch inklusive, z.B. via Let's Encrypt)
- [ ] `404.html` beim Hosting-Anbieter als Standard-Fehlerseite hinterlegen
- [ ] WhatsApp-Link in `index.html` (`#wa`) mit echter Nummer aktualisieren
- [ ] Telefonnummer und E-Mail-Adresse überall im Code suchen und ersetzen
      (aktuell Platzhalterwerte wie `0800 / 123 456 7`)
- [ ] Seite auf mehreren Browsern/Geräten testen (Chrome, Safari, Firefox,
      iOS, Android)
- [ ] Ladezeit prüfen, z.B. mit https://pagespeed.web.dev/

---

## Hinweis zur Wiederverwendung für Kundenprojekte

Diese Struktur ist bewusst so aufgebaut, dass sie als Vorlage für künftige
Kundenprojekte dient:

1. Ordner `project/` komplett kopieren
2. In `index.html`: Texte, Farben (CSS-Variablen in `style.css` unter
   `:root`), Bilder in `assets/images/` austauschen
3. Legal-Seiten mit den Daten des jeweiligen Kunden neu befüllen
4. Logo in `assets/images/logo.png` ersetzen

Die CSS-Variablen-Architektur (siehe oberer Teil von `css/style.css`)
macht es möglich, das komplette Farbschema einer neuen Marke anzupassen,
indem nur die `:root`-Werte geändert werden — der Rest des Codes bleibt
unverändert.
