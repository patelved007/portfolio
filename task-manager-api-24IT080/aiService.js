let OpenAI;
try {
  OpenAI = require("openai");
} catch (e) {
  OpenAI = null;
}

function getFallbackDescription(title) {
  const cleanTitle = (title || "").trim();
  const lower = cleanTitle.toLowerCase();

  let action = "Complete the implementation and review criteria.";
  let suggestedPriority = "medium";

  if (
    lower.includes("bug") ||
    lower.includes("fix") ||
    lower.includes("error") ||
    lower.includes("fail")
  ) {
    action =
      "Investigate the root cause, write a regression test, and apply the patch.";
    suggestedPriority = "high";
  } else if (
    lower.includes("test") ||
    lower.includes("ci") ||
    lower.includes("pipeline")
  ) {
    action =
      "Verify automated test coverage, check edge cases, and ensure clean CI pass status.";
    suggestedPriority = "medium";
  } else if (
    lower.includes("doc") ||
    lower.includes("readme") ||
    lower.includes("journal")
  ) {
    action =
      "Draft detailed technical documentation, record test evidence, and summarize results.";
    suggestedPriority = "low";
  } else if (
    lower.includes("auth") ||
    lower.includes("security") ||
    lower.includes("token")
  ) {
    action =
      "Enforce secure authorization checks, validate tokens, and prevent unauthorized data exposure.";
    suggestedPriority = "high";
  } else if (
    lower.includes("docker") ||
    lower.includes("deploy") ||
    lower.includes("compose")
  ) {
    action =
      "Build container images, verify port bindings, and validate multi-service orchestration.";
    suggestedPriority = "medium";
  }

  return {
    description: `Task: ${cleanTitle}\nObjective: ${action}\nChecklist:\n- [ ] Initial scoping and requirements review\n- [ ] Implementation / verification\n- [ ] Validation and testing`,
    suggestedPriority,
    fallback: true,
    disclaimer:
      "AI service offline or API key not set — generated via graceful degradation fallback.",
  };
}

async function generateTaskDescription(title) {
  if (!title || !title.trim()) {
    return {
      description: "Please provide a task title to generate a description.",
      suggestedPriority: "medium",
      fallback: true,
      disclaimer: "No task title provided.",
    };
  }

  // 1. Try OpenAI if key is present
  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are an AI assistant in a task management app. Given the task title "${title.trim()}", write a concise, actionable task description (2-3 sentences) and list 2-3 checklist bullet points. Output only the description.`;

      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });

      const generated = completion.choices[0]?.message?.content?.trim();
      if (generated) {
        return {
          description: generated,
          suggestedPriority:
            title.toLowerCase().includes("bug") ||
            title.toLowerCase().includes("urgent")
              ? "high"
              : "medium",
          fallback: false,
          disclaimer:
            "AI-generated suggestion using OpenAI — please review before saving.",
        };
      }
    } catch (err) {
      console.warn(
        "OpenAI API call failed, falling back to graceful degradation:",
        err.message
      );
    }
  }

  // 2. Try Gemini if key is present
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant in a task management app. Given the task title "${title.trim()}", write a concise, actionable task description (2-3 sentences) and list 2-3 checklist bullet points. Output only the description.`,
                },
              ],
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const generated =
          data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (generated) {
          return {
            description: generated,
            suggestedPriority:
              title.toLowerCase().includes("bug") ||
              title.toLowerCase().includes("urgent")
                ? "high"
                : "medium",
            fallback: false,
            disclaimer:
              "AI-generated suggestion using Gemini — please review before saving.",
          };
        }
      }
    } catch (err) {
      console.warn(
        "Gemini API call failed, falling back to graceful degradation:",
        err.message
      );
    }
  }

  // 3. Graceful degradation fallback
  return getFallbackDescription(title);
}

module.exports = { generateTaskDescription, getFallbackDescription };
