const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OpenAI API key not configured');
      return;
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  isConfigured() {
    return this.client !== null;
  }

  // Generate product description
  async generateDescription({ productName, category, attributes = {}, tone = 'professional' }) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured');
    }

    const toneInstructions = {
      professional: 'Write in a professional, informative tone suitable for business.',
      casual: 'Write in a friendly, conversational tone.',
      enthusiastic: 'Write in an exciting, energetic tone that creates desire.'
    };

    const attributesText = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join(', ');

    const prompt = `Generate a compelling product description for an e-commerce store.

Product: ${productName}
Category: ${category || 'General'}
${attributesText ? `Attributes: ${attributesText}` : ''}

Instructions:
- ${toneInstructions[tone] || toneInstructions.professional}
- Length: 2-3 paragraphs (100-150 words)
- Include key features and benefits
- SEO-friendly language
- No promotional language like "Buy now!" or "Limited time!"
- Focus on value proposition

Generate only the description, no additional text:`;

    try {
      const startTime = Date.now();
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      });

      const description = response.choices[0].message.content.trim();
      const duration = Date.now() - startTime;

      return {
        description,
        metadata: {
          tokens: response.usage.total_tokens,
          model: response.model,
          duration
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Extract attributes from product title
  async extractAttributes(productTitle) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured');
    }

    const prompt = `Extract product attributes from the following product title. Return ONLY a JSON object with the attributes, no additional text or explanation.

Product Title: "${productTitle}"

Extract these attributes if present:
- brand (manufacturer/company name)
- model (product model/series)
- color (color/shade)
- size (size information)
- material (what it's made of)
- storage (for electronics)
- capacity (for containers/batteries/etc)
- quantity (package quantity)
- any other relevant attributes

Return JSON format:
{
  "brand": "...",
  "model": "...",
  "color": "...",
  ...other attributes
}

Only include attributes that are clearly present in the title. If unsure, omit the attribute.`;

    try {
      const startTime = Date.now();
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      });

      const content = response.choices[0].message.content.trim();
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonString = content;
      if (content.includes('```json')) {
        jsonString = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonString = content.split('```')[1].split('```')[0].trim();
      }

      const attributes = JSON.parse(jsonString);
      const duration = Date.now() - startTime;

      return {
        attributes,
        confidence: 0.85, // Simplified confidence score
        metadata: {
          tokens: response.usage.total_tokens,
          model: response.model,
          duration
        }
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse AI response as JSON');
      }
      throw this.handleError(error);
    }
  }

  // Validate product data
  async validateProduct(product) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured');
    }

    const prompt = `Analyze this product data and provide validation feedback.

Product Data:
${JSON.stringify(product, null, 2)}

Evaluate:
1. Product name quality (is it descriptive enough?)
2. Description quality (length, clarity, SEO-friendliness)
3. Price reasonableness
4. Missing attributes that should be included
5. Any data quality issues

Return a JSON object with this structure:
{
  "isValid": true/false,
  "issues": [
    {
      "field": "name",
      "severity": "error" or "warning",
      "message": "Clear explanation of the issue"
    }
  ],
  "suggestions": {
    "name": "suggested improvement",
    "description": "suggested improvement",
    "missingAttributes": ["attribute1", "attribute2"]
  }
}

Be constructive and specific.`;

    try {
      const startTime = Date.now();
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 500
      });

      const content = response.choices[0].message.content.trim();
      
      // Extract JSON from response
      let jsonString = content;
      if (content.includes('```json')) {
        jsonString = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonString = content.split('```')[1].split('```')[0].trim();
      }

      const validation = JSON.parse(jsonString);
      const duration = Date.now() - startTime;

      return {
        ...validation,
        metadata: {
          tokens: response.usage.total_tokens,
          model: response.model,
          duration
        }
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse AI response as JSON');
      }
      throw this.handleError(error);
    }
  }

  // Bulk enhance products
  async bulkEnhance(products, enhancements = ['description', 'attributes']) {
    if (!this.isConfigured()) {
      throw new Error('AI service not configured');
    }

    const results = [];

    for (const product of products) {
      const result = {
        productId: product.id,
        enhancements: {}
      };

      try {
        if (enhancements.includes('description') && !product.description) {
          const descResult = await this.generateDescription({
            productName: product.name,
            category: product.category,
            attributes: product.attributes
          });
          result.enhancements.description = descResult.description;
        }

        if (enhancements.includes('attributes') && (!product.attributes || Object.keys(product.attributes).length === 0)) {
          const attrResult = await this.extractAttributes(product.name);
          result.enhancements.attributes = attrResult.attributes;
        }

        result.success = true;
      } catch (error) {
        result.success = false;
        result.error = error.message;
      }

      results.push(result);
    }

    return results;
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      const aiError = new Error(error.response.data?.error?.message || 'AI service error');
      aiError.code = 'AI_SERVICE_ERROR';
      aiError.statusCode = error.response.status;
      return aiError;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      const networkError = new Error('Unable to connect to AI service');
      networkError.code = 'AI_NETWORK_ERROR';
      return networkError;
    } else {
      return error;
    }
  }
}

module.exports = new AIService();
