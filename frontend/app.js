/**
 * Gradient Coach - Interactive Frontend
 * Connects to FastAPI backend and provides rich UI interactions
 */

// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : '';

// Global state
let currentData = {
    validation: null,
    scaffold: null,
    pitch: null
};

// ====================
// Navigation
// ====================

function navigateToSection(sectionId) {
    // Remove active class from all sections and nav links
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Add active class to target section and nav link
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        if (navLink) navLink.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Nav link click handlers
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        navigateToSection(section);
    });
});

// ====================
// Toast Notifications
// ====================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ====================
// Loading States
// ====================

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// ====================
// API Calls
// ====================

async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ====================
// Validate Section
// ====================

async function validateIdea() {
    const idea = document.getElementById('project-idea').value.trim();
    const experienceLevel = document.getElementById('experience-level').value;
    const featuresInput = document.getElementById('features').value.trim();
    const techPrefsInput = document.getElementById('tech-preferences').value.trim();
    
    if (!idea) {
        showToast('Please enter your project idea', 'error');
        return;
    }
    
    const features = featuresInput ? featuresInput.split(',').map(f => f.trim()) : null;
    const techPreferences = techPrefsInput ? techPrefsInput.split(',').map(t => t.trim()) : null;
    
    const button = event.target;
    setButtonLoading(button, true);
    showLoading();
    
    try {
        const result = await apiCall('/api/validate', 'POST', {
            idea,
            experience_level: experienceLevel,
            features,
            tech_preferences: techPreferences
        });
        
        currentData.validation = result;
        displayValidationResults(result);
        
        showToast('Idea validated successfully!', 'success');
    } catch (error) {
        showToast(`Validation failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(button, false);
        hideLoading();
    }
}

function displayValidationResults(data) {
    const resultsContainer = document.getElementById('validate-results');
    const feasibilityContent = document.getElementById('feasibility-content');
    const techStackContent = document.getElementById('tech-stack-content');
    
    const feasibility = data.feasibility;
    const techStack = data.tech_stack;
    
    // Feasibility Assessment
    const statusClass = feasibility.is_feasible ? 'status-feasible' : 'status-not-feasible';
    const riskClass = `risk-${feasibility.risk_level}`;
    
    feasibilityContent.innerHTML = `
        <div class="mb-2">
            <span class="status-badge ${statusClass}">
                ${feasibility.is_feasible ? '✅ Feasible' : '❌ Not Feasible'}
            </span>
            <span class="status-badge ${riskClass}">
                Risk: ${feasibility.risk_level.toUpperCase()}
            </span>
        </div>
        
        <div class="mb-2">
            <h4>Assessment Summary</h4>
            <p>${feasibility.assessment_summary}</p>
        </div>
        
        <div class="mb-2">
            <h4>Estimated Hours: ${feasibility.estimated_hours}</h4>
            <div class="tech-pills">
                ${Object.entries(feasibility.time_breakdown || {}).map(([phase, hours]) => 
                    `<span class="tech-pill">${phase}: ${hours}h</span>`
                ).join('')}
            </div>
        </div>
        
        ${feasibility.key_risks && feasibility.key_risks.length > 0 ? `
            <div class="mb-2">
                <h4>Key Risks</h4>
                <ul class="risk-list">
                    ${feasibility.key_risks.map(risk => `<li>${risk}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        ${feasibility.scope_recommendations && feasibility.scope_recommendations.length > 0 ? `
            <div class="mb-2">
                <h4>Recommendations</h4>
                <ul class="recommendation-list">
                    ${feasibility.scope_recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div class="mb-2">
            <h4>Confidence Score: ${feasibility.confidence_score}%</h4>
            <div style="width: 100%; background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="width: ${feasibility.confidence_score}%; background: var(--gradient-primary); height: 100%;"></div>
            </div>
        </div>
    `;
    
    // Tech Stack
    techStackContent.innerHTML = `
        ${techStack.frontend ? `
            <div class="mb-2">
                <h4>Frontend</h4>
                <p><strong>${techStack.frontend.framework}</strong></p>
                <p>${techStack.frontend.reasoning}</p>
                <div class="tech-pills">
                    ${techStack.frontend.key_libraries?.map(lib => `<span class="tech-pill">${lib}</span>`).join('') || ''}
                </div>
                <p class="mt-1"><small>Setup time: ${techStack.frontend.setup_time || 0}h</small></p>
            </div>
        ` : ''}
        
        ${techStack.backend ? `
            <div class="mb-2">
                <h4>Backend</h4>
                <p><strong>${techStack.backend.framework}</strong></p>
                <p>${techStack.backend.reasoning}</p>
                <div class="tech-pills">
                    ${techStack.backend.key_libraries?.map(lib => `<span class="tech-pill">${lib}</span>`).join('') || ''}
                </div>
                <p class="mt-1"><small>Setup time: ${techStack.backend.setup_time || 0}h</small></p>
            </div>
        ` : ''}
        
        ${techStack.database ? `
            <div class="mb-2">
                <h4>Database</h4>
                <p><strong>${techStack.database.type}</strong></p>
                <p>${techStack.database.reasoning}</p>
                <p class="mt-1"><small>Setup time: ${techStack.database.setup_time || 0}h</small></p>
            </div>
        ` : ''}
        
        ${techStack.hosting ? `
            <div class="mb-2">
                <h4>Hosting</h4>
                <p><strong>${techStack.hosting.platform}</strong></p>
                <p>${techStack.hosting.reasoning}</p>
            </div>
        ` : ''}
        
        <div class="mb-2">
            <h4>Total Setup Time: ${techStack.total_setup_hours || 'N/A'} hours</h4>
            <p>Learning Curve: <span class="tech-pill">${techStack.learning_curve || 'N/A'}</span></p>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function resetValidate() {
    document.getElementById('validate-results').style.display = 'none';
    document.getElementById('project-idea').value = '';
    document.getElementById('features').value = '';
    document.getElementById('tech-preferences').value = '';
}

function proceedToScaffold() {
    if (currentData.validation) {
        // Pre-fill scaffold form
        const idea = document.getElementById('project-idea').value;
        const features = document.getElementById('features').value;
        
        document.getElementById('scaffold-idea').value = idea;
        document.getElementById('scaffold-features').value = features;
    }
    navigateToSection('scaffold');
}

// ====================
// Scaffold Section
// ====================

async function generateScaffold() {
    const projectName = document.getElementById('scaffold-project-name').value.trim();
    const idea = document.getElementById('scaffold-idea').value.trim();
    const featuresInput = document.getElementById('scaffold-features').value.trim();
    
    if (!projectName || !idea) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    const features = featuresInput ? featuresInput.split(',').map(f => f.trim()) : [];
    const techStack = currentData.validation?.tech_stack || {
        frontend: { framework: "React", key_libraries: [] },
        backend: { framework: "FastAPI", key_libraries: [] }
    };
    
    const button = event.target;
    setButtonLoading(button, true);
    showLoading();
    
    try {
        const result = await apiCall('/api/scaffold', 'POST', {
            idea,
            tech_stack: techStack,
            features,
            project_name: projectName
        });
        
        currentData.scaffold = result;
        displayScaffoldResults(result);
        
        showToast('Scaffold generated successfully!', 'success');
    } catch (error) {
        showToast(`Scaffold generation failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(button, false);
        hideLoading();
    }
}

function displayScaffoldResults(data) {
    const resultsContainer = document.getElementById('scaffold-results');
    const architectureContent = document.getElementById('architecture-content');
    const filesContent = document.getElementById('files-content');
    const clineTasksContent = document.getElementById('cline-tasks-content');
    
    // Architecture
    const arch = data.architecture;
    architectureContent.innerHTML = `
        <div class="mb-2">
            <h4>Architecture Pattern: ${arch.architecture_pattern || 'N/A'}</h4>
            <p>${arch.data_flow || ''}</p>
        </div>
        
        ${arch.components && arch.components.length > 0 ? `
            <div class="mb-2">
                <h4>Components</h4>
                ${arch.components.map(comp => `
                    <div class="mb-1" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                        <h5>${comp.name}</h5>
                        <p>${comp.responsibility}</p>
                        <div class="tech-pills">
                            ${comp.technologies?.map(t => `<span class="tech-pill">${t}</span>`).join('') || ''}
                        </div>
                        <p class="mt-1"><small>Est. ${comp.estimated_hours || 0} hours</small></p>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        ${arch.api_endpoints && arch.api_endpoints.length > 0 ? `
            <div class="mb-2">
                <h4>API Endpoints</h4>
                <div class="code-block">
                    <pre>${arch.api_endpoints.map(ep => 
                        `${ep.method} ${ep.path} - ${ep.purpose}`
                    ).join('\n')}</pre>
                </div>
            </div>
        ` : ''}
    `;
    
    // Files
    const files = data.files || {};
    const fileEntries = Object.entries(files);
    
    filesContent.innerHTML = `
        <div class="file-tree">
            ${fileEntries.map(([path, content]) => `
                <div class="file-tree-item file" onclick="showFileContent('${path}', event)">
                    📄 ${path}
                </div>
            `).join('')}
        </div>
        
        <div id="file-viewer" class="mt-2" style="display: none;">
            <div class="code-block">
                <div class="code-block-header">
                    <span class="code-filename" id="current-filename"></span>
                    <button class="copy-button" onclick="copyFileContent()">Copy</button>
                </div>
                <pre id="file-content"></pre>
            </div>
        </div>
    `;
    
    // Cline Tasks
    const tasks = data.cline_tasks;
    clineTasksContent.innerHTML = `
        <div class="mb-2">
            <p>Total Tasks: ${tasks.tasks?.length || 0}</p>
            <p>Estimated Time: ${tasks.metadata?.totalEstimatedTime || 0} minutes</p>
        </div>
        
        <div class="code-block">
            <pre id="cline-json">${JSON.stringify(tasks, null, 2)}</pre>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function showFileContent(filepath, event) {
    event.stopPropagation();
    const files = currentData.scaffold?.files || {};
    const content = files[filepath] || '';
    
    document.getElementById('file-viewer').style.display = 'block';
    document.getElementById('current-filename').textContent = filepath;
    document.getElementById('file-content').textContent = content;
}

function copyFileContent() {
    const content = document.getElementById('file-content').textContent;
    copyToClipboard(content);
    showToast('File content copied!', 'success');
}

function copyClinetasks() {
    const content = document.getElementById('cline-json').textContent;
    copyToClipboard(content);
    showToast('Cline tasks copied!', 'success');
}

function downloadScaffoldFiles() {
    showToast('Download feature coming soon!', 'info');
    // TODO: Implement ZIP download
}

function proceedToPitch() {
    if (currentData.scaffold) {
        const idea = document.getElementById('scaffold-idea').value;
        const features = document.getElementById('scaffold-features').value;
        
        document.getElementById('pitch-idea').value = idea;
        document.getElementById('pitch-features').value = features;
    }
    navigateToSection('pitch');
}

// ====================
// Pitch Section
// ====================

async function generatePitch() {
    const idea = document.getElementById('pitch-idea').value.trim();
    const featuresInput = document.getElementById('pitch-features').value.trim();
    const audience = document.getElementById('pitch-audience').value;
    
    if (!idea) {
        showToast('Please enter your project idea', 'error');
        return;
    }
    
    const features = featuresInput ? featuresInput.split(',').map(f => f.trim()) : [];
    const techStack = currentData.validation?.tech_stack || {};
    
    const button = event.target;
    setButtonLoading(button, true);
    showLoading();
    
    try {
        const result = await apiCall('/api/pitch', 'POST', {
            idea,
            tech_stack: techStack,
            features,
            target_audience: audience
        });
        
        currentData.pitch = result;
        displayPitchResults(result);
        
        showToast('Pitch generated successfully!', 'success');
    } catch (error) {
        showToast(`Pitch generation failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(button, false);
        hideLoading();
    }
}

function displayPitchResults(data) {
    const resultsContainer = document.getElementById('pitch-results');
    const overviewContent = document.getElementById('pitch-overview-content');
    const demoScriptContent = document.getElementById('demo-script-content');
    const devpostContent = document.getElementById('devpost-content');
    
    const pitch = data.pitch;
    
    // Overview
    overviewContent.innerHTML = `
        <div class="mb-2">
            <h3>${pitch.project_name || 'Project Name'}</h3>
            <p class="text-secondary">${pitch.tagline || ''}</p>
        </div>
        
        <div class="mb-2">
            <h4>Elevator Pitch</h4>
            <p>${pitch.elevator_pitch || ''}</p>
        </div>
        
        ${pitch.key_talking_points && pitch.key_talking_points.length > 0 ? `
            <div class="mb-2">
                <h4>Key Talking Points</h4>
                <ul class="feature-list">
                    ${pitch.key_talking_points.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;
    
    // Demo Script
    if (pitch.demo_script) {
        const script = pitch.demo_script;
        demoScriptContent.innerHTML = `
            <div class="mb-2">
                ${Object.entries(script).map(([section, content]) => `
                    <div class="mb-2" style="padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 0.5rem;">
                        <h5 style="text-transform: capitalize;">${section}</h5>
                        <p>${content}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Devpost
    devpostContent.innerHTML = `
        <div class="code-block">
            <pre id="devpost-markdown">${pitch.devpost_markdown || JSON.stringify(pitch.devpost, null, 2)}</pre>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function copyDevpost() {
    const content = document.getElementById('devpost-markdown').textContent;
    copyToClipboard(content);
    showToast('Devpost content copied!', 'success');
}

// ====================
// Docs Oracle Section
// ====================

async function askOracle() {
    const question = document.getElementById('oracle-question').value.trim();
    const context = document.getElementById('oracle-context').value.trim();
    
    if (!question) {
        showToast('Please enter a question', 'error');
        return;
    }
    
    const button = event.target;
    setButtonLoading(button, true);
    showLoading();
    
    try {
        const result = await apiCall('/api/ask', 'POST', {
            question,
            context: context || null
        });
        
        displayOracleAnswer(result);
        showToast('Answer received!', 'success');
    } catch (error) {
        showToast(`Query failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(button, false);
        hideLoading();
    }
}

function displayOracleAnswer(data) {
    const resultsContainer = document.getElementById('oracle-results');
    const answerContent = document.getElementById('oracle-answer-content');
    
    answerContent.innerHTML = `
        <div class="mb-2">
            <h4>Question</h4>
            <p style="font-style: italic;">${data.question}</p>
        </div>
        
        <div class="mb-2">
            <h4>Answer</h4>
            <div style="white-space: pre-wrap;">${data.answer}</div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
}

function askExampleQuestion(question) {
    document.getElementById('oracle-question').value = question;
    askOracle();
}

// ====================
// Utility Functions
// ====================

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// ====================
// Initialize
// ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Gradient Coach initialized');
    
    // Check API health
    apiCall('/api/health')
        .then(data => {
            console.log('API Health:', data);
            if (data.gradient_ai !== 'ok') {
                showToast('Warning: Gradient AI not configured', 'info');
            }
        })
        .catch(error => {
            console.error('API health check failed:', error);
            showToast('Warning: Cannot connect to API', 'error');
        });
});
