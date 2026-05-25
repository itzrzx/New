import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up larger limit for base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Helper to check for API key
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System Status Endpoint
app.get("/api/status", (req, res) => {
  res.json({
    apiKeyAvailable: !!process.env.GEMINI_API_KEY,
    environment: process.env.NODE_ENV || "development"
  });
});

// -------------------------------------------------------------
// 1. Visual Authenticity Endpoint ("Why does my image look AI-generated?")
// -------------------------------------------------------------
app.post("/api/analyze/image", async (req, res): Promise<any> => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(401).json({
        error: "Missing API Key",
        suggestion: "Please set the GEMINI_API_KEY in the Secrets panel in Google AI Studio to enable live psychological feedback."
      });
    }

    const { imageBase64, mimeType } = req.body;
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Missing imageBase64 or mimeType in request body." });
    }

    // Prepare image for Gemini part
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: "Analyze this image/visual. Your feedback must focus on 'psychological perception' and authenticity rather than technical metadata. Answer strictly matching the response schema: analyze if the image feels synthetic or overpolished, identify specific visual characteristics that look fake (e.g., lighting too uniform, skin textures too smooth, extreme clean edges, repeating noise pattern, lacking micro-imperfections), and deliver cinematic fixes to make the image feel high-end, real, and authentic.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiScore: { 
              type: Type.INTEGER, 
              description: "AI-ish score from 0 (perfectly photorealistic or authentic artwork) to 100 (blatantly synthetic/fake/AI-slop)" 
            },
            verdict: { 
              type: Type.STRING, 
              description: "A summary explaining why this visual triggers 'AI premonitions' or feels generic to human perception." 
            },
            problems: {
              type: Type.ARRAY,
              description: "Specific things that ruin authenticity, graded on intensity.",
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Category of the authentic break, e.g. 'Lighting Uniformity', 'Repetitive Textures', 'Hyper-Clean Edges', 'Atmospheric Depth'" },
                  detail: { type: Type.STRING, description: "Detailed psychological explanation of what gives it away." },
                  intensity: { type: Type.INTEGER, description: "How severe this issue is from 1 (minor) to 5 (critical flaw)" }
                },
                required: ["category", "detail", "intensity"]
              }
            },
            fixes: {
              type: Type.ARRAY,
              description: "Cinema-grade, practical adjustments to restore analog warmth and trust.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Short actionable name of fix, e.g. 'Soft Focus Blending', 'Selective Grain Inject', 'Asymmetric Contrast'" },
                  action: { type: Type.STRING, description: "How exactly the creator should implement this fix in standard tools." },
                  impact: { type: Type.STRING, description: "Why this works to trick the viewer's subconscious into thinking it is real." }
                },
                required: ["title", "action", "impact"]
              }
            },
            retentionPotential: { 
              type: Type.INTEGER, 
              description: "Subconscious user attention score from 0 to 100 representing if they will pause or scroll past this image immediately." 
            }
          },
          required: ["aiScore", "verdict", "problems", "fixes", "retentionPotential"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Image Analysis Error:", error);
    return res.status(500).json({ error: error.message || "Internal Analysis Error" });
  }
});


