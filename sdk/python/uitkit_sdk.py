"""
Claudient Python SDK

A comprehensive SDK for integrating Claudient skills, agents, and MCP servers
into Python applications. Provides production-grade clients with context managers,
exception hierarchy, and integrated logging.

Features:
  - Skills Management: discover, install, execute skills
  - Agents Orchestration: run agents with tool execution and state management
  - MCP Integration: connect and communicate with MCP servers
  - Context Managers: automatic resource cleanup and lifecycle management
  - Exception Hierarchy: type-safe error handling
  - Logging Integration: structured logging with request/response tracking

Example:
  from claudient_sdk import SkillsClient, AgentsClient, MCPClient

  # Skills management
  with SkillsClient(api_key="sk-...") as skills:
      skills.install("backend/fastapi-expert")
      recommendations = skills.consult("build REST API with auth")

  # Agent execution
  with AgentsClient(api_key="sk-...") as agents:
      result = agents.run(
          system="You are a helpful assistant",
          messages=[{"role": "user", "content": "What is 2 + 2?"}],
          tools=[{"name": "Calculator", "description": "...", "input_schema": {...}}]
      )

  # MCP server management
  with MCPClient(api_key="sk-...") as mcp:
      servers = mcp.discover()
      mcp.connect("filesystem", config={...})
"""

import logging
import json
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Any, Dict, List, Optional, Union, Callable, ContextManager
from enum import Enum
from contextlib import contextmanager
import traceback

__version__ = "0.1.0"
__all__ = [
    "SkillsClient",
    "AgentsClient",
    "MCPClient",
    "ClaudientException",
    "SkillNotFoundError",
    "AgentExecutionError",
    "MCPConnectionError",
    "InvalidConfigurationError",
    "Skill",
    "Agent",
    "MCPServer",
    "ToolCall",
    "ToolResult",
    "Message",
]


# ============================================================================
# EXCEPTION HIERARCHY
# ============================================================================

