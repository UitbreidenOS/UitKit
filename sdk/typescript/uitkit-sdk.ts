/**
 * Claudient SDK — TypeScript Client Library
 * Type-safe, async/await support with retry logic, error handling, and timeouts
 * Version: 1.0.0
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ClientConfig {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  apiKey?: string;
}

export interface RetryOptions {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

export interface RequestOptions {
  timeout?: number;
  retryOptions?: Partial<RetryOptions>;
  headers?: Record<string, string>;
}

// Skill Types
export interface SkillMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author?: string;
  tags?: string[];
  installCommand?: string;
  lastUpdated?: string;
}

export interface SkillQuery {
  category?: string;
  tags?: string[];
  query?: string;
  limit?: number;
  offset?: number;
}

export interface SkillSearchResult {
  skills: SkillMetadata[];
  total: number;
  hasMore: boolean;
}

// Agent Types
export interface AgentDefinition {
  id: string;
  name: string;
  purpose: string;
  modelGuidance: string;
  tools?: string[];
  version: string;
  status: "active" | "deprecated" | "experimental";
  createdAt: string;
  updatedAt: string;
}

export interface AgentSpawnRequest {
  agentId: string;
  taskDescription: string;
  context?: Record<string, unknown>;
  timeout?: number;
}

export interface AgentSpawnResponse {
  spawnId: string;
  agentId: string;
  status: "spawned" | "running" | "completed" | "failed";
  result?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

// Plugin Types
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  category: string;
  assets: {
    skills?: number;
    commands?: number;
    hooks?: number;
    mcp?: number;
  };
  languages?: string[];
  certified?: boolean;
  status: "active" | "deprecated";
}

export interface PluginLoadRequest {
  pluginId: string;
  version?: string;
  force?: boolean;
}

export interface PluginLoadResponse {
  pluginId: string;
  version: string;
  loaded: boolean;
  assetsLoaded: {
    skills: number;
    commands: number;
    hooks: number;
    mcp: number;
  };
  warnings?: string[];
  errors?: string[];
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ClaudientError extends Error {
  constructor(
    message: string,
    public code: string = "CLAUDIENT_ERROR",
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ClaudientError";
    Object.setPrototypeOf(this, ClaudientError.prototype);
  }
}

export class TimeoutError extends ClaudientError {
  constructor(message: string, public timeout: number) {
    super(message, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class RetryExhaustedError extends ClaudientError {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message, "RETRY_EXHAUSTED");
    this.name = "RetryExhaustedError";
    Object.setPrototypeOf(this, RetryExhaustedError.prototype);
  }
}

export class NotFoundError extends ClaudientError {
  constructor(message: string, public resource: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends ClaudientError {
  constructor(message: string, public field: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// ============================================================================
// RETRY & TIMEOUT UTILITIES
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  context?: string
): Promise<T> {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      const isRetryable = isRetryableError(lastError);
      if (!isRetryable || attempt === config.maxRetries) {
        break;
      }

      const delayMs =
        config.delayMs * Math.pow(config.backoffMultiplier, attempt - 1);
      await sleep(delayMs);
    }
  }

  throw new RetryExhaustedError(
    `Failed after ${config.maxRetries} attempts${context ? ` (${context})` : ""}`,
    config.maxRetries,
    lastError
  );
}

function isRetryableError(err: Error): boolean {
  if (err instanceof TimeoutError) return true;
  const message = err.message.toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("econnrefused") ||
    message.includes("econnreset") ||
    message.includes("temporarily unavailable")
  );
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new TimeoutError("Request timeout", timeoutMs)),
        timeoutMs
      )
    ),
  ]);
}

// ============================================================================
// HTTP CLIENT
// ============================================================================

interface HttpClientOptions {
  timeout: number;
  maxRetries: number;
  retryDelayMs: number;
}

class HttpClient {
  private timeout: number;
  private retryConfig: RetryConfig;

  constructor(options: HttpClientOptions) {
    this.timeout = options.timeout;
    this.retryConfig = {
      maxRetries: options.maxRetries,
      delayMs: options.retryDelayMs,
      backoffMultiplier: 1.5,
    };
  }

  async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "GET",
      ...options,
    });
  }

  async post<T>(
    url: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  async put<T>(
    url: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  }

  async delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "DELETE",
      ...options,
    });
  }

  private async request<T>(
    url: string,
    options: RequestOptions & { method: string; body?: string }
  ): Promise<ApiResponse<T>> {
    const timeout = options.timeout ?? this.timeout;
    const retryOptions = options.retryOptions
      ? { ...this.retryConfig, ...options.retryOptions }
      : this.retryConfig;

    return withRetry(
      async () => {
        const fetchOptions: RequestInit = {
          method: options.method,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
        };

        if (options.body) {
          fetchOptions.body = options.body;
        }

        const response = await withTimeout(
          fetch(url, fetchOptions),
          timeout
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ClaudientError(
            errorData.message || `HTTP ${response.status}`,
            `HTTP_${response.status}`,
            response.status,
            errorData.details
          );
        }

        return response.json() as Promise<ApiResponse<T>>;
      },
      retryConfig,
      `${options.method} ${url}`
    );
  }
}

// ============================================================================
// SKILLS CLIENT
// ============================================================================

export class SkillsClient {
  private http: HttpClient;
  private baseUrl: string;

  constructor(baseUrl: string, httpClient: HttpClient) {
    this.baseUrl = baseUrl;
    this.http = httpClient;
  }

  /**
   * Search for skills with optional filters
   */
  async search(query: SkillQuery): Promise<SkillSearchResult> {
    const params = new URLSearchParams();
    if (query.category) params.append("category", query.category);
    if (query.query) params.append("q", query.query);
    if (query.limit) params.append("limit", String(query.limit));
    if (query.offset) params.append("offset", String(query.offset));
    if (query.tags?.length) params.append("tags", query.tags.join(","));

    const url = `${this.baseUrl}/skills/search?${params.toString()}`;
    const response = await this.http.get<SkillSearchResult>(url);

    if (!response.success || !response.data) {
      throw new ClaudientError(
        response.error?.message || "Failed to search skills",
        response.error?.code
      );
    }

    return response.data;
  }

  /**
   * Get a specific skill by ID
   */
  async get(skillId: string): Promise<SkillMetadata> {
    if (!skillId || skillId.trim() === "") {
      throw new ValidationError("Skill ID cannot be empty", "skillId");
    }

    const url = `${this.baseUrl}/skills/${skillId}`;
    const response = await this.http.get<SkillMetadata>(url);

    if (!response.success) {
      if (response.error?.code === "NOT_FOUND") {
        throw new NotFoundError(`Skill not found: ${skillId}`, "skill");
      }
      throw new ClaudientError(
        response.error?.message || "Failed to fetch skill",
        response.error?.code
      );
    }

    if (!response.data) {
      throw new ClaudientError("No skill data in response", "INVALID_RESPONSE");
    }

    return response.data;
  }

  /**
   * List all skills with pagination
   */
  async list(limit: number = 50, offset: number = 0): Promise<SkillSearchResult> {
    return this.search({ limit, offset });
  }

  /**
   * Get skills by category
   */
  async getByCategory(
    category: string,
    limit: number = 50
  ): Promise<SkillMetadata[]> {
    if (!category || category.trim() === "") {
      throw new ValidationError("Category cannot be empty", "category");
    }

    const result = await this.search({
      category,
      limit,
    });

    return result.skills;
  }

  /**
   * Get skills by tags
   */
  async getByTags(tags: string[], limit: number = 50): Promise<SkillMetadata[]> {
    if (!tags || tags.length === 0) {
      throw new ValidationError("Tags array cannot be empty", "tags");
    }

    const result = await this.search({
      tags,
      limit,
    });

    return result.skills;
  }

  /**
   * Validate a skill exists
   */
  async exists(skillId: string): Promise<boolean> {
    try {
      await this.get(skillId);
      return true;
    } catch (err) {
      if (err instanceof NotFoundError) {
        return false;
      }
      throw err;
    }
  }
}

