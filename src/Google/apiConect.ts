import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv();

const apiKey = process.env.API_KEY_GEMINY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is not set.");
}
const genAi = new GoogleGenAI({ apiKey });

export async function main(prompt: string) {
  const response = await genAi.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });
  console.log(response.text);
}
