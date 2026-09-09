# PromptPilot

### AI-Powered Developer Workspace with Code Generation, AI Agents, and RAG

PromptPilot is an AI-powered developer workspace designed to help developers write, understand, and work with code more efficiently.

Instead of using AI only as a traditional chatbot, PromptPilot combines AI code generation, code explanation, agentic task execution, and RAG-based codebase search into a single full-stack application.

---

## Why I Built PromptPilot

While working with AI coding tools, I noticed that developers often have to switch between different tools for different tasks:

* One tool for generating code
* Another for understanding existing code
* Another for asking questions about a codebase
* Another for breaking large development tasks into smaller steps

I wanted to explore whether these workflows could be combined into a single developer-focused workspace.

PromptPilot was built as a practical exploration of how LLMs, AI agents, and Retrieval-Augmented Generation can be integrated into a real-world full-stack application.

The goal was not simply to build another chatbot, but to understand how an AI-powered developer tool can be designed from the frontend and backend to the AI and data layers.

---

## Problem

Traditional AI chat interfaces are useful, but they often lack context.

For example, if a developer asks:

> "How does authentication work in my project?"

A general AI model does not automatically know the structure of the developer's codebase.

Similarly, asking an LLM to solve a large development task in a single response can make the process difficult to manage.

PromptPilot addresses these problems through three main approaches:

1. Context-aware code assistance
2. Agentic task execution
3. RAG-based codebase understanding

---

## Features

### AI Code Generation

Developers can describe what they want to build in natural language and PromptPilot generates code using the Gemini API.

Example:

```text
Create a React authentication form with email and password validation.
```

The request is sent through the backend, processed with development-specific instructions, and the generated code is returned to the frontend.

---

### AI Code Explanation

Developers can provide existing code and receive an AI-generated explanation.

The system can explain:

* What the code does
* How different sections work
* Important concepts being used
* Possible improvements

This makes PromptPilot useful for both code generation and understanding existing code.

---

### AI Agent

PromptPilot includes an agentic workflow for handling larger development tasks.

Instead of asking the LLM to solve everything in a single response, the agent first creates a multi-step execution plan.

```text
User Task
    |
    v
Create Execution Plan
    |
    v
Step 1
    |
    v
Step 2
    |
    v
Step 3
    |
    v
Step 4
    |
    v
Final Output
```

The agent creates a 4–5 step plan and executes the steps sequentially.

The output from previous steps is passed as context to subsequent steps, allowing the agent to maintain context throughout the workflow.

---

### RAG-Based Codebase Chat

PromptPilot includes a Retrieval-Augmented Generation workflow that allows developers to ask questions about their code.

The RAG pipeline works as follows:

```text
Code / Document
      |
      v
Text Chunking
      |
      v
Embedding Generation
      |
      v
Pinecone Vector Database
      |
      v
Semantic Search
      |
      v
Relevant Code Context
      |
      v
Gemini
      |
      v
Context-Aware Answer
```

For example:

```text
What does the authentication system do?

How does this API endpoint work?

What are the main functions in this file?

How is authentication implemented?
```

Instead of relying only on the model's general knowledge, PromptPilot retrieves relevant sections of the uploaded code and provides them as context to the LLM.

---

## Architecture

```text
                    User
                     |
                     v
            React + Vite Frontend
                     |
                 REST API
                     |
                     v
              Node + Express
                  Backend
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Gemini     MongoDB    Pinecone
         API      Database   Vector DB
          |                    |
          |               Semantic Search
          |                    |
          +---------+----------+
                    |
                    v
             AI Response
```

---

## How the AI Works

### Code Generation

```text
User Prompt
     |
     v
React Frontend
     |
     v
Express API
     |
     v
Prompt Processing
     |
     v
Gemini API
     |
     v
Generated Code
     |
     v
Frontend
```

The backend processes the user's request and sends it to the Gemini API with additional instructions focused on generating useful and complete development output.

---

### Agent Workflow

```text
User Task
    |
    v
Generate Plan
    |
    v
Step 1
    |
    v
Store Output
    |
    v
Step 2 + Previous Context
    |
    v
Store Output
    |
    v
Step 3 + Previous Context
    |
    v
...
    |
    v
Final Result
```

The agent demonstrates how an LLM can be used as part of a multi-step workflow instead of treating it as a single request-response system.

---

### RAG Workflow

Uploaded code is divided into smaller chunks.

Each chunk is converted into an embedding and stored in Pinecone with relevant metadata.

When the user asks a question:

```text
Question
   |
   v
Question Embedding
   |
   v
Pinecone Similarity Search
   |
   v
Relevant Code Chunks
   |
   v
Gemini + Retrieved Context
   |
   v
Answer
```

This allows the application to provide responses based on the user's actual code rather than relying only on the model's general knowledge.

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* Mongoose
* Axios

### AI

* Google Gemini API
* Gemini Embeddings
* Agentic LLM Workflow
* Retrieval-Augmented Generation

### Database and Infrastructure

* MongoDB
* Pinecone Vector Database

---

## Project Structure

```text
Prompt-Pilot/
|
├── public/
|
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PlaygroundPage.jsx
│   │   ├── AgentPage.jsx
│   │   └── RAGPage.jsx
│   │
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
|
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
|
└── package.json
```

---

## Authentication

PromptPilot uses JWT-based authentication.

Users can:

* Create an account
* Log in
* Access protected application features
* Maintain authenticated sessions
* Manage their profile

Protected routes prevent unauthenticated users from accessing application features.

---

## API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/me
```

### AI

```text
POST /api/ai/generate
POST /api/ai/explain
```

### Agent

```text
POST /api/agent/run
```

### RAG

```text
POST   /api/rag/upload
POST   /api/rag/chat
GET    /api/rag/documents
DELETE /api/rag/document/:id
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ArpitSadotra/Prompt-Pilot.git
cd Prompt-Pilot
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

PINECONE_API_KEY=your_pinecone_api_key

PINECONE_INDEX_NAME=your_pinecone_index
```

Never commit API keys or other secrets to GitHub.

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

From the project root:

```bash
npm run dev
```

---

## What I Learned

Building PromptPilot helped me explore how modern AI capabilities can be integrated into a full-stack application.

Key areas I worked with include:

* LLM API integration
* Prompt engineering
* AI code generation
* AI code explanation
* Agentic workflows
* Sequential task execution
* Context management
* Retrieval-Augmented Generation
* Text chunking
* Vector embeddings
* Semantic search
* Vector databases
* JWT authentication
* REST API design
* Connecting AI services with a React application

---

## Future Improvements

Potential improvements include:

* Streaming AI responses
* More reliable multi-step agent execution
* Improved agent state management
* Better code chunking strategies
* GitHub repository integration
* Conversation history
* Automated code testing and validation
* Additional agent tools
* Improved monitoring and error handling

---

## Project Motivation

PromptPilot was built as a hands-on project to explore the intersection of full-stack development and modern AI application architecture.

The main idea behind the project is:

> How can AI become an actual development workspace rather than just another chat interface?

PromptPilot is my attempt to explore that idea through a working full-stack application.

---

## Repository

GitHub: https://github.com/ArpitSadotra/Prompt-Pilot
