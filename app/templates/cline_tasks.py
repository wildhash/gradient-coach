"""
Cline tasks JSON formatter.
Formats tasks for AI coding assistants like Cline.
"""
from typing import List, Dict, Any
import json


def format_cline_tasks(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Format tasks into Cline-compatible JSON structure.
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        Formatted Cline tasks JSON
    """
    formatted_tasks = []
    
    for i, task in enumerate(tasks, 1):
        formatted_task = {
            "id": task.get("id", i),
            "title": task.get("title", f"Task {i}"),
            "description": task.get("description", ""),
            "type": task.get("type", "feature"),
            "status": task.get("status", "pending"),
            "priority": task.get("priority", "medium"),
            "estimatedTime": task.get("estimated_minutes", 30),
            "dependencies": task.get("dependencies", []),
            "files": task.get("files_to_modify", []),
            "acceptanceCriteria": task.get("acceptance_criteria", []),
            "hints": task.get("hints", [])
        }
        formatted_tasks.append(formatted_task)
    
    return {
        "version": "1.0",
        "project": {
            "name": "Hackathon Project",
            "description": "Auto-generated tasks for rapid development"
        },
        "tasks": formatted_tasks,
        "metadata": {
            "generatedBy": "Gradient Coach",
            "generatedAt": "auto",
            "totalTasks": len(formatted_tasks),
            "totalEstimatedTime": sum(t.get("estimatedTime", 0) for t in formatted_tasks)
        }
    }


def create_task(
    title: str,
    description: str,
    files: List[str] = None,
    estimated_minutes: int = 30,
    priority: str = "medium",
    dependencies: List[int] = None,
    acceptance_criteria: List[str] = None
) -> Dict[str, Any]:
    """
    Create a single task in Cline format.
    
    Args:
        title: Task title
        description: Detailed task description
        files: Files to be modified
        estimated_minutes: Estimated time in minutes
        priority: Task priority (low/medium/high)
        dependencies: Task IDs this depends on
        acceptance_criteria: List of criteria for completion
        
    Returns:
        Formatted task dictionary
    """
    return {
        "title": title,
        "description": description,
        "files_to_modify": files or [],
        "estimated_minutes": estimated_minutes,
        "priority": priority,
        "dependencies": dependencies or [],
        "acceptance_criteria": acceptance_criteria or [],
        "status": "pending",
        "type": "feature"
    }


def create_setup_task(tech_stack: str, files: List[str] = None) -> Dict[str, Any]:
    """Create a setup/initialization task."""
    return create_task(
        title="Project Setup and Configuration",
        description=f"""Initialize the project with {tech_stack}:
1. Create project structure
2. Install dependencies
3. Configure environment variables
4. Set up version control
5. Test basic setup""",
        files=files or ["package.json", "README.md", ".gitignore", ".env.example"],
        estimated_minutes=30,
        priority="high",
        acceptance_criteria=[
            "Project structure is created",
            "Dependencies install without errors",
            "Environment variables are documented",
            "Git repository is initialized"
        ]
    )


def create_feature_task(
    feature_name: str,
    description: str,
    files: List[str],
    estimated_minutes: int = 60,
    dependencies: List[int] = None
) -> Dict[str, Any]:
    """Create a feature implementation task."""
    return create_task(
        title=f"Implement {feature_name}",
        description=description,
        files=files,
        estimated_minutes=estimated_minutes,
        priority="high",
        dependencies=dependencies,
        acceptance_criteria=[
            f"{feature_name} is functional",
            "Code follows project conventions",
            "Basic error handling is included"
        ]
    )


def create_integration_task(
    service_name: str,
    files: List[str],
    dependencies: List[int] = None
) -> Dict[str, Any]:
    """Create an API/service integration task."""
    return create_task(
        title=f"Integrate {service_name}",
        description=f"""Integrate {service_name} into the application:
1. Set up API client/SDK
2. Add necessary environment variables
3. Create wrapper functions
4. Add error handling
5. Test integration""",
        files=files,
        estimated_minutes=45,
        priority="high",
        dependencies=dependencies,
        acceptance_criteria=[
            f"{service_name} is successfully integrated",
            "API calls work correctly",
            "Errors are handled gracefully",
            "Documentation is updated"
        ]
    )


def create_ui_task(
    component_name: str,
    files: List[str],
    estimated_minutes: int = 45,
    dependencies: List[int] = None
) -> Dict[str, Any]:
    """Create a UI component task."""
    return create_task(
        title=f"Build {component_name} UI",
        description=f"""Create the {component_name} user interface:
1. Design component layout
2. Implement HTML structure
3. Add CSS styling
4. Implement interactivity
5. Test responsiveness""",
        files=files,
        estimated_minutes=estimated_minutes,
        priority="medium",
        dependencies=dependencies,
        acceptance_criteria=[
            f"{component_name} displays correctly",
            "UI is responsive",
            "Interactive elements work",
            "Design matches requirements"
        ]
    )


def create_testing_task(dependencies: List[int]) -> Dict[str, Any]:
    """Create an end-to-end testing task."""
    return create_task(
        title="Testing and Bug Fixes",
        description="""Test the complete application and fix bugs:
1. Test all features end-to-end
2. Test edge cases
3. Fix discovered bugs
4. Verify error handling
5. Test on different browsers/devices""",
        files=["tests/", "README.md"],
        estimated_minutes=60,
        priority="high",
        dependencies=dependencies,
        acceptance_criteria=[
            "All features work as expected",
            "Major bugs are fixed",
            "Application is stable",
            "Demo scenario works flawlessly"
        ]
    )


def create_polish_task(dependencies: List[int]) -> Dict[str, Any]:
    """Create a polish and demo preparation task."""
    return create_task(
        title="Polish and Demo Preparation",
        description="""Finalize the project for demo:
1. Improve UI/UX polish
2. Add loading states
3. Improve error messages
4. Prepare demo data
5. Practice demo flow
6. Update README and documentation""",
        files=["README.md", "public/", "src/"],
        estimated_minutes=45,
        priority="medium",
        dependencies=dependencies,
        acceptance_criteria=[
            "UI is polished and professional",
            "Demo flow is smooth",
            "Documentation is complete",
            "Project is ready to present"
        ]
    )


def export_cline_json(tasks: List[Dict[str, Any]], filename: str = "cline-tasks.json") -> str:
    """
    Export tasks to Cline JSON format.
    
    Args:
        tasks: List of tasks
        filename: Output filename
        
    Returns:
        JSON string
    """
    formatted = format_cline_tasks(tasks)
    return json.dumps(formatted, indent=2)


__all__ = [
    "format_cline_tasks",
    "create_task",
    "create_setup_task",
    "create_feature_task",
    "create_integration_task",
    "create_ui_task",
    "create_testing_task",
    "create_polish_task",
    "export_cline_json"
]