// ============================================================================
// AGENTS CLIENT
// ============================================================================

export class AgentsClient {
  private http: HttpClient;
  private baseUrl: string;
  private spawnStatus: Map<string, AgentSpawnResponse> = new Map();

  constructor(baseUrl: string, httpClient: HttpClient) {
    this.baseUrl = baseUrl;
    this.http = httpClient;
  }

  /**
   * List all available agents
   */
  async list(): Promise<AgentDefinition[]> {
    const url = `${this.baseUrl}/agents`;
    const response = await this.http.get<AgentDefinition[]>(url);

    if (!response.success || !response.data) {
      throw new ClaudientError(
        response.error?.message || "Failed to list agents",
        response.error?.code
      );
    }

    return response.data;
  }

  /**
   * Get a specific agent by ID
   */
  async get(agentId: string): Promise<AgentDefinition> {
    if (!agentId || agentId.trim() === "") {
      throw new ValidationError("Agent ID cannot be empty", "agentId");
    }

    const url = `${this.baseUrl}/agents/${agentId}`;
    const response = await this.http.get<AgentDefinition>(url);

    if (!response.success) {
      if (response.error?.code === "NOT_FOUND") {
        throw new NotFoundError(`Agent not found: ${agentId}`, "agent");
      }
      throw new ClaudientError(
        response.error?.message || "Failed to fetch agent",
        response.error?.code
      );
    }

    if (!response.data) {
      throw new ClaudientError("No agent data in response", "INVALID_RESPONSE");
    }

    return response.data;
  }

