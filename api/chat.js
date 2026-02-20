export default async function handler(req, res) {
  const { message, type } = req.body;

  const API_TOKEN = "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";
  let model = "";
  let body = {};

  if (type === "text") {
    model = "mistralai/Mistral-7B-Instruct-v0.2";
    body = { inputs: message };
  }

  if (type === "image") {
    model = "stabilityai/stable-diffusion-2";
    body = { inputs: message };
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (type === "image") {
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(buffer));
    } else {
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro na IA" });
  }
}
