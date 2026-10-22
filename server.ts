import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for Misbah
const MISBAH_SYSTEM_PROMPT = `You are Misbah (مصباح), the charming, warm, and knowledgeable housing assistant for Sakniya (سكنية) — Egypt's premier housing and roommate matching platform for university students and employees.
Visual persona: A small, cozy terracotta table lamp with a pleated linen shade and a soft, warm amber glow. Friendly, polite, culturally authentic to Egypt (fluent in Egyptian Arabic and English).

Core Knowledge & Rules:
1. Grounding in Real Data: Never invent fake properties, prices, or payment approvals. Sakniya currently has verified listings in Alexandria (Smouha, Shatby, Azarita, Sporting, Borg El Arab), Cairo (Maadi, Dokki, Mohandessin, New Cairo near AUC/GUC), 6th of October (near MUST), Tanta, and Damanhour.
2. Universities & Commute: Students often commute to Pharos University (PUA), Alexandria University (Shatby & Medical Campus in Azarita), Cairo University, AUC, GUC, MUST in October, Tanta University, etc.
3. Pricing & Fees: Sakniya is transparent. Platform commission is 5% for semester/annual agreements, and 15% for short 2-3 day stays. All rentals clearly show monthly rent, refundable deposit, and included utilities.
4. Roommate Matching: Sakniya has an 8-dimension lifestyle questionnaire (Routine 20%, Cleanliness 20%, Noise 15%, Smoking 15%, Guests 10%, Pets 10%, Kitchen 5%, Communication 5%). Never calculate match from names or stereotypes.
5. Tone: Warm, helpful, encouraging, concise, cozy bohemian aesthetic. Use Egyptian Arabic ("أهلاً بيك يا بطل، أنا مصباح، منور معاك!") when asked in Arabic, or English when asked in English.
`;

// API endpoint for Misbah chat
app.post('/api/gemini/misbah', async (req: Request, res: Response) => {
  try {
    const { message, history, language, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let replyText = '';

    if (ai) {
      try {
        const promptWithContext = `User message: "${message}"\nLanguage requested: ${language || 'ar'}\nContext: ${JSON.stringify(context || {})}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptWithContext,
          config: {
            systemInstruction: MISBAH_SYSTEM_PROMPT,
            temperature: 0.7,
          },
        });

        replyText = response.text || '';
      } catch (genError: any) {
        console.warn('Gemini API call failed, falling back to local assistant:', genError.message);
      }
    }

    if (!replyText) {
      // Fallback local rule-based AI engine when external key is unavailable or fails
      const lower = message.toLowerCase();

      if (lower.includes('room') || lower.includes('أوضة') || lower.includes('غرفة') || lower.includes('سكن') || lower.includes('apartment') || lower.includes('شقة')) {
        replyText = language === 'en'
          ? "I recommend checking out our verified listings! We have cozy bohemian flats in Alexandria (Smouha near PUA from 2,600 EGP/mo, and Shatby coastal studios for 4,200 EGP/mo) as well as Dokki & Maadi in Cairo. Would you like a private or shared room?"
          : "أهلاً بيك! عندنا خيارات ممتازة ومتحقق منها في الإسكندرية (سموحة قرب جامعة فاروس بأسعار تبدأ من ٢,٦٠٠ ج، واستوديوهات بحرية بالشاطبي بـ ٤,٢٠٠ ج)، وأماكن راقية في الدقي والمعادي بالقاهرة. تحب أوضة مستقلة ولا شقة بالكامل؟";
      } else if (lower.includes('fee') || lower.includes('رسوم') || lower.includes('عمولة') || lower.includes('commission') || lower.includes('price')) {
        replyText = language === 'en'
          ? "Sakniya operates on clear, fair rates: 5% platform commission on semester and annual leases, and 15% on short stays (2–3 days). You also see the exact deposit and utility breakdown before booking."
          : "عمولة سكنية واضحة ومحددة: ٥٪ فقط على عقود الفصول الدراسية والإيجار السنوي، و١٥٪ للإقامات القصيرة (يومين إلى ٣ أيام). وكل التفاصيل بتظهرلك بشفافية قبل الدفع!";
      } else if (lower.includes('roommate') || lower.includes('زميل') || lower.includes('روميت') || lower.includes('رفيق') || lower.includes('match')) {
        replyText = language === 'en'
          ? "Our Roommate Match system evaluates 8 essential lifestyle dimensions: Routine & Sleep (20%), Cleanliness (20%), Noise & Study (15%), Smoking (15%), Guests (10%), Pets (10%), Kitchen (5%), and Communication (5%). Try filling out our questionnaire!"
          : "نظام مطابقة رفقاء السكن في سكنية بيفحص ٨ محاور أساسية: مواعيد النوم والاستيقاظ (٢٠٪)، النظافة (٢٠٪)، الهدوء والمذاكرة (١٥٪)، التدخين (١٥٪)، والضيوف والحيوانات الأليفة. جرب تملأ الاستبيان وهنطلعلك أفضل توافق!";
      } else if (lower.includes('commute') || lower.includes('جامعة') || lower.includes('university') || lower.includes('مواصلات') || lower.includes('alex') || lower.includes('pua')) {
        replyText = language === 'en'
          ? "We calculate real walking, driving, and transit minutes directly to campuses like Pharos University (PUA), Alexandria University Shatby & Medical campus, Cairo University, AUC, and Tanta. Use the commute slider in search to find places within 15 or 30 minutes!"
          : "بنحسب وقت المواصلات الفعلي مش خط مستقيم! سواء سيراً أو بالمواصلات لكليات فاروس، ومجمع الشاطبي والطبي بإسكندرية، وجامعة القاهرة وطنطا. تقدر تحدد أقصى وقت للمشوار في الفلاتر.";
      } else {
        replyText = language === 'en'
          ? "Hello there! I'm Misbah, your cozy housing guide. I can help you discover verified rooms across Egypt, explain rental fees, or find your perfect roommate match. What would you like to explore?"
          : "أهلاً وسهلاً! أنا مصباح، مرشدك ورفيقك في سكنية. أقدر أساعدك تلاقي سكن معتمد في مصر، أو أشرحلك الرسوم، أو أساعدك تلاقي الروميت الأنسب لأسلوب حياتك. حابب تبدأ بإيه؟";
      }
    }

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error handling Misbah request:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev, use Vite's connect instance as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In prod, serve static dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sakniya server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
