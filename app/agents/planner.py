"""
Hackathon Planner Agent
Validates ideas and checks 24-hour feasibility.
"""
from typing import Dict, Any, List
from ..gradient_client import GradientAIClient


class HackathonPlannerAgent:
    """Agent for validating hackathon ideas and assessing feasibility."""
    
    def __init__(self, client: GradientAIClient):
        self.client = client
        self.system_prompt = """You are an experienced hackathon mentor and technical advisor. Your role is to:

1. Validate if a project idea is feasible within 24 hours
2. Assess technical complexity and risks
3. Ask clarifying questions to understand scope
4. Provide realistic time estimates
5. Suggest scope reductions if needed
6. Consider the team's experience level

You should be honest but encouraging. Help teams understand what's achievable while maintaining their enthusiasm.
Focus on shipping a working demo, not production-ready software."""
    
    async def validate_idea(
        self,
        idea: str,
        experience_level: str,
        features: List[str] = None,
        tech_preferences: List[str] = None
    ) -> Dict[str, Any]:
        """
        Validate a hackathon idea and assess its 24-hour feasibility.
        
        Args:
            idea: The project idea description
            experience_level: Team's experience level (beginner/intermediate/advanced)
            features: Optional list of specific features
            tech_preferences: Optional list of preferred technologies
            
        Returns:
            Dictionary with feasibility assessment
        """
        features_str = ", ".join(features) if features else "none specified"
        tech_str = ", ".join(tech_preferences) if tech_preferences else "open to suggestions"
        
        prompt = f"""Analyze this hackathon project idea for 24-hour feasibility:

**Project Idea:** {idea}
**Team Experience:** {experience_level}
**Desired Features:** {features_str}
**Tech Preferences:** {tech_str}

Provide a comprehensive feasibility assessment with:
1. Overall feasibility (feasible/challenging/not feasible)
2. Risk level (low/medium/high)
3. Estimated hours needed (be realistic)
4. Key risks and challenges
5. Recommended scope adjustments
6. Clarifying questions (if scope is unclear)
7. Confidence score (0-100)

Format your response as JSON with these fields:
{{
    "is_feasible": true/false,
    "risk_level": "low/medium/high",
    "estimated_hours": 18,
    "confidence_score": 85,
    "assessment_summary": "Brief overall assessment",
    "key_risks": ["risk 1", "risk 2"],
    "scope_recommendations": ["recommendation 1", "recommendation 2"],
    "clarifying_questions": ["question 1", "question 2"],
    "time_breakdown": {{
        "setup_and_planning": 2,
        "core_development": 10,
        "integration_and_testing": 4,
        "polish_and_demo": 2
    }}
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
    
    async def ask_clarifying_question(
        self,
        idea: str,
        previous_answers: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Generate clarifying questions about the project idea.
        
        Args:
            idea: The project idea
            previous_answers: List of previous Q&A pairs
            
        Returns:
            Dictionary with question and follow-up suggestions
        """
        context = ""
        if previous_answers:
            for qa in previous_answers:
                context += f"\nQ: {qa['question']}\nA: {qa['answer']}"
        
        prompt = f"""Based on this hackathon idea, generate one clarifying question to better understand the scope:

**Idea:** {idea}
{context}

Generate a single, specific question that will help determine feasibility. Focus on:
- Target users and use cases
- Core vs. nice-to-have features
- Technical constraints
- Integration requirements

Format as JSON:
{{
    "question": "Your clarifying question here",
    "why_asking": "Brief explanation of why this matters for feasibility",
    "example_answers": ["example 1", "example 2"]
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
    
    async def refine_scope(
        self,
        idea: str,
        original_assessment: Dict[str, Any],
        constraints: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Refine project scope based on constraints.
        
        Args:
            idea: Original project idea
            original_assessment: Initial feasibility assessment
            constraints: Time/skill/resource constraints
            
        Returns:
            Refined scope and recommendations
        """
        prompt = f"""Help refine this hackathon project to fit within constraints:

**Original Idea:** {idea}
**Current Assessment:** {original_assessment}
**Constraints:** {constraints}

Provide a refined scope that:
1. Maintains the core value proposition
2. Fits within 24 hours
3. Is achievable with the team's skills
4. Has a clear demo path

Format as JSON:
{{
    "refined_idea": "Simplified version of the idea",
    "core_features": ["must-have 1", "must-have 2"],
    "deferred_features": ["nice-to-have 1", "nice-to-have 2"],
    "mvp_description": "What the minimum viable demo looks like",
    "demo_script": "How to demo this in 2 minutes",
    "updated_estimate": 16
}}"""
        
        return await self.client.generate_json(prompt, self.system_prompt)
