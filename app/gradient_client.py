"""
Gradient AI API client wrapper for making LLM calls.
This replaces the Anthropic SDK with direct HTTP calls to Gradient AI.
"""
import os
import httpx
import json
from typing import Optional, Dict, Any, List


class GradientAIClient:
    """Client for interacting with DigitalOcean's Gradient AI API."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        """
        Initialize the Gradient AI client.
        
        Args:
            api_key: API key for Gradient AI. Falls back to GRADIENT_AI_API_KEY env var.
            base_url: Base URL for Gradient AI API. Falls back to GRADIENT_AI_BASE_URL env var.
        """
        self.api_key = api_key or os.getenv("GRADIENT_AI_API_KEY") or os.getenv("ANTHROPIC_API_KEY", "")
        self.base_url = base_url or os.getenv("GRADIENT_AI_BASE_URL", "https://api.anthropic.com")
        self.model = "claude-3-5-sonnet-20241022"
        
        if not self.api_key:
            raise ValueError("API key is required. Set GRADIENT_AI_API_KEY or ANTHROPIC_API_KEY environment variable.")
    
    async def generate_completion(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7
    ) -> str:
        """
        Generate a text completion using Gradient AI.
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt to guide the model
            max_tokens: Maximum tokens to generate
            temperature: Temperature for response randomness (0-1)
            
        Returns:
            Generated text completion
        """
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/v1/messages",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                
                # Extract text from response
                if "content" in data and len(data["content"]) > 0:
                    content = data["content"][0]
                    if content.get("type") == "text":
                        return content.get("text", "")
                
                raise ValueError("Unexpected response format from Gradient AI")
                
            except httpx.HTTPStatusError as e:
                raise Exception(f"Gradient AI API error: {e.response.status_code} - {e.response.text}")
            except Exception as e:
                raise Exception(f"Failed to generate completion: {str(e)}")
    
    async def generate_json(
        self,
        prompt: str,
        system_prompt: str,
        max_tokens: int = 4096,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Generate a JSON response using Gradient AI.
        
        Args:
            prompt: The user prompt
            system_prompt: System prompt to guide the model
            max_tokens: Maximum tokens to generate
            temperature: Temperature for response randomness
            
        Returns:
            Parsed JSON response
        """
        full_prompt = f"{prompt}\n\nRespond with valid JSON only. Do not include any markdown formatting or explanations."
        
        response_text = await self.generate_completion(
            full_prompt,
            system_prompt,
            max_tokens,
            temperature
        )
        
        # Extract JSON from markdown code blocks if present
        json_text = response_text.strip()
        
        # Try to extract from ```json code blocks
        if "```json" in json_text:
            start = json_text.find("```json") + 7
            end = json_text.find("```", start)
            if end > start:
                json_text = json_text[start:end].strip()
        # Try to extract from ``` code blocks
        elif "```" in json_text:
            start = json_text.find("```") + 3
            end = json_text.find("```", start)
            if end > start:
                json_text = json_text[start:end].strip()
        
        try:
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse JSON response: {str(e)}\n\nResponse: {response_text}")
    
    async def generate_streaming(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7
    ):
        """
        Generate a streaming text completion using Gradient AI.
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens to generate
            temperature: Temperature for response randomness
            
        Yields:
            Text chunks as they are generated
        """
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": True,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/v1/messages",
                    headers=headers,
                    json=payload
                ) as response:
                    response.raise_for_status()
                    
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str.strip() == "[DONE]":
                                break
                            
                            try:
                                data = json.loads(data_str)
                                if data.get("type") == "content_block_delta":
                                    delta = data.get("delta", {})
                                    if delta.get("type") == "text_delta":
                                        text = delta.get("text", "")
                                        if text:
                                            yield text
                            except json.JSONDecodeError:
                                continue
                                
            except httpx.HTTPStatusError as e:
                raise Exception(f"Gradient AI API error: {e.response.status_code}")
            except Exception as e:
                raise Exception(f"Failed to generate streaming completion: {str(e)}")
