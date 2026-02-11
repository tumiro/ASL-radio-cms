import { GoogleGenAI } from "@google/genai";
import { MOCK_PAGES, SITE_CONFIG } from '../constants';

// Initialize Gemini Client Lazily
// This prevents the app from crashing on load if the API_KEY is missing.
let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Brak klucza API (API_KEY). Skonfiguruj go w ustawieniach Netlify.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

const getSystemInstruction = (): string => {
  // Construct a context string from the mock website content
  const context = Object.values(MOCK_PAGES).map(page => {
    return `Strona: ${page.title} (Slug: ${page.slug})\nTreść: ${page.body}\n`;
  }).join("\n---\n");

  const navigation = JSON.stringify(SITE_CONFIG.navigation);

  return `
    Jesteś wirtualnym asystentem na stronie Klubu Krótkofalowców "${SITE_CONFIG.siteName}".
    Przyjmij rolę "Elmera" - doświadczonego, pomocnego krótkofalowca, który chętnie dzieli się wiedzą z nowicjuszami.
    Używaj terminologii radiowej (QSO, QSL, 73, DX, pasma, antena Yagi), ale tłumacz trudniejsze pojęcia.
    
    KONTEKST STRONY:
    ${context}

    STRUKTURA NAWIGACJI:
    ${navigation}

    ZASADY:
    1. Bądź bardzo uprzejmy i pomocny. Na pożegnanie używaj kodu "73" (pozdrowienia).
    2. Odpowiadaj krótko i na temat.
    3. Jeśli nie znasz odpowiedzi na podstawie kontekstu, powiedz "Niestety nie mam tego w logu (nie ma na stronie). Zapraszam do kontaktu bezpośredniego lub na pasmo."
    4. Mów w języku polskim.
    5. Zachęcaj do odwiedzenia siedziby klubu i zrobienia licencji radiowej.
  `;
};

export const sendMessageToGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    
    // We utilize the chat functionality to maintain context if needed.
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Przepraszam, zakłócenia na paśmie (błąd generowania).";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message && error.message.includes("API_KEY")) {
      return "Błąd konfiguracji: Brak klucza API w systemie.";
    }

    return "Przepraszam, chwilowy brak propagacji (błąd połączenia). Spróbuj później.";
  }
};