  /**
   * Spawn a new agent instance with task
   */
  async spawn(request: AgentSpawnRequest): Promise<AgentSpawnResponse> {
    if (!request.agentId || request.agentId.trim() === "") {
      throw new ValidationError("Agent ID cannot be empty", "agentId");
    }

    if (
      !request.taskDescription ||
      request.taskDescription.trim() === ""
    ) {
      throw new ValidationError(
        "Task description cannot be empty",
        "taskDescription"
      );
    }

    const url = `${this.baseUrl}/agents/spawn`;
    const timeout = request.timeout ?? 300000; // 5 minutes default

    const response = await this.http.post<AgentSpawnResponse>(
      url,
      request,
      { timeout }
    );

    if (!response.success || !response.data) {
      throw new ClaudientError(
        response.error?.message || "Failed to spawn agent",
        response.error?.code
      );
    }

    const spawnResponse = response.data;
    this.spawnStatus.set(spawnResponse.spawnId, spawnResponse);

    return spawnResponse;
  }

  /**
   * Poll for agent spawn result with exponential backoff
   */
  async pollSpawnResult(
    spawnId: string,
    maxWaitMs: number = 300000
  ): Promise<AgentSpawnResponse> {
    if (!spawnId || spawnId.trim() === "") {
      throw new ValidationError("Spawn ID cannot be empty", "spawnId");
    }

    const pollIntervalMs = 1000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const url = `${this.baseUrl}/agents/spawn/${spawnId}`;
      const response = await this.http.get<AgentSpawnResponse>(url);

      if (!response.success) {
        throw new ClaudientError(
          response.error?.message || "Failed to poll spawn result",
          response.error?.code
        );
      }

      if (!response.data) {
        throw new ClaudientError(
          "No spawn data in response",
          "INVALID_RESPONSE"
        );
      }

      const spawnResponse = response.data;
      this.spawnStatus.set(spawnId, spawnResponse);

      if (
        spawnResponse.status === "completed" ||
        spawnResponse.status === "failed"
      ) {
        return spawnResponse;
      }

      await sleep(pollIntervalMs);
    }

    throw new TimeoutError(
      `Agent spawn did not complete within ${maxWaitMs}ms`,
      maxWaitMs
    );
  }

  /**
   * Spawn agent and wait for completion
   */
  async spawnAndWait(
    request: AgentSpawnRequest,
    pollTimeoutMs: number = 300000
  ): Promise<AgentSpawnResponse> {
    const spawnResponse = await this.spawn(request);

    if (
      spawnResponse.status === "completed" ||
      spawnResponse.status === "failed"
    ) {
      return spawnResponse;
    }

    return this.pollSpawnResult(spawnResponse.spawnId, pollTimeoutMs);
  }

  /**
   * Get cached spawn status
   */
  getSpawnStatus(spawnId: string): AgentSpawnResponse | undefined {
    return this.spawnStatus.get(spawnId);
  }

  /**
   * List agents by status
   */
  async getByStatus(
    status: "active" | "deprecated" | "experimental"
  ): Promise<AgentDefinition[]> {
    const agents = await this.list();
    return agents.filter((agent) => agent.status === status);
  }
}

// ============================================================================
// PLUGINS CLIENT
// ============================================================================

export class PluginsClient {
  private http: HttpClient;
  private baseUrl: string;
  private loadedPlugins: Map<string, PluginLoadResponse> = new Map();

  constructor(baseUrl: string, httpClient: HttpClient) {
    this.baseUrl = baseUrl;
    this.http = httpClient;
  }

  /**
   * List all available plugins
   */
  async list(): Promise<PluginManifest[]> {
    const url = `${this.baseUrl}/plugins`;
    const response = await this.http.get<PluginManifest[]>(url);

    if (!response.success || !response.data) {
      throw new ClaudientError(
        response.error?.message || "Failed to list plugins",
        response.error?.code
      );
    }

    return response.data;
  }

  /**
   * Get a specific plugin by ID
   */
  async get(pluginId: string): Promise<PluginManifest> {
    if (!pluginId || pluginId.trim() === "") {
      throw new ValidationError("Plugin ID cannot be empty", "pluginId");
    }

    const url = `${this.baseUrl}/plugins/${pluginId}`;
    const response = await this.http.get<PluginManifest>(url);

    if (!response.success) {
      if (response.error?.code === "NOT_FOUND") {
        throw new NotFoundError(`Plugin not found: ${pluginId}`, "plugin");
      }
      throw new ClaudientError(
        response.error?.message || "Failed to fetch plugin",
        response.error?.code
      );
    }

    if (!response.data) {
      throw new ClaudientError("No plugin data in response", "INVALID_RESPONSE");
    }

    return response.data;
  }

