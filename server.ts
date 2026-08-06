import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "placeholder",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API route to generate dynamic quiz questions using Gemini
app.post("/api/questions/generate", async (req, res) => {
  const { category, difficulty, count = 4, customTopic } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({
      error: "GEMINI_API_KEY environment variable is not configured.",
      fallback: true,
    });
  }

  try {
    const topicPrompt = customTopic
      ? `CRITICAL REQUIREMENT: The user requested a trivia quiz specifically about topic: "${customTopic}". Every single question MUST be strictly and directly about "${customTopic}".`
      : `Category: ${category}`;

    const isFlagCat = category === 'flags';

    const hardPromptInstruction = difficulty === 'hard'
      ? 'Difficulty level: HARD. Make questions EXTREMELY challenging, testing deep lore, obscure history, complex trivia, and advanced expert knowledge.'
      : `Difficulty level: ${difficulty}.`;

    const prompt = `Generate ${count} multiple choice trivia questions.
${topicPrompt}
${hardPromptInstruction}
${isFlagCat ? 'For flag questions, ask "Guess the country based on this flag:" and include a 2-letter ISO country code in flagCode (e.g. "np", "bt", "ki", "sz", "sc", "lc", "tm", "nr", "dm", "mz", "ca", "de", "ng", "jp", "br", "fr", "es", "it", "us", "gb", "ar", "za", "kr", "mx", "in", "eg").' : ''}

Requirements:
- Each question MUST have exactly 3 distinct answer options.
- Only 1 option MUST be the correct answer. The other 2 options MUST be plausible but incorrect answers.
- Provide a brief 1-sentence explanation for why the answer is correct.`;

    const generateWithModel = async (modelName: string) => {
      return await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            "You are Quiztopia AI, an energetic, fun quiz master creating engaging trivia questions tailored specifically to the user's requested topic.",
          temperature: 0.7,
          maxOutputTokens: 900,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Array of exactly 3 answer options",
                },
                correctAnswer: {
                  type: Type.STRING,
                  description: "The exact string of the correct option from options",
                },
                explanation: {
                  type: Type.STRING,
                  description: "Fun 1 sentence explanation of the answer",
                },
                flagCode: {
                  type: Type.STRING,
                  description: "Optional 2-letter ISO country code for flags",
                },
              },
              required: ["question", "options", "correctAnswer"],
            },
          },
        },
      });
    };

    let response;
    try {
      response = await generateWithModel("gemini-2.5-flash");
    } catch (err: any) {
      console.warn("Primary model gemini-2.5-flash failed, trying gemini-3.6-flash fallback...", err?.message || err);
      response = await generateWithModel("gemini-3.6-flash");
    }

    const jsonText = response.text?.trim() || "[]";
    const questions = JSON.parse(jsonText);

    if (Array.isArray(questions) && questions.length > 0) {
      return res.json({ success: true, questions });
    }

    return res.json({ success: false, fallback: true, questions: [] });
  } catch (error: any) {
    console.warn("Gemini Question Generation Notice (falling back to client topic generator):", error?.message || error);
    return res.json({
      success: false,
      fallback: true,
      error: "AI generation quota limit reached or unavailable.",
      questions: [],
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Quiztopia server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
