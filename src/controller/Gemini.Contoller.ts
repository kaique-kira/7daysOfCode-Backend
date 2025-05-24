import { main } from "../Google/apiConect";
import { writeJson } from "../utils/write";

export async function postGeminiController(req, res) {
  try {
    const prompt = req.body;
    console.log("Prompt received:", prompt);
    if (!prompt || Object.keys(prompt).length === 0) {
      return writeJson(
        res,
        { error: "Prompt is required in the request body." },
        400
      );
    }
    const newPrompt = await main(prompt.prompt);
    return writeJson(res, newPrompt, 200);
  } catch (error) {
    console.error("Error in postGeminiController:", error);
    return writeJson(res, null, 500);
  }
}
