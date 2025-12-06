"""
Technical Architect Agent
Generates repository structures and code scaffolding.
"""
from typing import Dict, Any, List
from ..gradient_client import GradientAIClient


class TechnicalArchitectAgent:
    """Agent for generating technical architecture and code."""
    
    def __init__(self, client: GradientAIClient):
        self.client = client
        self.system_prompt = """You are an expert software architect specializing in rapid prototyping and hackathon projects. Your expertise includes:

1. Selecting optimal tech stacks for fast development
2. Designing simple, effective architectures
3. Generating starter code and configurations
4. Creating clear file structures
5. Recommending battle-tested libraries
6. Avoiding over-engineering

Your recommendations should prioritize:
- Speed of development
- Minimal setup time
- Proven, stable technologies
- Clear separation of concerns
- Easy debugging

Remember: The goal is a working demo in 24 hours, not production-ready software."""
    
    async def recommend_tech_stack(
        self,
        idea: str,
        experience_level: str,
        time_available: int,
        preferences: List[str] = None
    ) -> Dict[str, Any]:
        """
        Recommend an optimal tech stack for the project.
        
        Args:
            idea: Project description
            experience_level: Team's experience level
            time_available: Hours available
            preferences: Preferred technologies
            
        Returns:
            Recommended tech stack with rationale
        """
        prefs_str = ", ".join(preferences) if preferences else "no preferences"
        
        prompt = f"""Recommend an ultra-lean tech stack for this hackathon project:

**Project:** {idea}
**Experience:** {experience_level}
**Time Budget:** {time_available} hours
**Preferences:** {prefs_str}

Recommend technologies that:
1. Have minimal setup time
2. Are well-documented
3. Have active communities
4. Are proven and stable
5. Match the team's experience level

Format as JSON:
{{
    "frontend": {{
        "framework": "name",
        "reasoning": "why this choice",
        "setup_time": 0.5,
        "key_libraries": ["lib1", "lib2"]
    }},
    "backend": {{
        "framework": "name",
        "reasoning": "why this choice",
        "setup_time": 1,
        "key_libraries": ["lib1", "lib2"]
    }},
    "database": {{
        "type": "name",
        "reasoning": "why this choice",
        "setup_time": 0.5
    }},
    "hosting": {{
        "platform": "name",
        "reasoning": "why this choice"
    }},
    "other_tools": [
        {{"name": "tool", "purpose": "what it does"}}
    ],
    "total_setup_hours": 2,
    "learning_curve": "low/medium/high",
    "alternative_stacks": [
        {{"description": "alternative option", "tradeoffs": "pros and cons"}}
    ]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
    
    async def generate_architecture(
        self,
        idea: str,
        tech_stack: Dict[str, Any],
        features: List[str]
    ) -> Dict[str, Any]:
        """
        Generate system architecture and design.
        
        Args:
            idea: Project description
            tech_stack: Selected tech stack
            features: Core features to implement
            
        Returns:
            Architecture design with components
        """
        prompt = f"""Design a simple, effective architecture for this project:

**Project:** {idea}
**Tech Stack:** {tech_stack}
**Core Features:** {", ".join(features)}

Create an architecture that:
1. Separates concerns clearly
2. Is easy to understand and debug
3. Minimizes complexity
4. Supports rapid iteration

Format as JSON:
{{
    "architecture_pattern": "name (e.g., MVC, Client-Server)",
    "components": [
        {{
            "name": "component name",
            "responsibility": "what it does",
            "technologies": ["tech1", "tech2"],
            "estimated_hours": 4
        }}
    ],
    "data_flow": "brief description of how data moves through the system",
    "api_endpoints": [
        {{"method": "POST", "path": "/api/endpoint", "purpose": "what it does"}}
    ],
    "file_structure": {{
        "src/": ["file1.js", "file2.js"],
        "public/": ["index.html"]
    }},
    "integration_points": ["point 1", "point 2"],
    "critical_path": ["step 1", "step 2", "step 3"]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
    
    async def generate_file_structure(
        self,
        idea: str,
        tech_stack: Dict[str, Any],
        architecture: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate complete file structure with starter code.
        
        Args:
            idea: Project description
            tech_stack: Selected tech stack
            architecture: System architecture
            
        Returns:
            File structure with code content
        """
        prompt = f"""Generate a complete starter file structure for this project:

**Project:** {idea}
**Tech Stack:** {tech_stack}
**Architecture:** {architecture}

Generate all necessary files with starter code including:
1. Configuration files (package.json, requirements.txt, etc.)
2. Main application files
3. Basic routing/API setup
4. Example components
5. README with setup instructions
6. .gitignore
7. Environment configuration

Format as JSON:
{{
    "files": {{
        "path/to/file.ext": "file content here",
        "README.md": "setup instructions",
        "package.json": "{{\\"dependencies\\": {{}}}}",
        ".gitignore": "node_modules/"
    }},
    "setup_commands": ["npm install", "npm start"],
    "environment_variables": [
        {{"name": "API_KEY", "description": "API key for service X", "required": true}}
    ],
    "next_steps": ["step 1", "step 2", "step 3"]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt, max_tokens=8000)
    
    async def generate_cline_tasks(
        self,
        idea: str,
        tech_stack: Dict[str, Any],
        architecture: Dict[str, Any],
        features: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Generate Cline tasks for AI-assisted development.
        
        Args:
            idea: Project description
            tech_stack: Selected tech stack
            architecture: System architecture
            features: Features to implement
            
        Returns:
            List of Cline tasks
        """
        prompt = f"""Generate Cline tasks (for AI coding assistant) for this project:

**Project:** {idea}
**Tech Stack:** {tech_stack}
**Architecture:** {architecture}
**Features:** {", ".join(features)}

Break down the implementation into clear, sequential tasks that:
1. Start with setup and configuration
2. Build foundation before features
3. Are specific and actionable
4. Include testing steps
5. End with documentation and polish

Format as JSON array:
[
    {{
        "id": 1,
        "title": "Task title",
        "description": "Detailed description of what to do",
        "files_to_modify": ["file1.js", "file2.js"],
        "acceptance_criteria": ["criterion 1", "criterion 2"],
        "estimated_minutes": 30,
        "dependencies": [],
        "priority": "high/medium/low"
    }}
]"""
        
        result = await self.client.generate_json(prompt, self.system_prompt, max_tokens=8000)
        return result if isinstance(result, list) else result.get("tasks", [])
