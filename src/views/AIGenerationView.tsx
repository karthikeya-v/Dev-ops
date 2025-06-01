import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { LightningBoltIcon } from '@radix-ui/react-icons';

interface AISuggestion {
  id: string;
  text: string;
  // OpenRouter doesn't typically provide a confidence score in the same way.
  // We can remove this or adapt it if the model provides something similar.
  // For now, let's remove it for simplicity.
}

const AIGenerationView: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<{ prompt: string }>();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSuggestions = async (data: { prompt: string }) => {
    setIsLoading(true);
    setError('');
    setSuggestions([]); // Clear previous suggestions

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1', // Correct model name for OpenRouter
          messages: [
            { role: 'user', content: data.prompt },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        const newSuggestionText = response.data.choices[0].message.content;
        // Create a simple suggestion object. OpenRouter doesn't give multiple suggestions or IDs by default.
        const newSuggestion: AISuggestion = {
          id: new Date().toISOString(), // Generate a unique ID
          text: newSuggestionText,
        };
        setSuggestions([newSuggestion]);
      } else {
        setError('No suggestions received from AI.');
      }
      reset(); // Clear the form input
    } catch (err: any) {
      console.error('Error calling OpenRouter API:', err.response?.data || err.message);
      setError('Failed to generate suggestions. Please check your API key and network. More details in console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <LightningBoltIcon className="text-blue-500 h-6 w-6" />
        AI Workflow Suggestions
      </h2>
      
      <form onSubmit={handleSubmit(generateSuggestions)} className="mb-6">
        <div className="flex gap-2">
          <input
            {...register('prompt', { required: 'Please enter a prompt.' })}
            placeholder="Describe your project needs... (e.g., Create a user authentication flow)"
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 transition-colors duration-150 ease-in-out"
          >
            <LightningBoltIcon className="h-5 w-5" />
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>

      {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 border border-red-300">{error}</div>}

      <div className="space-y-4">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">{suggestion.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIGenerationView;
