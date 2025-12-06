"""
Pitch Generator Agent
Creates Devpost descriptions and pitch scripts.
"""
from typing import Dict, Any, List
from ..gradient_client import GradientAIClient


class PitchGeneratorAgent:
    """Agent for generating hackathon pitches and Devpost content."""
    
    def __init__(self, client: GradientAIClient):
        self.client = client
        self.system_prompt = """You are an expert hackathon pitch coach and storyteller. Your expertise includes:

1. Crafting compelling narratives
2. Highlighting innovation and impact
3. Writing clear, engaging Devpost descriptions
4. Creating memorable demo scripts
5. Emphasizing the "why" behind projects
6. Showcasing technical achievements

Your pitches should:
- Start with a relatable problem
- Show clear solution and impact
- Highlight technical innovation
- Be concise and memorable
- Include a clear call-to-action
- Follow Devpost best practices

Remember: Judges see many projects. Make yours stand out with clarity and passion."""
    
    async def generate_pitch(
        self,
        idea: str,
        tech_stack: Dict[str, Any],
        features: List[str],
        target_audience: str = "hackathon judges"
    ) -> Dict[str, Any]:
        """
        Generate a complete pitch package.
        
        Args:
            idea: Project description
            tech_stack: Technologies used
            features: Key features
            target_audience: Who the pitch is for
            
        Returns:
            Complete pitch with multiple formats
        """
        features_str = ", ".join(features) if features else "not specified"
        
        prompt = f"""Create a compelling hackathon pitch for this project:

**Project:** {idea}
**Tech Stack:** {tech_stack}
**Key Features:** {features_str}
**Audience:** {target_audience}

Generate a complete pitch package including:
1. Catchy project name
2. One-sentence tagline
3. Elevator pitch (30 seconds)
4. Full 2-minute demo script
5. Devpost description
6. Problem statement
7. Solution description
8. Impact and use cases
9. Technical highlights

Format as JSON:
{{
    "project_name": "Catchy name",
    "tagline": "One compelling sentence",
    "elevator_pitch": "30-second pitch",
    "demo_script": {{
        "intro": "Opening hook (10 sec)",
        "problem": "Problem statement (20 sec)",
        "solution": "Solution demo (60 sec)",
        "impact": "Impact and next steps (20 sec)",
        "closing": "Memorable closing (10 sec)"
    }},
    "devpost": {{
        "inspiration": "What inspired the project",
        "what_it_does": "Clear description of functionality",
        "how_we_built_it": "Technical implementation details",
        "challenges": "Challenges faced and how we overcame them",
        "accomplishments": "What we're proud of",
        "what_we_learned": "Key learnings",
        "whats_next": "Future plans"
    }},
    "key_talking_points": ["point 1", "point 2", "point 3"],
    "demo_tips": ["tip 1", "tip 2"],
    "potential_questions": [
        {{"question": "likely judge question", "answer": "suggested answer"}}
    ]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt, max_tokens=6000)
    
    async def generate_devpost_description(
        self,
        idea: str,
        tech_stack: Dict[str, Any],
        architecture: Dict[str, Any],
        challenges: List[str] = None
    ) -> str:
        """
        Generate a well-formatted Devpost description.
        
        Args:
            idea: Project description
            tech_stack: Technologies used
            architecture: System architecture
            challenges: Challenges faced
            
        Returns:
            Formatted Devpost description in Markdown
        """
        challenges_str = ", ".join(challenges) if challenges else "various technical challenges"
        
        prompt = f"""Write a compelling Devpost description for this hackathon project:

**Project:** {idea}
**Tech Stack:** {tech_stack}
**Architecture:** {architecture}
**Challenges:** {challenges_str}

Write in Markdown format with these sections:
1. ## Inspiration (Why we built this)
2. ## What it does (Clear functionality description)
3. ## How we built it (Technical details, architecture)
4. ## Challenges we ran into (Specific problems and solutions)
5. ## Accomplishments that we're proud of (Technical wins)
6. ## What we learned (Team learnings)
7. ## What's next for [Project Name] (Future plans)

Make it:
- Engaging and narrative-driven
- Specific with technical details
- Honest about challenges
- Optimistic about impact
- Well-formatted with headers and bullets

Do not use JSON format. Return the raw Markdown text."""
        
        return await self.client.generate_completion(prompt, self.system_prompt, max_tokens=4000)
    
    async def generate_demo_script(
        self,
        project_name: str,
        features: List[str],
        demo_flow: List[str]
    ) -> Dict[str, Any]:
        """
        Generate a detailed demo script with timing.
        
        Args:
            project_name: Name of the project
            features: Key features to showcase
            demo_flow: Steps in the demo
            
        Returns:
            Timed demo script
        """
        prompt = f"""Create a 2-minute demo script for this project:

**Project Name:** {project_name}
**Key Features:** {", ".join(features)}
**Demo Flow:** {", ".join(demo_flow)}

Create a script that:
1. Hooks the audience in first 10 seconds
2. Shows the problem clearly
3. Demonstrates the solution with live features
4. Emphasizes the innovation
5. Ends memorably

Format as JSON with timing:
{{
    "total_seconds": 120,
    "sections": [
        {{
            "timing": "0:00-0:10",
            "duration_seconds": 10,
            "section": "Hook",
            "script": "What to say",
            "action": "What to do/show on screen",
            "tips": ["presentation tip"]
        }}
    ],
    "backup_plan": "What to do if demo fails",
    "key_phrases": ["memorable phrase 1", "memorable phrase 2"],
    "visual_cues": ["thing to highlight 1", "thing to highlight 2"]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
    
    async def improve_pitch(
        self,
        current_pitch: str,
        feedback: str,
        constraints: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Improve an existing pitch based on feedback.
        
        Args:
            current_pitch: Current pitch text
            feedback: Feedback or areas to improve
            constraints: Any constraints (time, topics, etc.)
            
        Returns:
            Improved pitch with explanations
        """
        constraints_str = str(constraints) if constraints else "none"
        
        prompt = f"""Improve this hackathon pitch based on feedback:

**Current Pitch:**
{current_pitch}

**Feedback:**
{feedback}

**Constraints:**
{constraints_str}

Provide an improved version that:
1. Addresses the feedback
2. Maintains the core message
3. Is more engaging and clear
4. Follows best practices

Format as JSON:
{{
    "improved_pitch": "revised pitch text",
    "changes_made": ["change 1", "change 2"],
    "reasoning": "why these changes improve it",
    "before_after": [
        {{"before": "old phrase", "after": "new phrase", "why": "improvement reason"}}
    ],
    "remaining_improvements": ["suggestion 1", "suggestion 2"]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
