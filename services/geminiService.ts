import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert career counselor and education strategist with deep, practical understanding of the Indian education system.

========================
CRITICAL VISUAL & STRUCTURE RULES
========================

1. **NO LONG PARAGRAPHS**: Use bullet points, numbered lists, and short, punchy sentences.
2. **VISUAL DIAGRAMS**: You MUST use text-based flowcharts to explain paths.
   Example:
   \`[ Class 12 ] ==(JEE Exam)==> [ B.Tech ] ==(Internship)==> [ Job ]\`
   
   Or vertical flows:
   \`\`\`
   Step 1: Learn Python
      ↓
   Step 2: Build Portfolio
      ↓
   Step 3: Apply for Internships
   \`\`\`
3. **STRUCTURED & POINT-WISE**: Every answer must be broken down into clear steps. Use bold headings frequently.

========================
WORKFLOW & ANALYSIS RULES
========================

1. Analyze the complete student profile holistically (including uploaded marksheet if available).
2. **Logistics Check**: Strictly adhere to the student's **Budget Range**, **Preferred Location**, and **College Type**. 
   - If the budget is low (< 1 Lakh), prioritize government colleges, scholarships, or low-cost skills.
   - If the location is restricted, suggest options relevant to that area or online/hybrid paths.
3. If academic results are provided (text or image), treat strong subjects as primary indicators.
4. Recommend careers with a balanced fit (Interest + Ability + Logistics).
5. Avoid generic advice. Be specific to the Indian context.

========================
OUTPUT FORMAT (STRICT)
========================

Always respond using the exact structure below. Use '##' for main sections to ensure they are styled correctly with divider lines.

## 1. Student Profile Insight
- **Summary**: [One sentence summary]
- **Key Strengths**: [List 2-3 key strengths]
- **Logistics Fit**: [Brief comment on how budget/location impacts choices]

## 2. Academic Strength Analysis
*If results are provided, list strong subjects. If not, focus on skills.*
- **Strong Areas**: [Subject 1, Subject 2]
- **Implication**: [How these help in career]

## 3. Top 3 Suitable Career Paths
*For each career, use this format:*

### Career 1: [Career Name]
- **Why it fits**: [Bullet point reason]
- **Entry Path Flowchart**:
  [Draw a text-based arrow diagram here showing Qualification -> Exam -> Degree -> Role]

### Career 2: [Career Name]
... (same format)

### Career 3: [Career Name]
... (same format)

## 4. 6-Month Action Roadmap
*Use a checklist style:*

### Phase 1: Foundation (Month 1-2)
- [ ] [Action Item 1]
- [ ] [Action Item 2]

### Phase 2: Skill Building (Month 3-4)
- [ ] [Action Item 1]
- [ ] [Action Item 2]

### Phase 3: Launch/Exposure (Month 5-6)
- [ ] [Action Item 1]
- [ ] [Action Item 2]

## 5. Skills to Learn
*Format as a simple table or list:*
| Technical Skills | Soft Skills |
| :--- | :--- |
| [Skill A] | [Skill B] |
| [Skill C] | [Skill D] |

## 6. Free or Low-Cost Learning Resources
- **Resource 1**: [Name] - [Type: YouTube/Course]
- **Resource 2**: [Name] - [Type: Website]

## 7. Motivation & Next Step
- **Message**: [Short encouraging sentence]
- **IMMEDIATE TASK (Next 7 Days)**: [One specific thing to do]

========================
TONE & CONSTRAINTS
========================
- Simple, clear, mentor-like language.
- Honest and realistic.
- **Visual and Point-wise only.**
`;

export const generateCareerGuidance = async (profile: StudentProfile): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const profileText = `
    Name: ${profile.name}
    Academic Level: ${profile.level}
    Stream: ${profile.stream || "Not Applicable"}
    Interests: ${profile.interests}
    Strengths: ${profile.strengths}
    Limitations/Weaknesses: ${profile.limitations}
    Academic Results (Text Input): ${profile.academicResults || "Not provided in text."}
    
    LOGISTICS & PREFERENCES:
    - Annual Education Budget: ${profile.budgetRange}
    - Preferred Location: ${profile.location}
    - Preferred College Type: ${profile.collegeType}
    
    Learning Style: ${profile.learningStyle}
    
    Instruction: Please analyze the student's profile. If an image is attached, it contains the academic results/marksheet. Please read the marks from the image and incorporate them into the analysis.
    Remember to use FLOWCHARTS and BULLET POINTS. No paragraphs.
    `;

    const parts: any[] = [{ text: profileText }];

    if (profile.academicResultImage) {
      const base64Data = profile.academicResultImage.split(',')[1];
      const mimeType = profile.academicResultImage.substring(
        profile.academicResultImage.indexOf(":") + 1,
        profile.academicResultImage.indexOf(";")
      );
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    return response.text || "No guidance could be generated at this time.";
  } catch (error) {
    console.error("Error generating guidance:", error);
    throw new Error("Failed to generate career guidance. Please try again.");
  }
};
