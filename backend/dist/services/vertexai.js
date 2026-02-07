"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImageWithGemini = analyzeImageWithGemini;
exports.synthesizeEvidenceWithGemini = synthesizeEvidenceWithGemini;
exports.generateEcoScoreExplanation = generateEcoScoreExplanation;
exports.generateGemmaTips = generateGemmaTips;
exports.generateChatResponse = generateChatResponse;
const vertexai_1 = require("@google-cloud/vertexai");
const PROJECT_ID = process.env.GCP_PROJECT_ID || '';
const LOCATION = process.env.GCP_REGION || 'us-central1';
let vertexAI = null;
function getVertexAI() {
    if (!vertexAI) {
        vertexAI = new vertexai_1.VertexAI({ project: PROJECT_ID, location: LOCATION });
    }
    return vertexAI;
}
async function analyzeImageWithGemini(imageBase64) {
    const vertex = getVertexAI();
    const model = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `You are an expert at identifying electronic products from images.
  
Analyze this image and identify the electronic device. Return a JSON object with:
{
  "category": one of ["smartphone", "laptop", "smartwatch", "headphones", "tablet", "camera", "console", "generic_electronics"],
  "brand": the brand name (e.g., "Apple", "Samsung", "Sony"),
  "model": the specific model name/number if visible,
  "confidence": your confidence level 0.0-1.0,
  "identifiers": any visible identifiers like model numbers, UPC codes,
  "components": array of {name, materials[]} for major components you can identify or reasonably infer,
  "materialsUsed": array of materials likely used in this device
}

Be thorough about materials - consider:
- Battery (lithium, cobalt)
- Display (glass, OLED materials, rare earth elements)
- Casing (aluminum, plastic, steel)
- Circuit boards (copper, gold, tin, tantalum)
- Magnets (rare earth elements)

Return ONLY the JSON, no markdown formatting.`;
    const response = await model.generateContent({
        contents: [{
                role: 'user',
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: imageBase64,
                        },
                    },
                ],
            }],
    });
    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    // Clean up the response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
        const parsed = JSON.parse(cleanedText);
        return {
            category: parsed.category || 'generic_electronics',
            brand: parsed.brand || 'Unknown',
            model: parsed.model || 'Unknown Model',
            confidence: parsed.confidence || 0.5,
            identifiers: parsed.identifiers || [],
            components: parsed.components || [],
            materialsUsed: parsed.materialsUsed || [],
        };
    }
    catch (error) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Failed to parse product analysis response');
    }
}
async function synthesizeEvidenceWithGemini(product, scrapedContent) {
    const vertex = getVertexAI();
    const model = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const contentSummary = scrapedContent
        .slice(0, 5)
        .map((s, i) => `[Source ${i + 1}] ${s.title}\nURL: ${s.url}\nContent: ${s.content.slice(0, 2000)}`)
        .join('\n\n---\n\n');
    const prompt = `You are an expert analyst extracting sustainability and sourcing information about electronics.

Product being analyzed:
- Brand: ${product.brand}
- Model: ${product.model}
- Category: ${product.category}
- Known materials: ${product.materialsUsed.join(', ')}

Source content to analyze:
${contentSummary}

Extract claims about:
1. Material sourcing (where materials come from)
2. Company policies (sustainability commitments, audits)
3. Controversies (labor issues, environmental violations)
4. Recycling programs (take-back, recycled materials)

Return a JSON object:
{
  "claims": [
    {
      "type": "sourcing" | "policy" | "controversy" | "recycling",
      "text": "concise paraphrase of the claim",
      "materials": ["materials mentioned"],
      "places": ["geographic locations mentioned"],
      "citationUrl": "source URL",
      "confidence": 0.0-1.0
    }
  ],
  "overallConfidence": 0.0-1.0 (how confident are you in the overall evidence quality)
}

Focus on factual claims with specific details. Avoid vague statements.
Return ONLY the JSON, no markdown formatting.`;
    const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
        const parsed = JSON.parse(cleanedText);
        return {
            claims: parsed.claims || [],
            overallConfidence: parsed.overallConfidence || 0.5,
        };
    }
    catch (error) {
        console.error('Failed to parse evidence synthesis:', text);
        return { claims: [], overallConfidence: 0.3 };
    }
}
async function generateEcoScoreExplanation(product, ecoScore, claims) {
    const vertex = getVertexAI();
    const model = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const prompt = `You are explaining an eco-score for an electronic product.

Product: ${product.brand} ${product.model} (${product.category})

Score breakdown:
- Total: ${ecoScore.total}/100
- Sourcing: ${ecoScore.sourcing}/40
- Transparency: ${ecoScore.transparency}/30
- Repairability: ${ecoScore.repairability}/30

Evidence claims found:
${claims.slice(0, 10).map(c => `- [${c.type}] ${c.text}`).join('\n')}

Generate:
1. A brief 2-3 sentence summary explaining the overall score
2. 3-5 bullet points explaining specific factors that influenced the score

Return JSON:
{
  "summary": "...",
  "rationaleBullets": ["...", "...", "..."]
}

Return ONLY the JSON, no markdown formatting.`;
    const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
        const parsed = JSON.parse(cleanedText);
        return {
            summary: parsed.summary || 'Unable to generate summary.',
            rationaleBullets: parsed.rationaleBullets || [],
        };
    }
    catch (error) {
        return {
            summary: 'Score calculated based on available evidence.',
            rationaleBullets: ['Evidence analysis complete'],
        };
    }
}
async function generateGemmaTips(product, materials) {
    const vertex = getVertexAI();
    // Use Gemma model for this specific feature as required
    const model = vertex.getGenerativeModel({ model: 'gemma-2-9b-it' });
    const prompt = `You are a helpful sustainability advisor.

Product: ${product.brand} ${product.model} (${product.category})
Materials: ${materials.join(', ')}

Generate exactly 3 personalized, actionable tips for the user:
1. One tip about extending the device's lifespan
2. One tip about responsible usage to minimize environmental impact
3. One tip about proper end-of-life disposal/recycling

Be specific and practical. Each tip should be 1-2 sentences.

Return JSON array of strings:
["tip 1", "tip 2", "tip 3"]

Return ONLY the JSON array, no markdown formatting.`;
    try {
        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (error) {
        console.error('Gemma tips generation failed:', error);
        // Provide fallback tips based on category
        return [
            `Keep your ${product.category} for at least 3-4 years to maximize its environmental value.`,
            `Enable power-saving features and avoid frequent full charges to extend battery life.`,
            `When disposing, use manufacturer take-back programs or certified e-waste recyclers.`,
        ];
    }
}
async function generateChatResponse(context, message, history) {
    const vertex = getVertexAI();
    const model = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const contextSummary = `
Product: ${context.product.brand} ${context.product.model} (${context.product.category})
Materials: ${context.product.materialsUsed.join(', ')}
Eco Score: ${context.ecoScore.total}/100

Evidence summary:
${context.claims.slice(0, 10).map(c => `- [${c.type}] ${c.text} (Source: ${c.citationUrl})`).join('\n')}
`;
    const chatHistory = history
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
    const prompt = `You are a helpful sustainability advisor answering questions about an electronic product.

Context about this product:
${contextSummary}

${chatHistory ? `Previous conversation:\n${chatHistory}\n` : ''}

User question: ${message}

Provide a helpful, accurate answer grounded in the evidence provided. When making factual claims about sourcing, materials, or company practices, cite the relevant source URLs.

Return JSON:
{
  "answer": "your response with inline citations like [1], [2]",
  "citations": ["url1", "url2"],
  "followups": ["suggested follow-up question 1", "suggested follow-up question 2"]
}

Return ONLY the JSON, no markdown formatting.`;
    const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    try {
        const parsed = JSON.parse(cleanedText);
        return {
            answer: parsed.answer || 'I could not generate a response.',
            citations: parsed.citations || [],
            followups: parsed.followups || [],
        };
    }
    catch (error) {
        return {
            answer: 'I apologize, but I encountered an error processing your question.',
            citations: [],
            followups: ['What materials are in this device?', 'How can I recycle this responsibly?'],
        };
    }
}
//# sourceMappingURL=vertexai.js.map