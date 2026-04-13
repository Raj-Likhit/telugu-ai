const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI("AIzaSyAXMS_p3Yg3z9XYlDDVnJMMHbyjXMqVvyw");
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.models.forEach(m => console.log(m.name));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
