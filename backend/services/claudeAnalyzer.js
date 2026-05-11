const Groq = require('groq-sdk');

let groqClient = null;

function initializeClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not found in environment variables');
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqClient;
}

// Function to extract JSON from text
function extractJSON(text) {
  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to find JSON object in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // If still fails, try to clean and parse
        let cleaned = jsonMatch[0]
          .replace(/[\n\r]/g, ' ')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        return JSON.parse(cleaned);
      }
    }
    return null;
  }
}

// Function to create structured response from text
function createStructuredResponse(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    summary: lines.slice(0, 2).join(' ').substring(0, 200),
    threat_assessment: lines.slice(2, 4).join(' ') || 'Threat detected',
    mitigation_steps: [
      'Block source IP at firewall',
      'Review authentication logs',
      'Enable additional monitoring',
      'Check for unauthorized access'
    ],
    explanation: text.substring(0, 300),
    recommended_severity: text.toLowerCase().includes('critical') ? 'CRITICAL' : 
                         text.toLowerCase().includes('high') ? 'HIGH' :
                         text.toLowerCase().includes('medium') ? 'MEDIUM' : 'LOW'
  };
}

async function analyzeWithClaude(correlationData, relevantThreats) {
  try {
    const groq = initializeClient();

    const threatContext = relevantThreats
      .slice(0, 3)
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n');

    // Simplified prompt for better JSON responses
    const prompt = `Analyze this security incident. Return ONLY valid JSON, nothing else.

Incident Data:
${JSON.stringify(correlationData, null, 2)}

Threat Types:
${threatContext}

Return this exact JSON format:
{
  "summary": "Brief 1-2 sentence summary of what happened",
  "threat_assessment": "What type of threat this is and why",
  "mitigation_steps": ["Step 1", "Step 2", "Step 3"],
  "explanation": "Clear explanation for non-technical people",
  "recommended_severity": "CRITICAL or HIGH or MEDIUM or LOW"
}`;

    console.log('Sending request to Groq...');

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      temperature: 0.2 // Lower temperature for more consistent JSON
    });

    const content = message.choices[0].message.content;
    console.log('Raw response:', content.substring(0, 100) + '...');

    // Try to extract and parse JSON
    const parsed = extractJSON(content);
    
    if (parsed && parsed.summary) {
      console.log('Successfully parsed JSON response');
      return parsed;
    }

    // If JSON extraction failed, create structured response
    console.log('Could not extract JSON, creating structured response');
    return createStructuredResponse(content);

  } catch (error) {
    console.error('Groq API error:', error.message);

    // Return a default response on error
    return {
      summary: 'Security incident detected',
      threat_assessment: 'Multiple threat indicators identified',
      mitigation_steps: [
        'Block suspicious IP addresses',
        'Review authentication logs',
        'Enable real-time monitoring',
        'Check for data exfiltration'
      ],
      explanation: `Incident analysis service error: ${error.message}. Please review logs manually.`,
      recommended_severity: 'MEDIUM'
    };
  }
}

module.exports = { analyzeWithClaude };