"""
Repository structure and code generation templates.
"""
from typing import Dict, Any, List


def generate_readme(project_name: str, description: str, tech_stack: Dict[str, Any]) -> str:
    """Generate README.md content."""
    return f"""# {project_name}

{description}

## Tech Stack

**Frontend:** {', '.join(tech_stack.get('frontend', {}).get('key_libraries', [])[:3])}

**Backend:** {', '.join(tech_stack.get('backend', {}).get('key_libraries', [])[:3])}

**Database:** {tech_stack.get('database', {}).get('type', 'N/A')}

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/{project_name.lower().replace(' ', '-')}.git
cd {project_name.lower().replace(' ', '-')}
```

2. Install dependencies:
```bash
# Install backend dependencies
pip install -r requirements.txt
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application:
```bash
# Development mode
npm run dev
# or
python app.py
```

## Features

- 🚀 Feature 1
- ✨ Feature 2
- 🎯 Feature 3

## Demo

[Link to demo video or screenshots]

## Development

Built during [Hackathon Name] in 24 hours.

## License

MIT
"""


def generate_gitignore(stack_type: str = "full-stack") -> str:
    """Generate .gitignore content based on stack type."""
    base = """# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
__pycache__/
*.pyc
.Python
venv/
env/
ENV/

# Build outputs
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
npm-debug.log*

# Testing
.coverage
htmlcov/
.pytest_cache/
.jest/

# Database
*.db
*.sqlite
*.sqlite3

# Misc
.cache/
temp/
tmp/
"""
    return base


def generate_env_example(services: List[str]) -> str:
    """Generate .env.example file."""
    env_vars = ["# Environment Configuration\n"]
    
    if "gradient" in services or "ai" in services:
        env_vars.append("# Gradient AI / Anthropic API Key\n")
        env_vars.append("GRADIENT_AI_API_KEY=your-api-key-here\n")
        env_vars.append("# ANTHROPIC_API_KEY=your-api-key-here\n\n")
    
    if "database" in services:
        env_vars.append("# Database Configuration\n")
        env_vars.append("DATABASE_URL=postgresql://user:pass@localhost:5432/dbname\n\n")
    
    if "api" in services:
        env_vars.append("# API Configuration\n")
        env_vars.append("API_PORT=8000\n")
        env_vars.append("API_HOST=0.0.0.0\n\n")
    
    return "".join(env_vars)


def generate_package_json(project_name: str, dependencies: List[str]) -> Dict[str, Any]:
    """Generate package.json for Node.js projects."""
    base_deps = {
        "express": "^4.18.2",
        "dotenv": "^16.3.1"
    }
    
    base_dev_deps = {
        "nodemon": "^3.0.1"
    }
    
    return {
        "name": project_name.lower().replace(" ", "-"),
        "version": "1.0.0",
        "description": f"{project_name} - Built at hackathon",
        "main": "index.js",
        "scripts": {
            "start": "node index.js",
            "dev": "nodemon index.js",
            "build": "echo 'No build step required'"
        },
        "dependencies": base_deps,
        "devDependencies": base_dev_deps,
        "keywords": ["hackathon"],
        "author": "",
        "license": "MIT"
    }


def generate_requirements_txt(includes_ai: bool = False) -> str:
    """Generate requirements.txt for Python projects."""
    base = """fastapi==0.109.0
uvicorn[standard]==0.27.0
python-dotenv==1.0.0
pydantic==2.5.3
"""
    
    if includes_ai:
        base += """httpx==0.26.0
anthropic==0.18.1
"""
    
    return base


def generate_basic_fastapi_app() -> str:
    """Generate basic FastAPI app template."""
    return '''"""
FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Hackathon Project API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to the API!", "status": "running"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


# Add your routes here
@app.get("/api/data")
async def get_data():
    """Example endpoint."""
    return {"data": "Hello from the API"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
'''


def generate_basic_express_app() -> str:
    """Generate basic Express.js app template."""
    return '''const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!', status: 'running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Hello from the API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
'''


def generate_basic_html_template(project_name: str) -> str:
    """Generate basic HTML template."""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project_name}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }}
        
        .container {{
            text-align: center;
            padding: 2rem;
        }}
        
        h1 {{
            font-size: 3rem;
            margin-bottom: 1rem;
        }}
        
        p {{
            font-size: 1.2rem;
            opacity: 0.9;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 {project_name}</h1>
        <p>Your hackathon project is ready to go!</p>
    </div>
</body>
</html>
'''


# Export all generator functions
__all__ = [
    "generate_readme",
    "generate_gitignore",
    "generate_env_example",
    "generate_package_json",
    "generate_requirements_txt",
    "generate_basic_fastapi_app",
    "generate_basic_express_app",
    "generate_basic_html_template",
]