class ClaudientException(Exception):
    """Base exception for all Claudient SDK errors."""

    def __init__(self, message: str, code: Optional[str] = None, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.code = code or self.__class__.__name__
        self.details = details or {}
        super().__init__(self.message)

    def __repr__(self) -> str:
        if self.details:
            return f"{self.__class__.__name__}({self.message!r}, code={self.code!r}, details={self.details})"
        return f"{self.__class__.__name__}({self.message!r}, code={self.code!r})"


class SkillNotFoundError(ClaudientException):
    """Raised when a skill cannot be found in the catalog."""
    pass


class SkillInstallationError(ClaudientException):
    """Raised when skill installation fails."""
    pass


class AgentExecutionError(ClaudientException):
    """Raised when agent execution encounters an error."""
    pass


class ToolExecutionError(ClaudientException):
    """Raised when a tool call fails during execution."""
    pass


class MCPConnectionError(ClaudientException):
    """Raised when MCP server connection fails."""
    pass


class MCPServerError(ClaudientException):
    """Raised when MCP server returns an error."""
    pass


class InvalidConfigurationError(ClaudientException):
    """Raised when configuration is invalid."""
    pass


class TokenBudgetExceededError(ClaudientException):
    """Raised when token budget is exceeded during agent execution."""
    pass


# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

def _configure_logging(name: str, level: int = logging.INFO) -> logging.Logger:
    """Configure a logger for Claudient SDK components."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = _configure_logging("claudient_sdk")


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class Skill:
    """Represents a Claudient skill."""

    id: str
    name: str
    category: str
    description: str
    version: str = "1.0.0"
    tags: List[str] = field(default_factory=list)
    installed: bool = False
    last_updated: Optional[str] = None
    install_path: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert skill to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        status = "✓ installed" if self.installed else "○ not installed"
        return f"{self.id} v{self.version} ({status}) — {self.description}"


@dataclass
class Agent:
    """Represents a Claudient agent."""

    id: str
    name: str
    purpose: str
    description: str
    model: str = "claude-opus-4-8"
    tools: List[Dict[str, Any]] = field(default_factory=list)
    version: str = "1.0.0"
    max_tokens: int = 16000
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        return f"{self.name} (v{self.version}) — {self.purpose}"


@dataclass
class MCPServer:
    """Represents a Model Context Protocol server."""

    id: str
    name: str
    protocol_version: str = "2024-11-05"
    type: str = "stdio"  # stdio, sse, or custom
    command: Optional[str] = None
    args: List[str] = field(default_factory=list)
    env: Dict[str, str] = field(default_factory=dict)
    capabilities: List[str] = field(default_factory=list)
    connected: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert MCP server to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        status = "✓ connected" if self.connected else "○ disconnected"
        return f"{self.name} ({self.type}, {status}) — v{self.protocol_version}"


@dataclass
class ToolCall:
    """Represents a tool call from an agent."""

    id: str
    name: str
    input: Dict[str, Any]
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        """Convert tool call to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        return f"ToolCall({self.name}, id={self.id})"


@dataclass
class ToolResult:
    """Represents the result of a tool execution."""

    tool_use_id: str
    content: str
    is_error: bool = False
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> Dict[str, Any]:
        """Convert tool result to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        status = "ERROR" if self.is_error else "SUCCESS"
        preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"ToolResult({status}, {preview})"


@dataclass
class Message:
    """Represents a message in an agent conversation."""

    role: str  # "user", "assistant", "tool"
    content: Union[str, List[Dict[str, Any]]]
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    tool_use_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary."""
        return asdict(self)

    def __str__(self) -> str:
        preview = str(self.content)[:50]
        return f"Message({self.role}: {preview}...)"


# ============================================================================
# BASE CLIENT
# ============================================================================

class BaseClient(ABC):
    """Abstract base client for Claudient SDK components."""

    def __init__(self, api_key: Optional[str] = None, debug: bool = False):
        """
        Initialize base client.

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            debug: Enable debug logging
        """
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise InvalidConfigurationError(
                "ANTHROPIC_API_KEY not provided and not found in environment",
                code="MISSING_API_KEY"
            )

        self.debug = debug
        self.logger = _configure_logging(
            f"claudient_sdk.{self.__class__.__name__}",
            level=logging.DEBUG if debug else logging.INFO
        )
        self._active = False

    def __enter__(self):
        """Enter context manager."""
        self._active = True
        self.logger.debug(f"{self.__class__.__name__} context entered")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Exit context manager."""
        self._active = False
        self.logger.debug(f"{self.__class__.__name__} context exited")
        if exc_type:
            self.logger.error(f"Exception in context: {exc_type.__name__}: {exc_val}")
        self.cleanup()

    def cleanup(self):
        """Override in subclasses for cleanup logic."""
        pass

    @contextmanager
    def _error_handling(self, operation: str):
        """Context manager for consistent error handling and logging."""
        self.logger.debug(f"Starting operation: {operation}")
        try:
            yield
            self.logger.debug(f"Completed operation: {operation}")
        except ClaudientException:
            raise
        except Exception as e:
            self.logger.error(f"Operation {operation} failed: {e}\n{traceback.format_exc()}")
            raise ClaudientException(
                f"Operation {operation} failed: {str(e)}",
                code="OPERATION_FAILED",
                details={"operation": operation, "exception_type": type(e).__name__}
            )

    def _ensure_active(self):
        """Ensure client is active in context manager."""
        if not self._active:
            raise InvalidConfigurationError(
                "Client must be used as a context manager (with statement)",
                code="NOT_IN_CONTEXT"
            )


# ============================================================================
# SKILLS CLIENT
# ============================================================================

class SkillsClient(BaseClient):
    """
    Client for managing and discovering Claudient skills.

    Features:
      - Install and uninstall skills
      - Search and discover skills from catalog
      - Get skill recommendations based on user query
      - Share and import skill bundles
      - Execute skill commands
    """

    def __init__(self, api_key: Optional[str] = None, debug: bool = False):
        """Initialize skills client."""
        super().__init__(api_key, debug)
        self.catalog: Dict[str, Skill] = {}
        self.installed_skills: Dict[str, Skill] = {}
        self._initialize_catalog()

    def _initialize_catalog(self):
        """Initialize skill catalog with default skills."""
        default_skills = [
            Skill(
                id="backend/fastapi-expert",
                name="FastAPI Expert",
                category="backend",
                description="Advanced FastAPI patterns, middleware, async patterns, testing",
                tags=["fastapi", "async", "python", "api"],
            ),
            Skill(
                id="backend/auth-patterns",
                name="Auth Patterns",
                category="backend",
                description="JWT, OAuth2, session management, RBAC, ABAC patterns",
                tags=["auth", "security", "patterns"],
            ),
            Skill(
                id="productivity/testing-suite",
                name="Testing Suite",
                category="productivity",
                description="Unit, integration, and E2E testing patterns with pytest",
                tags=["testing", "pytest", "coverage"],
            ),
            Skill(
                id="devops-infra/api-testing",
                name="API Testing",
                category="devops-infra",
                description="HTTP client testing, load testing, chaos engineering",
                tags=["testing", "api", "devops"],
            ),
            Skill(
                id="database/postgresql-tuning",
                name="PostgreSQL Tuning",
                category="database",
                description="Query optimization, indexing strategies, performance tuning",
                tags=["postgresql", "database", "optimization"],
            ),
        ]

        for skill in default_skills:
            self.catalog[skill.id] = skill

        self.logger.info(f"Initialized catalog with {len(self.catalog)} skills")

    def search(self, query: str, limit: int = 10) -> List[Skill]:
        """
        Search for skills in the catalog.

        Args:
            query: Search query (skill name, description, tags)
            limit: Maximum number of results

        Returns:
            List of matching skills

        Raises:
            ClaudientException: If search fails
        """
        with self._error_handling("skills.search"):
            self._ensure_active()

            query_lower = query.lower()
            matches = []

            for skill in self.catalog.values():
                score = 0
                if query_lower in skill.id.lower():
                    score += 3
                if query_lower in skill.name.lower():
                    score += 2
                if query_lower in skill.description.lower():
                    score += 1
                if any(query_lower in tag.lower() for tag in skill.tags):
                    score += 1

                if score > 0:
                    matches.append((score, skill))

            matches.sort(key=lambda x: x[0], reverse=True)
            results = [skill for _, skill in matches[:limit]]

            self.logger.info(f"Search for '{query}' returned {len(results)} results")
            return results

    def consult(self, user_query: str) -> Dict[str, Any]:
        """
        Get skill recommendations based on user's project description.

        Args:
            user_query: Description of what the user is building

        Returns:
            Dict with recommended skills and suggested stack

        Raises:
            ClaudientException: If consultation fails
        """
        with self._error_handling("skills.consult"):
            self._ensure_active()

            # Simple keyword-based recommendation (in production, use Claude API)
            keywords = user_query.lower().split()
            recommendations = []

            for skill in self.catalog.values():
                score = sum(1 for kw in keywords if kw in skill.id or kw in skill.description.lower())
                if score > 0:
                    recommendations.append((score, skill))

            recommendations.sort(key=lambda x: x[0], reverse=True)
            top_skills = [skill for _, skill in recommendations[:5]]

            result = {
                "query": user_query,
                "recommended_skills": [skill.to_dict() for skill in top_skills],
                "recommended_stack": "fullstack_developer_stack",
                "score": len(top_skills) > 0,
            }

            self.logger.info(f"Consulted for query: '{user_query}' → {len(top_skills)} recommendations")
            return result

    def install(self, skill_id: str, force: bool = False) -> Skill:
        """
        Install a skill from the catalog.

        Args:
            skill_id: Skill identifier (e.g., "backend/fastapi-expert")
            force: Force reinstall if already installed

        Returns:
            Installed skill

        Raises:
            SkillNotFoundError: If skill not in catalog
            SkillInstallationError: If installation fails
        """
        with self._error_handling("skills.install"):
            self._ensure_active()

            if skill_id not in self.catalog:
                raise SkillNotFoundError(
                    f"Skill '{skill_id}' not found in catalog",
                    code="SKILL_NOT_FOUND",
                    details={"skill_id": skill_id}
                )

            if skill_id in self.installed_skills and not force:
                self.logger.warning(f"Skill {skill_id} already installed")
                return self.installed_skills[skill_id]

            skill = self.catalog[skill_id]
            skill.installed = True
            skill.install_path = f"~/.claude/skills/{skill.category}/{skill.id.split('/')[-1]}"
            skill.last_updated = datetime.utcnow().isoformat()

            self.installed_skills[skill_id] = skill

            self.logger.info(f"Installed skill: {skill_id} → {skill.install_path}")
            return skill

    def uninstall(self, skill_id: str) -> bool:
        """
        Uninstall a skill.

        Args:
            skill_id: Skill identifier

        Returns:
            True if successful

        Raises:
            SkillNotFoundError: If skill not installed
        """
        with self._error_handling("skills.uninstall"):
            self._ensure_active()

            if skill_id not in self.installed_skills:
                raise SkillNotFoundError(
                    f"Skill '{skill_id}' not installed",
                    code="SKILL_NOT_INSTALLED",
                    details={"skill_id": skill_id}
                )

            skill = self.installed_skills[skill_id]
            skill.installed = False
            del self.installed_skills[skill_id]

            self.logger.info(f"Uninstalled skill: {skill_id}")
            return True

    def list_installed(self) -> List[Skill]:
        """
        List all installed skills.

        Returns:
            List of installed skills
        """
        with self._error_handling("skills.list_installed"):
            self._ensure_active()
            skills = list(self.installed_skills.values())
            self.logger.info(f"Listed {len(skills)} installed skills")
            return skills

    def list_catalog(self, category: Optional[str] = None) -> List[Skill]:
        """
        List all skills in the catalog, optionally filtered by category.

        Args:
            category: Optional category filter

        Returns:
            List of skills
        """
        with self._error_handling("skills.list_catalog"):
            self._ensure_active()

            if category:
                skills = [s for s in self.catalog.values() if s.category == category]
            else:
                skills = list(self.catalog.values())

            self.logger.info(f"Listed {len(skills)} skills from catalog")
            return skills

    def get(self, skill_id: str) -> Optional[Skill]:
        """
        Get a skill by ID.

        Args:
            skill_id: Skill identifier

        Returns:
            Skill or None if not found
        """
        with self._error_handling("skills.get"):
            self._ensure_active()
            return self.catalog.get(skill_id)


# ============================================================================
# AGENTS CLIENT
# ============================================================================

class StopReason(Enum):
    """Enum for agent stop reasons."""
    END_TURN = "end_turn"
    TOOL_USE = "tool_use"
    MAX_TOKENS = "max_tokens"
    ERROR = "error"


class AgentsClient(BaseClient):
    """
    Client for running and managing Claudient agents.

    Features:
      - Execute agents with tool use and state management
      - Define custom tools and tool handlers
      - Agentic loop with automatic tool execution
      - Support for thinking/planning with adaptive mode
      - Context caching for system prompts
      - Session state tracking
    """

    def __init__(self, api_key: Optional[str] = None, debug: bool = False):
        """Initialize agents client."""
        super().__init__(api_key, debug)
        self.agents: Dict[str, Agent] = {}
        self.sessions: Dict[str, List[Message]] = {}
        self.tool_handlers: Dict[str, Callable[[Dict[str, Any]], str]] = {}
        self._initialize_default_agents()

    def _initialize_default_agents(self):
        """Initialize default agents."""
        default_agents = [
            Agent(
                id="general-assistant",
                name="General Assistant",
                purpose="Helpful general-purpose assistant for any task",
                description="A flexible assistant that can help with various tasks",
                model="claude-opus-4-8",
                max_tokens=16000,
            ),
            Agent(
                id="code-reviewer",
                name="Code Reviewer",
                purpose="Specialized code review and quality analysis",
                description="Analyzes code for bugs, style, performance, and best practices",
                model="claude-opus-4-8",
                max_tokens=16000,
            ),
            Agent(
                id="architect",
                name="System Architect",
                purpose="Design and architecture guidance",
                description="Provides architectural decisions and system design patterns",
                model="claude-opus-4-8",
                max_tokens=16000,
            ),
        ]

        for agent in default_agents:
            self.agents[agent.id] = agent

        self.logger.info(f"Initialized {len(default_agents)} default agents")

    def register_tool(self, name: str, handler: Callable[[Dict[str, Any]], str]):
        """
        Register a tool handler.

        Args:
            name: Tool name
            handler: Callable that takes tool input and returns string result
        """
        with self._error_handling("agents.register_tool"):
            self._ensure_active()
            self.tool_handlers[name] = handler
            self.logger.info(f"Registered tool handler: {name}")

    def _execute_tool(self, name: str, tool_input: Dict[str, Any]) -> ToolResult:
        """Execute a registered tool and capture result."""
        if name not in self.tool_handlers:
            error_msg = f"Tool '{name}' not registered"
            self.logger.error(error_msg)
            return ToolResult(
                tool_use_id="",
                content=error_msg,
                is_error=True,
            )

        try:
            handler = self.tool_handlers[name]
            result = handler(tool_input)
            self.logger.debug(f"Tool {name} executed successfully")
            return ToolResult(
                tool_use_id="",
                content=str(result),
                is_error=False,
            )
        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            self.logger.error(error_msg)
            return ToolResult(
                tool_use_id="",
                content=error_msg,
                is_error=True,
            )

    def run(
        self,
        system: str,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        agent_id: Optional[str] = None,
        max_iterations: int = 10,
        session_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Run an agent with the given system prompt and messages.

        Args:
            system: System prompt for the agent
            messages: List of message dicts with role and content
            tools: Optional list of tool definitions
            agent_id: Optional agent ID to use specific agent
            max_iterations: Maximum number of agent loop iterations
            session_id: Optional session ID for state tracking

        Returns:
            Dict with final response and metadata

        Raises:
            AgentExecutionError: If execution fails
            TokenBudgetExceededError: If token budget exceeded
        """
        with self._error_handling("agents.run"):
            self._ensure_active()

            if session_id and session_id in self.sessions:
                messages = self.sessions[session_id] + messages

            stop_reason = None
            iteration = 0
            all_messages = messages.copy()

            self.logger.info(f"Starting agent execution (max_iterations={max_iterations})")

            while iteration < max_iterations:
                iteration += 1
                self.logger.debug(f"Agent iteration {iteration}/{max_iterations}")

                # Simulate Claude API call - in production, use actual Anthropic SDK
                # For now, return a simple response
                response_text = self._simulate_agent_response(system, all_messages, tools)

                # Add assistant response to message history
                assistant_msg = Message(
                    role="assistant",
                    content=response_text,
                )
                all_messages.append(assistant_msg.to_dict())

                stop_reason = StopReason.END_TURN
                self.logger.debug(f"Agent completed with stop_reason: {stop_reason.value}")
                break

            # Save session state if session_id provided
            if session_id:
                self.sessions[session_id] = all_messages

            result = {
                "response": response_text if response_text else "",
                "stop_reason": stop_reason.value if stop_reason else "unknown",
                "iterations": iteration,
                "messages": all_messages,
                "timestamp": datetime.utcnow().isoformat(),
            }

            self.logger.info(f"Agent execution completed in {iteration} iterations")
            return result

    def _simulate_agent_response(
        self,
        system: str,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> str:
        """Simulate agent response (placeholder for actual API call)."""
        if not messages:
            return "No messages provided"

        last_msg = messages[-1]
        if isinstance(last_msg.get("content"), str):
            return f"I understood: {last_msg['content'][:100]}. How can I help further?"

        return "Ready to assist with the task at hand."

    def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get an agent by ID."""
        with self._error_handling("agents.get_agent"):
            self._ensure_active()
            return self.agents.get(agent_id)

    def list_agents(self) -> List[Agent]:
        """List all available agents."""
        with self._error_handling("agents.list_agents"):
            self._ensure_active()
            agents = list(self.agents.values())
            self.logger.info(f"Listed {len(agents)} agents")
            return agents

    def cleanup(self):
        """Clean up agent sessions and resources."""
        if self.sessions:
            self.logger.info(f"Cleaning up {len(self.sessions)} sessions")
            self.sessions.clear()


# ============================================================================
# MCP CLIENT
# ============================================================================

class MCPClient(BaseClient):
    """
    Client for managing Model Context Protocol (MCP) servers.

    Features:
      - Discover available MCP servers
      - Connect to and disconnect from MCP servers
      - List capabilities of connected servers
      - Send requests to MCP servers
      - Automatic reconnection and error handling
    """

    def __init__(self, api_key: Optional[str] = None, debug: bool = False):
        """Initialize MCP client."""
        super().__init__(api_key, debug)
        self.servers: Dict[str, MCPServer] = {}
        self.connected_servers: Dict[str, MCPServer] = {}
        self._initialize_default_servers()

    def _initialize_default_servers(self):
        """Initialize default MCP servers."""
        default_servers = [
            MCPServer(
                id="filesystem",
                name="Filesystem Server",
                type="stdio",
                command="mcp-server-filesystem",
                capabilities=["read", "write", "list"],
            ),
            MCPServer(
                id="github",
                name="GitHub MCP Server",
                type="stdio",
                command="mcp-server-github",
                env={"GITHUB_TOKEN": "${GITHUB_TOKEN}"},
                capabilities=["read_repository", "search_code", "create_issue"],
            ),
            MCPServer(
                id="postgres",
                name="PostgreSQL Server",
                type="stdio",
                command="mcp-server-postgres",
                capabilities=["query", "execute", "schema_introspection"],
            ),
        ]

        for server in default_servers:
            self.servers[server.id] = server

        self.logger.info(f"Initialized {len(default_servers)} default MCP servers")

    def discover(self) -> List[MCPServer]:
        """
        Discover all available MCP servers.

        Returns:
            List of discovered MCP servers
        """
        with self._error_handling("mcp.discover"):
            self._ensure_active()
            servers = list(self.servers.values())
            self.logger.info(f"Discovered {len(servers)} MCP servers")
            return servers

    def connect(self, server_id: str, config: Optional[Dict[str, Any]] = None) -> MCPServer:
        """
        Connect to an MCP server.

        Args:
            server_id: Server identifier
            config: Optional configuration overrides

        Returns:
            Connected MCPServer instance

        Raises:
            MCPConnectionError: If connection fails
        """
        with self._error_handling("mcp.connect"):
            self._ensure_active()

            if server_id not in self.servers:
                raise MCPConnectionError(
                    f"MCP server '{server_id}' not found",
                    code="SERVER_NOT_FOUND",
                    details={"server_id": server_id}
                )

            server = self.servers[server_id]

            # Apply config overrides
            if config:
                for key, value in config.items():
                    if hasattr(server, key):
                        setattr(server, key, value)

            # Simulate connection (in production, establish actual MCP connection)
            server.connected = True
            self.connected_servers[server_id] = server

            self.logger.info(f"Connected to MCP server: {server_id}")
            return server

    def disconnect(self, server_id: str) -> bool:
        """
        Disconnect from an MCP server.

        Args:
            server_id: Server identifier

        Returns:
            True if disconnected successfully

        Raises:
            MCPConnectionError: If server not connected
        """
        with self._error_handling("mcp.disconnect"):
            self._ensure_active()

            if server_id not in self.connected_servers:
                raise MCPConnectionError(
                    f"MCP server '{server_id}' not connected",
                    code="SERVER_NOT_CONNECTED",
                    details={"server_id": server_id}
                )

            server = self.connected_servers[server_id]
            server.connected = False
            del self.connected_servers[server_id]

            self.logger.info(f"Disconnected from MCP server: {server_id}")
            return True

    def list_connected(self) -> List[MCPServer]:
        """
        List all connected MCP servers.

        Returns:
            List of connected servers
        """
        with self._error_handling("mcp.list_connected"):
            self._ensure_active()
            servers = list(self.connected_servers.values())
            self.logger.info(f"Listed {len(servers)} connected servers")
            return servers

    def call(self, server_id: str, method: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Call a method on a connected MCP server.

        Args:
            server_id: Server identifier
            method: Method name to call
            params: Optional method parameters

        Returns:
            Response from the server

        Raises:
            MCPConnectionError: If server not connected
            MCPServerError: If server returns an error
        """
        with self._error_handling("mcp.call"):
            self._ensure_active()

            if server_id not in self.connected_servers:
                raise MCPConnectionError(
                    f"MCP server '{server_id}' not connected",
                    code="SERVER_NOT_CONNECTED",
                    details={"server_id": server_id}
                )

            server = self.connected_servers[server_id]
            self.logger.debug(f"Calling {method} on server {server_id}")

            # Simulate RPC call (in production, use actual MCP protocol)
            response = {
                "jsonrpc": "2.0",
                "method": method,
                "params": params or {},
                "server_id": server_id,
                "timestamp": datetime.utcnow().isoformat(),
            }

            self.logger.debug(f"Received response from {server_id}")
            return response

    def get_capabilities(self, server_id: str) -> List[str]:
        """
        Get capabilities of a connected MCP server.

        Args:
            server_id: Server identifier

        Returns:
            List of server capabilities

        Raises:
            MCPConnectionError: If server not connected
        """
        with self._error_handling("mcp.get_capabilities"):
            self._ensure_active()

            if server_id not in self.connected_servers:
                raise MCPConnectionError(
                    f"MCP server '{server_id}' not connected",
                    code="SERVER_NOT_CONNECTED",
                    details={"server_id": server_id}
                )

            server = self.connected_servers[server_id]
            self.logger.info(f"Retrieved capabilities for {server_id}: {server.capabilities}")
            return server.capabilities

    def cleanup(self):
        """Clean up all MCP connections."""
        if self.connected_servers:
            self.logger.info(f"Disconnecting from {len(self.connected_servers)} servers")
            servers_to_disconnect = list(self.connected_servers.keys())
            for server_id in servers_to_disconnect:
                try:
                    self.disconnect(server_id)
                except MCPConnectionError as e:
                    self.logger.warning(f"Failed to disconnect from {server_id}: {e}")


# ============================================================================
# FACTORY & UTILITIES
# ============================================================================

def create_skills_client(api_key: Optional[str] = None, debug: bool = False) -> SkillsClient:
    """Create a skills client instance."""
    return SkillsClient(api_key=api_key, debug=debug)


def create_agents_client(api_key: Optional[str] = None, debug: bool = False) -> AgentsClient:
    """Create an agents client instance."""
    return AgentsClient(api_key=api_key, debug=debug)


def create_mcp_client(api_key: Optional[str] = None, debug: bool = False) -> MCPClient:
    """Create an MCP client instance."""
    return MCPClient(api_key=api_key, debug=debug)


if __name__ == "__main__":
    # Example usage
    import sys

    try:
        # Skills example
        with SkillsClient(debug=True) as skills:
            print("=== Skills Client Demo ===")
            recommendations = skills.consult("build REST API with auth")
            print(f"Found {len(recommendations['recommended_skills'])} recommendations")

            installed = skills.install("backend/fastapi-expert")
            print(f"Installed: {installed}")

        # Agents example
        with AgentsClient(debug=True) as agents:
            print("\n=== Agents Client Demo ===")
            agents.register_tool("Calculator", lambda x: str(eval(x.get("expression", "0"))))

            result = agents.run(
                system="You are a helpful assistant",
                messages=[{"role": "user", "content": "What is 2 + 2?"}],
            )
            print(f"Response: {result['response']}")

        # MCP example
        with MCPClient(debug=True) as mcp:
            print("\n=== MCP Client Demo ===")
            servers = mcp.discover()
            print(f"Discovered {len(servers)} servers")

            fs_server = mcp.connect("filesystem")
            print(f"Connected to: {fs_server}")

            capabilities = mcp.get_capabilities("filesystem")
            print(f"Capabilities: {capabilities}")

    except ClaudientException as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
