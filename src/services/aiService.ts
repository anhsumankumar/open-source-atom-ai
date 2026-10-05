// Placeholder for future NVIDIA API integration
export const NVIDIA_API_KEY = "YOUR_API_KEY_HERE";

export const aiService = {
  sendMessage: async (message: string): Promise<string> => {
    // In the future, this will connect to the NVIDIA API or Supabase Edge Functions.
    // For now, we simulate a network delay and return a mock response.
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a mock response from ATOM. You asked: "${message}". In the future, this will be powered by a real AI model and formatted with Markdown, code blocks, and math formulas.`);
      }, 1000);
    });
  }
};
