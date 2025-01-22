// const axios = require("axios");

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const getSkinType = async (req, res) => {
//   try {
//     const { answers } = req.body;

//     const prompt = `Based on the following answers, provide the skin type and description:\n` +
//       answers.map((ans, index) => `Q${index + 1}: ${ans}`).join("\n");

//     const retryRequest = async (retries) => {
//       try {
//         const response = await axios.post(
//           "https://api.openai.com/v1/chat/completions",
//           {
//             model: "gpt-3.5-turbo",
//             messages: [
//               { role: "system", content: "You are a dermatologist assistant AI." },
//               { role: "user", content: prompt },
//             ],
//             max_tokens: 50,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         return response;
//       } catch (error) {
//         if (error.response && error.response.status === 429 && retries > 0) {
//           console.log(`Rate limit hit. Retrying in ${Math.pow(2, 5 - retries)}ms...`);
//           await sleep(Math.pow(2, 5 - retries)); // Exponential backoff
//           return retryRequest(retries - 1); // Retry the request
//         }
//         throw error;
//       }
//     };

//     const response = await retryRequest(5); // Max 5 retries
//     const result = response.data.choices[0].message.content.trim();
//     res.status(200).json({ result });
//   } catch (error) {
//     console.error("Error getting skin type:", error.message);
//     res.status(500).json({ error: "Failed to get skin type prediction" });
//   }
// };

// module.exports = { getSkinType };



const OpenAI = require("openai");

// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is set in your environment variables
});

// Sleep function for rate limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Store the last request time to manage rate limiting
let lastRequestTime = 0;
const MIN_TIME_BETWEEN_REQUESTS = 1000; // Minimum 1 second between requests

const getSkinType = async (req, res) => {
  try {
    const { answers } = req.body;

    // Create the prompt based on user answers
    const prompt = `Based on the following answers, provide the skin type in a single word (e.g., "Oily", "Dry", "Combination", "Normal", "Sensitive"):\n` +
      answers.map((ans, index) => `Q${index + 1}: ${ans}`).join("\n");

    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;

    // Handle rate limiting
    if (timeSinceLastRequest < MIN_TIME_BETWEEN_REQUESTS) {
      const waitTime = MIN_TIME_BETWEEN_REQUESTS - timeSinceLastRequest;
      console.log(`Throttling request. Waiting ${waitTime / 1000} seconds.`);
      await sleep(waitTime);
    }

    // Retry logic
    const retryRequest = async (retries) => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          messages: [
            { role: "system", content: "You are a dermatologist assistant AI." },
            { role: "user", content: prompt },
          ],
        });
        return response;
      } catch (error) {
        if (error.statusCode  === 429) {
          if (error.message.includes("Rate limit reached")) {
            const waitTime = Math.pow(2, 5 - retries) * 1000;
            console.log(`Rate limit hit. Retrying in ${waitTime / 1000} seconds...`);
            await sleep(waitTime);
            return retryRequest(retries - 1);
          } else if (error.message.includes("You exceeded your current quota")) {
            console.error("Quota exceeded. No retries will be attempted.");
            throw error;
          }
        }
        throw error; // Throw other errors
      }
    };
    
    // Call the retry function with a max of 5 retries
    const response = await retryRequest(5);

    // Extract and clean up the result
    let result = response.choices[0].message.content.trim();
    result = result.split(/\s+/)[0]; // Ensure single-word output

    lastRequestTime = Date.now(); // Update the last request time
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error in getSkinType:", error.message);
    res.status(500).json({ error: "Failed to get skin type prediction" });
  }
};

module.exports = { getSkinType };
