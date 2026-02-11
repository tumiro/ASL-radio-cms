import { SiteConfig, PageContent } from './types';

// Konfiguracja strony klubowej
export const SITE_CONFIG: SiteConfig = {
  siteName: "Klub SP-RADIO",
  navigation: [
    { label: "Stacja Główna", slug: "/" },
    {
      label: "O Klubie",
      slug: "/klub",
      children: [
        { label: "Historia i Zarząd", slug: "/klub/historia" },
        { label: "Nasz Sprzęt (Shack)", slug: "/klub/sprzet" },
      ]
    },
    {
      label: "Aktywność",
      slug: "/aktywnosc",
      children: [
        { label: "Zawody i Dyplomy", slug: "/aktywnosc/zawody" },
        { label: "Wyprawy DX", slug: "/aktywnosc/dx" },
        { label: "Warsztaty Techniczne", slug: "/aktywnosc/warsztaty" }
      ]
    },
    { label: "Kontakt / QSL", slug: "/kontakt" }
  ]
};

// Treści podstron z tematyką radioamatorską
// Używamy zdjęć z Unsplash pasujących do tematyki (anteny, elektronika, radio)
export const MOCK_PAGES: Record<string, PageContent> = {
  "/": {
    title: "Łączymy Świat na Falach Eteru",
    slug: "/",
    // Zdjęcie anteny o zachodzie słońca / wieża telekomunikacyjna
    heroImage: "https://images.unsplash.com/photo-1541873676-a18131494184?auto=format&fit=crop&w=1920&q=80",
    body: "Witamy na stronie Klubu Krótkofalowców SP-RADIO. Jesteśmy grupą pasjonatów łączności radiowej, elektroniki i propagacji fal. Naszym celem jest edukacja, rywalizacja sportowa oraz budowanie mostów między ludźmi na całym świecie bez granic.",
    sections: [
      {
        heading: "Czym jest Krótkofalarstwo?",
        content: "To niezwykłe hobby techniczne pozwalające na nawiązywanie łączności radiowych (QSO) z najdalszymi zakątkami globu, a nawet ze stacją kosmiczną ISS, przy użyciu własnego sprzętu i anten.",
        // Zdjęcie sprzętu/mikrofonu
        image: "https://images.unsplash.com/photo-1520263118671-663851065c71?auto=format&fit=crop&w=800&q=80"
      },
      {
        heading: "Spotkania Klubowe",
        content: "Zapraszamy w każdy czwartek o 18:00 do naszej siedziby. Dyskutujemy o konstrukcjach antenowych, planujemy starty w zawodach i wymieniamy się kartami QSL.",
        // Zdjęcie grupy ludzi / spotkania
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "/klub": {
    title: "O Naszym Klubie",
    slug: "/klub",
    // Zdjęcie wewnątrz stacji radiowej
    heroImage: "https://images.unsplash.com/photo-1622630732303-8e94514a1746?auto=format&fit=crop&w=1920&q=80",
    body: "Nasz klub zrzesza operatorów o znakach wywoławczych z całego regionu. Posiadamy własny znak klubowy SP0DX i aktywnie promujemy nasze miasto w eterze.",
  },
  "/klub/historia": {
    title: "Historia i Zarząd",
    slug: "/klub/historia",
    // Stare zdjęcie lub tekstura papieru
    heroImage: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=1920&q=80",
    body: "Klub powstał w 1995 roku z inicjatywy lokalnych entuzjastów. Przez lata wyszkoliliśmy dziesiątki nowych operatorów, którzy zdobyli swoje świadectwa radiooperatora w klasie A i C.",
  },
  "/klub/sprzet": {
    title: "Nasz Shack (Sprzęt)",
    slug: "/klub/sprzet",
    // Elektronika, płytki drukowane, kable
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80",
    body: "Dysponujemy nowoczesnym transceiverem KF, wzmacniaczem mocy 1kW oraz systemem anten kierunkowych Yagi na pasma 20m, 15m i 10m. Posiadamy również sprzęt do pracy w terenie (QRP) oraz łączności satelitarnych.",
    sections: [
      {
        heading: "Anteny",
        content: "Naszą dumą jest 3-elementowa antena Yagi na maszcie kratownicowym oraz dipol na pasmo 80m rozwieszony między budynkami.",
        image: "https://images.unsplash.com/photo-1651616450534-712803b98453?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "/aktywnosc": {
    title: "Nasza Aktywność",
    slug: "/aktywnosc",
    // Mapa świata lub globus
    heroImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80",
    body: "Nie siedzimy w miejscu. Krótkofalarstwo to akcja! Zawody, wyjazdy terenowe i eksperymenty techniczne to nasza codzienność.",
  },
  "/aktywnosc/zawody": {
    title: "Zawody (Contesting)",
    slug: "/aktywnosc/zawody",
    // Słuchawki, mikrofon, skupienie
    heroImage: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=1920&q=80",
    body: "Regularnie startujemy w zawodach takich jak CQ WW DX, SP DX Contest czy IARU HF Championship. Rywalizujemy ze stacjami z całego świata o jak najlepszy wynik punktowy.",
  },
  "/aktywnosc/dx": {
    title: "Polowania na DX-y",
    slug: "/aktywnosc/dx",
    // Krajobraz egzotyczny
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
    body: "DX to skrót oznaczający daleką łączność. Nasi klubowicze mają na koncie potwierdzone łączności (karty QSL) z ponad 300 podmiotami DXCC, w tym z takimi rzadkościami jak Korea Północna czy Wyspa Bouvet.",
  },
  "/aktywnosc/warsztaty": {
    title: "Warsztaty Techniczne",
    slug: "/aktywnosc/warsztaty",
    // Lutownica, warsztat
    heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
    body: "Budujemy własne anteny, filtry pasmowe i proste urządzenia nadawczo-odbiorcze. Uczymy lutowania i podstaw elektroniki.",
  },
  "/kontakt": {
    title: "Kontakt i QSL Bureau",
    slug: "/kontakt",
    // Skrzynka pocztowa lub stara papeteria
    heroImage: "https://images.unsplash.com/photo-1579847188804-ec724eeeb313?auto=format&fit=crop&w=1920&q=80",
    body: "Nasze biuro QSL działa przy oddziale terenowym PZK. Karty wysyłamy raz w miesiącu. Zapraszamy do kontaktu mailowego lub radiowego na częstotliwości 145.500 MHz (wywołanie).",
  }
};