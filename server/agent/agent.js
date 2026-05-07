import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { model } from '../config/ai.js';

const executor = initializeAgentExecutorWithOptions([], model, {
  agentType: 'openai-functions',
  verbose: true,
});

export { executor };