  /**
   * Load a plugin into the current session
   */
  async load(request: PluginLoadRequest): Promise<PluginLoadResponse> {
    if (!request.pluginId || request.pluginId.trim() === "") {
      throw new ValidationError("Plugin ID cannot be empty", "pluginId");
    }

    const url = `${this.baseUrl}/plugins/load`;
    const response = await this.http.post<PluginLoadResponse>(url, request);

    if (!response.success || !response.data) {
      throw new ClaudientError(
        response.error?.message || "Failed to load plugin",
        response.error?.code
      );
    }

    const loadResponse = response.data;

    if (loadResponse.errors && loadResponse.errors.length > 0) {
      const errorMessage = `Plugin load completed with errors: ${loadResponse.errors.join(", ")}`;
      if (loadResponse.loaded) {
        // Partial load — log warnings but continue
        console.warn(errorMessage);
      } else {
        throw new ClaudientError(errorMessage, "PLUGIN_LOAD_ERROR");
      }
    }

    this.loadedPlugins.set(request.pluginId, loadResponse);
    return loadResponse;
  }

  /**
   * Unload a plugin
   */
  async unload(pluginId: string): Promise<boolean> {
    if (!pluginId || pluginId.trim() === "") {
      throw new ValidationError("Plugin ID cannot be empty", "pluginId");
    }

    const url = `${this.baseUrl}/plugins/${pluginId}/unload`;
    const response = await this.http.post<{ unloaded: boolean }>(url, {});

    if (!response.success) {
      throw new ClaudientError(
        response.error?.message || "Failed to unload plugin",
        response.error?.code
      );
    }

    if (response.data?.unloaded) {
      this.loadedPlugins.delete(pluginId);
    }

    return response.data?.unloaded ?? false;
  }

  /**
   * Check if a plugin is loaded
   */
  isLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId);
  }

  /**
   * Get load status of a plugin
   */
  getLoadStatus(pluginId: string): PluginLoadResponse | undefined {
    return this.loadedPlugins.get(pluginId);
  }

  /**
   * List loaded plugins
   */
  getLoadedPlugins(): PluginLoadResponse[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * List plugins by category
   */
  async getByCategory(category: string): Promise<PluginManifest[]> {
    if (!category || category.trim() === "") {
      throw new ValidationError("Category cannot be empty", "category");
    }

    const plugins = await this.list();
    return plugins.filter((plugin) => plugin.category === category);
  }

  /**
   * List certified plugins
   */
  async getCertified(): Promise<PluginManifest[]> {
    const plugins = await this.list();
    return plugins.filter((plugin) => plugin.certified === true);
  }
}

// ============================================================================
// MAIN CLIENT
// ============================================================================

export class ClaudientClient {
  private config: Required<ClientConfig>;
  private http: HttpClient;
  public skills: SkillsClient;
  public agents: AgentsClient;
  public plugins: PluginsClient;

  constructor(config: ClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? "https://api.claudient.dev",
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
      apiKey: config.apiKey ?? process.env.CLAUDIENT_API_KEY ?? "",
    };

    this.http = new HttpClient({
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
      retryDelayMs: this.config.retryDelayMs,
    });

    this.skills = new SkillsClient(this.config.baseUrl, this.http);
    this.agents = new AgentsClient(this.config.baseUrl, this.http);
    this.plugins = new PluginsClient(this.config.baseUrl, this.http);
  }

  /**
   * Get client configuration
   */
  getConfig(): Readonly<Required<ClientConfig>> {
    return { ...this.config };
  }

  /**
   * Update client timeout (applies to new requests)
   */
  setTimeout(timeoutMs: number): void {
    if (timeoutMs <= 0) {
      throw new ValidationError("Timeout must be positive", "timeout");
    }
    this.config.timeout = timeoutMs;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const url = `${this.config.baseUrl}/health`;
      const response = await this.http.get<{ status: string }>(url);
      return response.success && response.data?.status === "ok";
    } catch (err) {
      return false;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ClaudientClient;

// Export factories for convenience
export function createClient(config?: ClientConfig): ClaudientClient {
  return new ClaudientClient(config);
}

export async function initializeClient(
  config?: ClientConfig
): Promise<ClaudientClient> {
  const client = new ClaudientClient(config);
  const healthy = await client.healthCheck();

  if (!healthy) {
    throw new ClaudientError(
      "Failed to connect to Claudient API",
      "CONNECTION_FAILED"
    );
  }

  return client;
}
