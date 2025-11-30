import { describe, it, expect } from 'vitest';
import { invokeLLM } from '../_core/llm';

describe('LLM API Tests', () => {
  it('should successfully call LLM with simple prompt', async () => {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'Tu es un assistant utile.' },
        { role: 'user', content: 'Dis bonjour en une phrase.' }
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0].message.content).toBeDefined();
    
    console.log('LLM Response:', response.choices[0].message.content);
  }, 30000); // 30 seconds timeout

  it('should successfully call LLM with JSON response format', async () => {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'Tu réponds UNIQUEMENT en JSON valide.' },
        { role: 'user', content: 'Donne-moi un objet JSON avec une clé "message" contenant "bonjour".' }
      ],
      responseFormat: { type: 'json_object' },
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    
    const content = typeof response.choices[0].message.content === 'string' 
      ? response.choices[0].message.content 
      : JSON.stringify(response.choices[0].message.content);
    
    const parsed = JSON.parse(content);
    expect(parsed).toBeDefined();
    expect(parsed.message).toBeDefined();
    
    console.log('LLM JSON Response:', parsed);
  }, 30000); // 30 seconds timeout

  it('should handle content analysis prompt', async () => {
    const testContent = "Découvrez notre nouveau logiciel de gestion qui va révolutionner votre entreprise.";
    
    const analysisPrompt = `Tu es un expert en Content Marketing. Analyse ce contenu et réponds en JSON:

**Contenu** : ${testContent}

Fournis un objet JSON avec:
- seoScore: nombre entre 0 et 100
- conversionScore: nombre entre 0 et 100
- recommendations: tableau de 2 suggestions

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown.`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'Tu es un expert en Content Marketing. Tu réponds UNIQUEMENT en JSON valide.' },
        { role: 'user', content: analysisPrompt }
      ],
      responseFormat: { type: 'json_object' },
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    
    const content = typeof response.choices[0].message.content === 'string' 
      ? response.choices[0].message.content 
      : JSON.stringify(response.choices[0].message.content);
    
    const parsed = JSON.parse(content);
    expect(parsed.seoScore).toBeDefined();
    expect(parsed.conversionScore).toBeDefined();
    expect(parsed.recommendations).toBeDefined();
    expect(Array.isArray(parsed.recommendations)).toBe(true);
    
    console.log('Content Analysis Response:', parsed);
  }, 60000); // 60 seconds timeout for complex analysis
});
