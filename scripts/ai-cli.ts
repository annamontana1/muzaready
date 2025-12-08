#!/usr/bin/env tsx
/**
 * Claude.ai CLI Tool
 * 
 * Použití:
 *   npm run ai "tvůj dotaz"              # Claude (default)
 *   npm run ai:claude "tvůj dotaz"      # Explicitně Claude
 *   npm run ai:openai "tvůj dotaz"      # OpenAI
 * 
 * Nebo interaktivní chat režim:
 *   npm run ai:chat                     # Claude chat
 *   npm run ai:chat:openai              # OpenAI chat
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Načtení environment variables
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const env: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return env;
  } catch {
    return {};
  }
}

const env = { ...process.env, ...loadEnv() };

// OpenAI API
async function callOpenAI(prompt: string, model = 'gpt-4o-mini'): Promise<string> {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY není nastaveno v .env.local');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Žádná odpověď';
}

// Anthropic Claude API
async function callClaude(prompt: string, model = 'claude-3-5-sonnet-20241022'): Promise<string> {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY není nastaveno v .env.local');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'Žádná odpověď';
}

// Interaktivní chat režim
async function interactiveChat(provider: 'openai' | 'claude' = 'claude') {
  const { createInterface } = await import('readline');
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  console.log(`\n🤖 Cloud AI Chat (${provider.toUpperCase()})\n`);
  console.log('Napiš "exit" nebo "quit" pro ukončení\n');

  while (true) {
    const userInput = await question('Ty: ');
    
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      break;
    }

    if (!userInput.trim()) {
      continue;
    }

    try {
      process.stdout.write('AI: ');
      const response = provider === 'openai' 
        ? await callOpenAI(userInput)
        : await callClaude(userInput);
      console.log(response + '\n');
    } catch (error: any) {
      console.error(`\n❌ Chyba: ${error.message}\n`);
    }
  }

  rl.close();
  console.log('\n👋 Na shledanou!\n');
}

// Hlavní funkce
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Interaktivní režim
  if (command === 'chat' || command === '--chat') {
    const provider = args[1] === 'claude' ? 'claude' : 'openai';
    await interactiveChat(provider);
    return;
  }

  // Jednoduchý dotaz
  if (args.length === 0) {
    console.log(`
🤖 Cloud AI CLI Tool

Použití:
  npm run ai "tvůj dotaz"              # Použije Claude (default)
  npm run ai:claude "tvůj dotaz"      # Explicitně Claude
  npm run ai:openai "tvůj dotaz"      # Použije OpenAI
  npm run ai:chat                     # Interaktivní chat (Claude)
  npm run ai:chat openai              # Interaktivní chat (OpenAI)

Nastavení:
  1. Vytvoř soubor .env.local v root projektu
  2. Přidej API klíče:
     OPENAI_API_KEY=sk-...
     ANTHROPIC_API_KEY=sk-ant-...

Příklady:
  npm run ai "Jak vytvořit React komponentu?"
  npm run ai "Vysvětli TypeScript generics"
  npm run ai:openai "Rychlý dotaz s OpenAI"
    `);
    return;
  }

  const prompt = args.join(' ');
  const provider = process.env.AI_PROVIDER || 'claude';

  try {
    console.log(`\n🤖 Dotaz (${provider}): ${prompt}\n`);
    console.log('─'.repeat(60) + '\n');

    const startTime = Date.now();
    const response = provider === 'claude' 
      ? await callClaude(prompt)
      : await callOpenAI(prompt);
    const duration = Date.now() - startTime;

    console.log(response);
    console.log(`\n─`.repeat(60));
    console.log(`⏱️  Čas: ${duration}ms\n`);
  } catch (error: any) {
    console.error(`\n❌ Chyba: ${error.message}\n`);
    process.exit(1);
  }
}

main().catch(console.error);

