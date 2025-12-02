# 🎭 GenWar Council

> **"Enter a topic and watch three generations tear it apart."**

GenWar Council is a witty, sarcastic, and intelligent debate application where AI personas representing different generations (Boomer, Millennial, Gen Z) argue over user-submitted topics. The chaos is then judged by a supreme AI Moderator who delivers a final verdict.

## 🧠 Architecture & Flow

The application follows a client-side architecture using React and the Google Gemini API.

```mermaid
graph TD
    User[User Input] -->|Submit Topic| App[React App]
    
    subgraph "Parallel Generation Phase"
        App -->|Req: Boomer Persona| Flash1[Gemini 2.5 Flash]
        App -->|Req: Millennial Persona| Flash2[Gemini 2.5 Flash]
        App -->|Req: Gen Z Persona| Flash3[Gemini 2.5 Flash]
    end
    
    Flash1 -->|Resp: "Back in my day..."| App
    Flash2 -->|Resp: "I'm so tired..."| App
    Flash3 -->|Resp: "fr no cap..."| App
    
    subgraph "Judgement Phase"
        App -->|Send: All 3 Responses| Pro[Gemini 3.0 Pro]
        Pro -->|Verdict: Winner & Roast| App
    end
    
    App -->|Render| UI[User Interface]
```

## 🛠 Tech Stack

*   **Frontend Library:** React 19
*   **Styling:** Tailwind CSS (Dark mode, gradients, glassmorphism)
*   **AI SDK:** `@google/genai` (Official Google GenAI SDK)
*   **Icons:** Lucide React
*   **Markdown Rendering:** `react-markdown`

## 🤖 Model Specifications

The application utilizes specific Google Gemini models tailored for performance and reasoning capabilities:

### 1. The Council (Debaters)
*   **Model:** `gemini-2.5-flash`
*   **Why:** Optimized for speed and cost-efficiency. Perfect for generating short, creative, and stylistic text responses in parallel.
*   **Configuration:**
    *   `thinkingBudget: 0`: Explicitly disabled to prevent the model from wasting tokens on internal reasoning for simple creative writing tasks.
    *   `temperature: 0.9`: High creativity.
    *   `maxOutputTokens: 500`: Sufficient for punchy arguments.

### 2. The Moderator (Judge)
*   **Model:** `gemini-3-pro-preview`
*   **Why:** Requires higher reasoning capabilities to analyze three distinct viewpoints, synthesize the context, and generate a witty, complex verdict.
*   **Configuration:**
    *   `temperature: 0.7`: Balanced creativity and coherence.
    *   `maxOutputTokens: 1024`: Allows for a detailed verdict summary.

## 🎭 Personas & System Instructions

The application relies heavily on distinct system instructions to enforce character consistency:

| Persona | Archetype | Visual Theme | Style |
| :--- | :--- | :--- | :--- |
| **Boomer Uncle** | Nostalgic, loud, condscending | Amber/Orange | All caps, WhatsApp forward style, blames phones. |
| **Tired Millennial** | Depressed, coffee-addict, anxious | Sky Blue | Lowercase, ellipses, complains about "adulting". |
| **Zoomer** | Chaotic, nihilistic, slang-heavy | Fuchsia/Pink | Gen Z slang ("fr", "bet", "skull emoji"), ironic. |
| **The Moderator** | Theatrical, impartial, grandiose | Gold/Yellow | Markdown formatted, structured verdicts. |

## 🛡️ Safety Settings

To ensure the "Roast" style humor functions correctly without triggering false positives in safety filters, the application explicitly configures safety settings:

*   **Categories:** Harassment, Hate Speech, Sexually Explicit, Dangerous Content.
*   **Threshold:** `BLOCK_NONE` (Permits creative freedom for fictional roleplay and satire).

## 🚀 Getting Started

1.  **Environment Variables:**
    Ensure you have a valid Google Gemini API Key.
    ```env
    API_KEY=your_google_api_key_here
    ```

2.  **Installation:**
    ```bash
    npm install
    ```

3.  **Run Development Server:**
    ```bash
    npm start
    ```

## ⚠️ Known Behaviors

*   **Empty Responses:** If `thinkingBudget` is not set to `0` for `gemini-2.5-flash` with low token limits, the model may return empty text. This is handled in the service configuration.
*   **Latency:** The Moderator step waits for all three personas to finish. Total generation time depends on the API latency of the `flash` and `pro` models.
