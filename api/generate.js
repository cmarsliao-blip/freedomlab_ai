const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_KEY = process.env.GOOGLE_API_KEY; // 這裡會自動去讀取 Vercel 的設定
  if (!API_KEY) {
    return res.status(500).json({ error: "伺服器端 API Key 未設定" });
  }

  const { job } = req.body;
  if (!job) {
    return res.status(400).json({ error: '請提供職業名稱' });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      你是一位精通「知識變現」與「被動收入」的商業顧問。
      使用者的職業是：「${job}」。
      請根據這個職業的特性，提供 3 個具體且可執行的數位產品建議（入門級、主力級、旗艦級）。
      請使用 Markdown 格式輸出，語氣專業且激勵人心。
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ result: responseText });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: 'AI 生成失敗' });
  }
}
