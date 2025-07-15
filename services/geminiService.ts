import { GoogleGenerativeAI, Chat } from '@google/genai';
import { ProjectInput, AnalysisReport, GeminiService } from '../types';

export const initGeminiService = (apiKey: string): GeminiService => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const analyzeProject = async (projectInput: ProjectInput): Promise<AnalysisReport | null> => {
    try {
      const prompt = `
        You are CryptoGuard AI, an expert cryptocurrency project analyst. Analyze the following project and provide a comprehensive risk assessment.

        Project Details:
        - Name: ${projectInput.name}
        - Symbol: ${projectInput.symbol || 'Not provided'}
        - Website: ${projectInput.websiteUrl || 'Not provided'}
        - Whitepaper Content: ${projectInput.whitepaperContent || 'Not provided'}
        - Smart Contract Info: ${projectInput.smartContractInfo || 'Not provided'}
        - Additional Info: ${projectInput.otherInfo || 'Not provided'}

        Please provide your analysis in the following JSON format:
        {
          "overallRisk": "Low|Medium|High|Very High|Critical|Undetermined",
          "executiveSummary": "Brief 2-3 sentence summary of the project and key findings",
          "redFlags": [
            {"description": "Description of red flag", "severity": "Low|Medium|High|Critical"}
          ],
          "strengths": [
            {"description": "Description of strength", "area": "Team|Technology|Community|Tokenomics|Innovation|Other"}
          ],
          "teamAssessment": "Assessment of the team behind the project",
          "technologyReview": "Review of the technology and innovation",
          "tokenomicsInsight": "Analysis of the token economics",
          "communitySentiment": "Assessment of community engagement and sentiment",
          "smartContractSecuritySummary": {
            "summaryText": "Brief security assessment summary",
            "disclaimer": "Standard disclaimer about AI limitations in security analysis"
          }
        }

        Be thorough, objective, and highlight both risks and opportunities. Always include appropriate disclaimers.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      
      const report: AnalysisReport = {
        id: projectInput.name.toLowerCase().replace(/\s+/g, '-'),
        projectInput,
        overallRisk: analysisData.overallRisk,
        executiveSummary: analysisData.executiveSummary,
        redFlags: analysisData.redFlags || [],
        strengths: analysisData.strengths || [],
        teamAssessment: analysisData.teamAssessment,
        technologyReview: analysisData.technologyReview,
        tokenomicsInsight: analysisData.tokenomicsInsight,
        communitySentiment: analysisData.communitySentiment,
        smartContractSecuritySummary: analysisData.smartContractSecuritySummary,
        timestamp: new Date(),
      };

      return report;
    } catch (error) {
      console.error('Error analyzing project:', error);
      return null;
    }
  };

  const startChat = async (systemPrompt: string): Promise<Chat | null> => {
    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm ready to help answer questions about the analyzed project." }],
          },
        ],
      });
      return chat;
    } catch (error) {
      console.error('Error starting chat:', error);
      return null;
    }
  };

  const sendMessageToChat = async (chat: Chat, message: string): Promise<string | null> => {
    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to chat:', error);
      return null;
    }
  };

  const generateComparativeAnalysis = async (report1: AnalysisReport, report2: AnalysisReport): Promise<string | null> => {
    try {
      const prompt = `
        Compare these two cryptocurrency projects and provide a detailed comparative analysis:

        Project 1: ${report1.projectInput.name}
        - Overall Risk: ${report1.overallRisk}
        - Executive Summary: ${report1.executiveSummary}
        - Key Strengths: ${report1.strengths.map(s => s.description).join(', ')}
        - Key Red Flags: ${report1.redFlags.map(r => r.description).join(', ')}

        Project 2: ${report2.projectInput.name}
        - Overall Risk: ${report2.overallRisk}
        - Executive Summary: ${report2.executiveSummary}
        - Key Strengths: ${report2.strengths.map(s => s.description).join(', ')}
        - Key Red Flags: ${report2.redFlags.map(r => r.description).join(', ')}

        Provide a comprehensive comparison covering:
        1. Risk Assessment Comparison
        2. Technology and Innovation
        3. Team and Development
        4. Tokenomics and Economics
        5. Community and Adoption
        6. Investment Recommendation (if any)

        Be objective and highlight the key differences and similarities.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating comparative analysis:', error);
      return null;
    }
  };

  return {
    analyzeProject,
    startChat,
    sendMessageToChat,
    generateComparativeAnalysis,
  };
};