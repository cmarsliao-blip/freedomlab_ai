import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 設定 CORS 允許跨網域 (重要！讓網頁能呼叫 API)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 處理預檢請求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_KEY = "AIzaSyCVcCRcpsvIJzquv5GixKgAiH0pBflMLhA";
  if (!API_KEY) {
    return res.status(500).json({ error: "API Key 未設定" });
  }

  const { job } = req.body;
  if (!job) {
    return res.status(400).json({ error: '請提供職業名稱' });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      你是一位精通「知識變現」與「被動收入」的商業顧問。
      使用者的職業是：「${job}」。
      請根據這個職業的特性，提供 3 個具體且可執行的數位產品建議（入門級、主力級、旗艦級）。
      請使用 Markdown 格式輸出，語氣專業且激勵人心。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("API Error Details:", error);
    return res.status(500).json({ error: 'AI 生成失敗: ' + error.message });
  }
}
