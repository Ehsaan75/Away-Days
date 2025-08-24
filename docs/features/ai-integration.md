# AI Integration

## Overview
Away Days uses OpenAI to enhance the user experience through intelligent location categorization and future AI-powered features.

## Location Categorization

### Implementation
- **File**: `src/app/api/experiences/route.ts`
- **Trigger**: Automatically runs when users log new watching experiences
- **Model**: Uses `OPENAI_MODEL` environment variable (defaults to gpt-3.5-turbo)

### Categories
The AI categorizes watching locations into:
- **Stadium**: Official football venues
- **Home**: User's residence
- **Pub/Bar**: Public drinking establishments
- **Friend's House**: Social viewing at friends' homes
- **Outdoor**: Parks, gardens, outdoor screens
- **Other**: Any location not fitting above categories

### Process
1. User enters watching location and optional details
2. System combines location fields into context string
3. Sends prompt to OpenAI with categorization instructions
4. AI responds with single category name
5. Category stored in `aiCategorizedLocation` field
6. Displayed with robot emoji (🤖) in UI

### Error Handling
- Graceful fallback if AI service fails
- Continues without AI categorization rather than blocking
- Logs errors for debugging
- No user-facing errors from AI failures

## Technical Configuration

### Environment Variables
- `OPENAI_API_KEY`: Required for API access
- `OPENAI_MODEL`: Configurable model name (e.g., "gpt-4", "gpt-3.5-turbo")

### Code Structure
```typescript
const { generateText } = await import("ai");
const { openai } = await import("@ai-sdk/openai");
const model = openai(process.env.OPENAI_MODEL || "gpt-3.5-turbo");

const result = await generateText({
  model,
  prompt: `Categorization prompt with context...`,
});
```

### Dependencies
- `ai` package for generateText function
- `@ai-sdk/openai` for OpenAI provider
- Dynamic imports for performance

## UI Integration

### Profile Display
- AI categories shown as badges with robot emoji
- Distinguishes from user-entered location
- Provides additional context for experiences

### Feed Display
- Categories visible in social feed
- Helps friends understand viewing context
- Consistent styling across app

## Future Enhancements
The AI integration framework supports:
- Match recommendations based on viewing history
- Location suggestions for future matches
- Personalized insights about viewing preferences
- Social recommendations (suggesting friends with similar tastes)

## Privacy Considerations
- Location data processed for categorization only
- No personal data stored with AI service
- User location details remain under user control
- AI categorization enhances but doesn't replace user input