// -------------------------------------------------------------
// 2. Narrative Pacing Endpoint ("Why are viewers leaving?")
// -------------------------------------------------------------
app.post("/api/analyze/narrative", async (req, res): Promise<any> => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(401).json({
        error: "Missing API Key",
        suggestion: "Please set the GEMINI_API_KEY in the Secrets panel in Google AI Studio to enable live psychological feedback."
      });
    }

    const { scriptText, title, targetFormat } = req.body;
    if (!scriptText) {
      return res.status(400).json({ error: "Missing script or hook content." });
    }

    const promptText = `
      You are an attention engineer specializing in video hooks, story-arcs, and viewer retention psychology.
      Analyze the following creative concepts for a ${targetFormat || "online video content"}:
      
      Title: "${title || "Untitled"}"
      Content/Script:
      "${scriptText}"

      Evaluate:
      1. Curiosity Gap: Has the content successfully locked in attention or is the hook flat, too predictable, or information-bloated without visual/emotional reward?
      2. Attention & Tension Flow: Provide 5 timestamp check-points representing sequence progression (0% to 100%) showing the tension curve and energy level.
      3. Danger Zones: Identify specific lines or parts where retention crashes. Provide solutions to fix them.
      4. Structured psychological analysis.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            curiosityScore: { 
              type: Type.INTEGER, 
              description: "Direct tension & curiosity appeal score from 0 to 100" 
            },
            retentionGraph: {
              type: Type.ARRAY,
              description: "5 timeline check-points mapping narrative energy & tension",
              items: {
                type: Type.OBJECT,
                properties: {
                  timestampPercent: { type: Type.INTEGER, description: "Location in narrative from 0 to 100" },
                  tension: { type: Type.INTEGER, description: "Tension/Mystery level from 0 (flat) to 100 (peak curiosity)" },
                  energy: { type: Type.INTEGER, description: "Pacing/Information rate from 0 (extremely slow) to 100 (hyper-kinetic)" },
                  label: { type: Type.STRING, description: "Segment label, e.g. 'Hook setup', 'The Reveal', 'Detail Expansion'" }
                },
                required: ["timestampPercent", "tension", "energy", "label"]
              }
            },
            dangerZones: {
              type: Type.ARRAY,
              description: "Specific parts of the text where the viewer is highly likely to click away.",
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING, description: "The flawed sentence or segment of text." },
                  issue: { type: Type.STRING, description: "Why it triggers friction, information boredom, or breaks the curiosity loop." },
                  solution: { type: Type.STRING, description: "Actionable rewrite of this exact part to save retention." }
                },
                required: ["section", "issue", "solution"]
              }
            },
            psychologyBreakdown: {
              type: Type.OBJECT,
              properties: {
                curiosityGap: { type: Type.STRING, description: "Analysis of the curiosity trap. Is the question interesting enough? How to widen it." },
                emotionalResonance: { type: Type.STRING, description: "Analysis of emotional investment. Does the reader care?" }
              },
              required: ["curiosityGap", "emotionalResonance"]
            }
          },
          required: ["curiosityScore", "retentionGraph", "dangerZones", "psychologyBreakdown"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Narrative Analysis Error:", error);
    return res.status(500).json({ error: error.message || "Internal Analysis Error" });
  }
});


// -------------------------------------------------------------
// 3. Cognitive Conversion Endpoint ("Why isn't this converting?")
// -------------------------------------------------------------
app.post("/api/analyze/landing", async (req, res): Promise<any> => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(401).json({
        error: "Missing API Key",
        suggestion: "Please set the GEMINI_API_KEY in the Secrets panel in Google AI Studio to enable live psychological feedback."
      });
    }

    const { copyText, targetAudience } = req.body;
    if (!copyText) {
      return res.status(400).json({ error: "Missing landing page copy or layout outline." });
    }

    const promptText = `
      Evaluate the provided landing page headline, messaging structure, and hierarchy outline under cognitive psychology and premium value perception guidelines.
      
      Target Audience: "${targetAudience || "General tech-forward users"}"
      Landing Page Copy:
      "${copyText}"

      Your goal is to explain WHY this text fails to convince people of premium quality, identify trust gaps, weak emotional contrast, and cognitive overload. Fill out the response schema in detail.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contrastScore: { 
              type: Type.INTEGER, 
              description: "Trust vs Friction contrast ratio from 0 to 100 representing persuasive power" 
            },
            premiumPerception: { 
              type: Type.STRING, 
              description: "Does this feel like cheap, generic marketing slop or a high-integrity, bespoke proposition? Explain why." 
            },
            frictionPoints: {
              type: Type.ARRAY,
              description: "Friction, information overload, or weak trust cues.",
              items: {
                type: Type.OBJECT,
                properties: {
                  element: { type: Type.STRING, description: "The section or line of copy evaluated." },
                  frictionType: { type: Type.STRING, description: "e.g., 'Generic Buzzword', 'Unsubstantiated Claim', 'Cognitive Overload'" },
                  whyItFails: { type: Type.STRING, description: "Psychological reason why the user closes the page." },
                  improvement: { type: Type.STRING, description: "Actionable rewording or architectural structure suggestion." }
                },
                required: ["element", "frictionType", "whyItFails", "improvement"]
              }
            },
            valuePropEvaluation: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.STRING, description: "Does the user understand within 3 seconds of load what they get?" },
                psychologicalAngle: { type: Type.STRING, description: "What core human desire is leveraged (status, pain avoidance, etc.)? Is it effective?" }
              },
              required: ["clarity", "psychologicalAngle"]
            }
          },
          required: ["contrastScore", "premiumPerception", "frictionPoints", "valuePropEvaluation"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);

  } catch (error: any) {
    console.error("Landing Analysis Error:", error);
    return res.status(500).json({ error: error.message || "Internal Analysis Error" });
  }
});


// -------------------------------------------------------------
// Vite Middleware / Static Server Integration
// -------------------------------------------------------------
async function startServer() {
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
    console.log(`[SYS] Server launched on http://0.0.0.0:${PORT}`);
  });
}

startServer();
