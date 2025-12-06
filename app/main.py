"""
Gradient Coach FastAPI Application
Modern FastAPI backend with Gradient AI integration.
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import json
import asyncio
from dotenv import load_dotenv

from .gradient_client import GradientAIClient
from .agents import HackathonPlannerAgent, TechnicalArchitectAgent, PitchGeneratorAgent
from .templates.cline_tasks import format_cline_tasks
from .templates.repo_structure import (
    generate_readme,
    generate_gitignore,
    generate_env_example,
    generate_requirements_txt,
    generate_basic_fastapi_app
)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Gradient Coach API",
    description="AI-powered hackathon assistant using DigitalOcean Gradient AI",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gradient AI client and agents
try:
    gradient_client = GradientAIClient()
    planner_agent = HackathonPlannerAgent(gradient_client)
    architect_agent = TechnicalArchitectAgent(gradient_client)
    pitcher_agent = PitchGeneratorAgent(gradient_client)
except ValueError as e:
    print(f"Warning: Could not initialize Gradient AI client: {e}")
    gradient_client = None
    planner_agent = None
    architect_agent = None
    pitcher_agent = None


# Load knowledge base
def load_knowledge_base():
    """Load knowledge base files."""
    kb = {}
    kb_path = os.path.join(os.path.dirname(__file__), "knowledge")
    
    try:
        # Load MLH guidelines
        with open(os.path.join(kb_path, "mlh_rules.txt"), "r") as f:
            kb["mlh_guidelines"] = f.read()
        
        # Load tech stacks
        with open(os.path.join(kb_path, "tech-stacks.json"), "r") as f:
            kb["tech_stacks"] = json.load(f)
        
        # Load Gradient docs
        with open(os.path.join(kb_path, "gradient_docs.txt"), "r") as f:
            kb["gradient_docs"] = f.read()
    except Exception as e:
        print(f"Warning: Could not load knowledge base: {e}")
    
    return kb


knowledge_base = load_knowledge_base()


# Pydantic models for request/response
class ProjectIdea(BaseModel):
    idea: str = Field(..., description="Project idea description")
    experience_level: str = Field(default="intermediate", description="Team experience level")
    features: Optional[List[str]] = Field(default=None, description="Specific features wanted")
    tech_preferences: Optional[List[str]] = Field(default=None, description="Preferred technologies")


class ValidateRequest(BaseModel):
    idea: str = Field(..., description="Project idea to validate")
    experience_level: str = Field(default="intermediate")
    features: Optional[List[str]] = None
    tech_preferences: Optional[List[str]] = None


class ScaffoldRequest(BaseModel):
    idea: str
    tech_stack: Dict[str, Any]
    features: List[str]
    project_name: str


class PitchRequest(BaseModel):
    idea: str
    tech_stack: Dict[str, Any]
    features: List[str]
    target_audience: str = "hackathon judges"


class AskRequest(BaseModel):
    question: str = Field(..., description="Question about hackathon or tech")
    context: Optional[str] = Field(default=None, description="Additional context")


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Gradient Coach API",
        "version": "2.0.0",
        "powered_by": "DigitalOcean Gradient AI",
        "endpoints": [
            "/api/health",
            "/api/validate",
            "/api/scaffold",
            "/api/pitch",
            "/api/ask"
        ]
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    gradient_status = "ok" if gradient_client else "not configured"
    
    return {
        "status": "healthy",
        "gradient_ai": gradient_status,
        "knowledge_base": "loaded" if knowledge_base else "not loaded",
        "agents": {
            "planner": "ok" if planner_agent else "not configured",
            "architect": "ok" if architect_agent else "not configured",
            "pitcher": "ok" if pitcher_agent else "not configured"
        }
    }


@app.post("/api/validate")
async def validate_idea(request: ValidateRequest):
    """
    Validate hackathon idea and assess 24-hour feasibility.
    
    Returns feasibility assessment with risks and recommendations.
    """
    if not planner_agent:
        raise HTTPException(status_code=503, detail="Planner agent not configured. Set GRADIENT_AI_API_KEY.")
    
    try:
        # Validate the idea
        assessment = await planner_agent.validate_idea(
            idea=request.idea,
            experience_level=request.experience_level,
            features=request.features,
            tech_preferences=request.tech_preferences
        )
        
        # Recommend tech stack
        tech_stack = await architect_agent.recommend_tech_stack(
            idea=request.idea,
            experience_level=request.experience_level,
            time_available=assessment.get("estimated_hours", 24),
            preferences=request.tech_preferences
        )
        
        return {
            "feasibility": assessment,
            "tech_stack": tech_stack,
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@app.post("/api/scaffold")
async def generate_scaffold(request: ScaffoldRequest):
    """
    Generate repository structure and starter code.
    
    Returns file structure with code content.
    """
    if not architect_agent:
        raise HTTPException(status_code=503, detail="Architect agent not configured.")
    
    try:
        # Generate architecture
        architecture = await architect_agent.generate_architecture(
            idea=request.idea,
            tech_stack=request.tech_stack,
            features=request.features
        )
        
        # Generate file structure
        file_structure = await architect_agent.generate_file_structure(
            idea=request.idea,
            tech_stack=request.tech_stack,
            architecture=architecture
        )
        
        # Generate Cline tasks
        tasks = await architect_agent.generate_cline_tasks(
            idea=request.idea,
            tech_stack=request.tech_stack,
            architecture=architecture,
            features=request.features
        )
        
        # Format Cline tasks
        cline_json = format_cline_tasks(tasks)
        
        # Add generated templates to files
        files = file_structure.get("files", {})
        
        # Add README if not present
        if "README.md" not in files:
            files["README.md"] = generate_readme(
                request.project_name,
                request.idea,
                request.tech_stack
            )
        
        # Add .gitignore if not present
        if ".gitignore" not in files:
            files[".gitignore"] = generate_gitignore()
        
        # Add .env.example if not present
        if ".env.example" not in files:
            services = ["gradient", "api"]
            if request.tech_stack.get("database"):
                services.append("database")
            files[".env.example"] = generate_env_example(services)
        
        return {
            "architecture": architecture,
            "files": files,
            "cline_tasks": cline_json,
            "setup_commands": file_structure.get("setup_commands", []),
            "environment_variables": file_structure.get("environment_variables", []),
            "next_steps": file_structure.get("next_steps", []),
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scaffold generation failed: {str(e)}")


@app.post("/api/pitch")
async def generate_pitch(request: PitchRequest):
    """
    Generate pitch and Devpost content.
    
    Returns complete pitch package with demo script.
    """
    if not pitcher_agent:
        raise HTTPException(status_code=503, detail="Pitcher agent not configured.")
    
    try:
        # Generate pitch
        pitch = await pitcher_agent.generate_pitch(
            idea=request.idea,
            tech_stack=request.tech_stack,
            features=request.features,
            target_audience=request.target_audience
        )
        
        # Generate Devpost description
        devpost_md = await pitcher_agent.generate_devpost_description(
            idea=request.idea,
            tech_stack=request.tech_stack,
            architecture={"summary": "Generated architecture"},
            challenges=[]
        )
        
        pitch["devpost_markdown"] = devpost_md
        
        return {
            "pitch": pitch,
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pitch generation failed: {str(e)}")


@app.post("/api/ask")
async def ask_docs_oracle(request: AskRequest):
    """
    Query the docs oracle (RAG system).
    
    Answers questions about MLH guidelines, Gradient AI, or tech stacks.
    """
    if not gradient_client:
        raise HTTPException(status_code=503, detail="Gradient AI client not configured.")
    
    try:
        # Build context from knowledge base
        context_parts = []
        
        # Add relevant knowledge based on question keywords
        question_lower = request.question.lower()
        
        if any(word in question_lower for word in ["mlh", "hackathon", "judge", "demo", "present"]):
            context_parts.append("MLH Guidelines:\n" + knowledge_base.get("mlh_guidelines", ""))
        
        if any(word in question_lower for word in ["gradient", "api", "ai", "claude", "anthropic"]):
            context_parts.append("Gradient AI Documentation:\n" + knowledge_base.get("gradient_docs", ""))
        
        if any(word in question_lower for word in ["tech", "stack", "framework", "library"]):
            tech_stacks = knowledge_base.get("tech_stacks", {})
            context_parts.append("Tech Stack Templates:\n" + json.dumps(tech_stacks, indent=2))
        
        # If no specific context, add all
        if not context_parts:
            context_parts = [
                knowledge_base.get("mlh_guidelines", ""),
                knowledge_base.get("gradient_docs", "")
            ]
        
        context = "\n\n".join(context_parts)
        
        # Add user context if provided
        if request.context:
            context = f"{context}\n\nAdditional Context: {request.context}"
        
        # Generate answer
        system_prompt = """You are a helpful hackathon mentor and technical advisor. 
Answer questions using the provided knowledge base. Be specific, practical, and encouraging.
If you don't find the answer in the knowledge base, say so and provide general best practices."""
        
        prompt = f"""Context:\n{context}\n\nQuestion: {request.question}\n\nProvide a clear, actionable answer:"""
        
        answer = await gradient_client.generate_completion(
            prompt=prompt,
            system_prompt=system_prompt,
            max_tokens=2000
        )
        
        return {
            "question": request.question,
            "answer": answer,
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.get("/api/knowledge-base")
async def get_knowledge_base():
    """Get available knowledge base content."""
    return {
        "available": list(knowledge_base.keys()),
        "tech_stacks": knowledge_base.get("tech_stacks", {}).get("templates", {}).keys() if knowledge_base.get("tech_stacks") else [],
        "status": "success"
    }


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status": "error"}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": f"Internal server error: {str(exc)}", "status": "error"}
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
