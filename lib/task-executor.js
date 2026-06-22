// task-executor.js — Execute individual tasks with type detection and routing
const { spawn, exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { EventEmitter } = require('events')

/**
 * Task Executor — Routes tasks to appropriate handlers (agents/scripts/CLI)
 * Collects execution metrics: tokens, time, success status, output
 */
class TaskExecutor extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = {
      agentBinary: options.agentBinary || 'claude',
      timeout: options.timeout || 300000, // 5 min default
      workdir: options.workdir || process.cwd(),
      verbose: options.verbose || false,
      ...options
    }
    this.metrics = {}
  }

  /**
   * Detect task type from task object, filename, or content
   * Returns: 'code' | 'test' | 'docs' | 'infra' | 'deploy' | 'unknown'
   */
  detectTaskType(task) {
    if (task.type) return task.type

    const content = task.content || task.description || ''
    const name = task.name || task.subject || ''

    // Test-like
    if (
      /test|spec|mock|jest|mocha|cypress|vitest/.test(content) ||
      /test|spec|\.test\.|\.spec\./.test(name)
    ) {
      return 'test'
    }

    // Docs-like
    if (
      /document|readme|guide|changelog|wiki|markdown|\.md$/.test(content) ||
      /doc|guide|readme|changelog/.test(name)
    ) {
      return 'docs'
    }

    // Infra-like
    if (
      /docker|kubernetes|terraform|cloudformation|ansible|helm|nginx|nginx/.test(
        content
      ) ||
      /infra|deploy\.yml|dockerfile|k8s/.test(name)
    ) {
      return 'infra'
    }

    // Deploy-like
    if (
      /deploy|release|ci\/cd|github actions|gitlab ci|jenkins|circleci/.test(
        content
      ) ||
      /deploy|release|ci|cd|workflow|action/.test(name)
    ) {
      return 'deploy'
    }

    // Code-like (default)
    if (
      /function|class|variable|bug|feature|refactor|implement|fix/.test(
        content
      ) ||
      /\.js$|\.ts$|\.py$|\.go$|\.rs$|src\//.test(name)
    ) {
      return 'code'
    }

    return 'unknown'
  }

  /**
   * Route task to appropriate executor based on type
   */
  async route(task) {
    const taskType = this.detectTaskType(task)
    this.emit('route', { taskType, task })

    switch (taskType) {
      case 'code':
        return this.executeCodeTask(task)
      case 'test':
        return this.executeTestTask(task)
      case 'docs':
        return this.executeDocsTask(task)
      case 'infra':
        return this.executeInfraTask(task)
      case 'deploy':
        return this.executeDeployTask(task)
      default:
        return this.executeGenericTask(task)
    }
  }

  /**
   * Execute code task — spawn Claude agent with task context
   */
  async executeCodeTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `code-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'code', task })

      const prompt = this._buildCodePrompt(task)
      const result = await this._spawnAgent(prompt, { ...task, taskId })

      const metrics = {
        type: 'code',
        duration: Date.now() - startTime,
        tokensUsed: result.tokens || 0,
        success: result.success || false,
        output: result.output,
        agentId: result.agentId
      }

      this.metrics[taskId] = metrics
      this.emit('complete', { taskId, metrics })
      return { ...result, metrics, taskId }
    } catch (error) {
      const metrics = {
        type: 'code',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Execute test task — run test suite/script
   */
  async executeTestTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `test-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'test', task })

      // Detect test command
      const testCmd = task.command || this._detectTestCommand(task)
      const result = await this._runCommand(testCmd, { cwd: this.options.workdir })

      const metrics = {
        type: 'test',
        duration: Date.now() - startTime,
        command: testCmd,
        success: result.exitCode === 0,
        output: result.output,
        stderr: result.stderr,
        testsPassed: this._parseTestCount(result.output, 'passed'),
        testsFailed: this._parseTestCount(result.output, 'failed')
      }

      this.metrics[taskId] = metrics
      this.emit('complete', { taskId, metrics })
      return { ...result, metrics, taskId }
    } catch (error) {
      const metrics = {
        type: 'test',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Execute docs task — spawn Claude agent for documentation
   */
  async executeDocsTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `docs-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'docs', task })

      const prompt = this._buildDocsPrompt(task)
      const result = await this._spawnAgent(prompt, { ...task, taskId })

      const metrics = {
        type: 'docs',
        duration: Date.now() - startTime,
        tokensUsed: result.tokens || 0,
        success: result.success || false,
        output: result.output,
        wordsGenerated: (result.output || '').split(/\s+/).length
      }

      this.metrics[taskId] = metrics
      this.emit('complete', { taskId, metrics })
      return { ...result, metrics, taskId }
    } catch (error) {
      const metrics = {
        type: 'docs',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Execute infra task — run infra scripts or spawn agent for planning
   */
  async executeInfraTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `infra-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'infra', task })

      // If there's a script, run it; otherwise spawn agent
      if (task.scriptPath && fs.existsSync(task.scriptPath)) {
        const result = await this._runCommand(`bash "${task.scriptPath}"`, {
          cwd: this.options.workdir
        })
        const metrics = {
          type: 'infra',
          duration: Date.now() - startTime,
          script: task.scriptPath,
          success: result.exitCode === 0,
          output: result.output,
          stderr: result.stderr
        }
        this.metrics[taskId] = metrics
        this.emit('complete', { taskId, metrics })
        return { ...result, metrics, taskId }
      } else {
        // Plan infra changes via agent
        const prompt = this._buildInfraPrompt(task)
        const result = await this._spawnAgent(prompt, { ...task, taskId })

        const metrics = {
          type: 'infra',
          duration: Date.now() - startTime,
          tokensUsed: result.tokens || 0,
          success: result.success || false,
          output: result.output
        }

        this.metrics[taskId] = metrics
        this.emit('complete', { taskId, metrics })
        return { ...result, metrics, taskId }
      }
    } catch (error) {
      const metrics = {
        type: 'infra',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Execute deploy task — run deployment script or CI/CD workflow
   */
  async executeDeployTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `deploy-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'deploy', task })

      // If there's a deploy script, run it
      if (task.scriptPath && fs.existsSync(task.scriptPath)) {
        const result = await this._runCommand(`bash "${task.scriptPath}"`, {
          cwd: this.options.workdir,
          timeout: this.options.timeout
        })

        const metrics = {
          type: 'deploy',
          duration: Date.now() - startTime,
          script: task.scriptPath,
          success: result.exitCode === 0,
          output: result.output,
          stderr: result.stderr,
          environment: task.environment || 'production'
        }

        this.metrics[taskId] = metrics
        this.emit('complete', { taskId, metrics })
        return { ...result, metrics, taskId }
      } else {
        // Plan deployment via agent
        const prompt = this._buildDeployPrompt(task)
        const result = await this._spawnAgent(prompt, { ...task, taskId })

        const metrics = {
          type: 'deploy',
          duration: Date.now() - startTime,
          tokensUsed: result.tokens || 0,
          success: result.success || false,
          output: result.output,
          environment: task.environment || 'production'
        }

        this.metrics[taskId] = metrics
        this.emit('complete', { taskId, metrics })
        return { ...result, metrics, taskId }
      }
    } catch (error) {
      const metrics = {
        type: 'deploy',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Execute generic task — fallback to agent spawn
   */
  async executeGenericTask(task) {
    const startTime = Date.now()
    const taskId = task.id || `generic-${Date.now()}`

    try {
      this.emit('start', { taskId, type: 'generic', task })

      const prompt = `Task: ${task.name || task.subject || 'Unknown'}\n\nDescription:\n${
        task.description || task.content || ''
      }`
      const result = await this._spawnAgent(prompt, { ...task, taskId })

      const metrics = {
        type: 'generic',
        duration: Date.now() - startTime,
        tokensUsed: result.tokens || 0,
        success: result.success || false,
        output: result.output
      }

      this.metrics[taskId] = metrics
      this.emit('complete', { taskId, metrics })
      return { ...result, metrics, taskId }
    } catch (error) {
      const metrics = {
        type: 'generic',
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        taskId
      }
      this.metrics[taskId] = metrics
      this.emit('error', { taskId, error, metrics })
      throw error
    }
  }

  /**
   * Build prompt for code tasks
   */
  _buildCodePrompt(task) {
    return `
You are tasked with implementing a code change. Execute the task carefully and provide working code.

Task: ${task.name || task.subject || 'Code Implementation'}

Description:
${task.description || task.content || ''}

${task.files ? `Files to modify:\n${task.files.map((f) => `- ${f}`).join('\n')}` : ''}

${task.requirements ? `Requirements:\n${task.requirements.split('\n').map((r) => `- ${r}`).join('\n')}` : ''}

Provide your implementation and explain the changes made.
`
  }

  /**
   * Build prompt for docs tasks
   */
  _buildDocsPrompt(task) {
    return `
You are tasked with writing documentation. Be clear, complete, and well-structured.

Task: ${task.name || task.subject || 'Documentation'}

Description:
${task.description || task.content || ''}

${task.outline ? `Outline:\n${task.outline}` : ''}

${task.audience ? `Target Audience: ${task.audience}` : ''}

Generate comprehensive documentation for this topic.
`
  }

  /**
   * Build prompt for infra tasks
   */
  _buildInfraPrompt(task) {
    return `
You are an infrastructure specialist. Plan and implement infrastructure changes carefully.

Task: ${task.name || task.subject || 'Infrastructure Change'}

Description:
${task.description || task.content || ''}

${task.targetPlatform ? `Platform: ${task.targetPlatform}` : ''}

${task.constraints ? `Constraints:\n${task.constraints}` : ''}

Provide a detailed plan including configuration files, deployment steps, and rollback procedures.
`
  }

  /**
   * Build prompt for deploy tasks
   */
  _buildDeployPrompt(task) {
    return `
You are a deployment engineer. Plan the deployment carefully with safety checks.

Task: ${task.name || task.subject || 'Deployment'}

Description:
${task.description || task.content || ''}

${task.environment ? `Environment: ${task.environment}` : ''}

${task.rollbackPlan ? `Rollback Plan Required: ${task.rollbackPlan}` : ''}

Provide deployment steps, validation checks, and monitoring points.
`
  }

  /**
   * Spawn Claude agent with task prompt
   */
  async _spawnAgent(prompt, context = {}) {
    return new Promise((resolve, reject) => {
      const agentProcess = spawn(this.options.agentBinary, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.options.timeout
      })

      let output = ''
      let stderr = ''

      agentProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      agentProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      agentProcess.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            output: output.trim(),
            exitCode: code,
            tokens: this._estimateTokens(output)
          })
        } else {
          reject(new Error(`Agent failed: ${stderr}`))
        }
      })

      agentProcess.on('error', (error) => {
        reject(error)
      })

      agentProcess.stdin.write(prompt)
      agentProcess.stdin.end()
    })
  }

  /**
   * Run shell command
   */
  async _runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const proc = exec(command, { ...options, timeout: options.timeout || this.options.timeout }, (error, stdout, stderr) => {
        if (error && error.code !== 0 && !options.ignoreError) {
          resolve({
            success: false,
            output: stdout || '',
            stderr: stderr || '',
            exitCode: error.code
          })
        } else {
          resolve({
            success: true,
            output: stdout || '',
            stderr: stderr || '',
            exitCode: 0
          })
        }
      })

      if (this.options.verbose) {
        proc.stdout?.on('data', (data) => console.log(data.toString()))
        proc.stderr?.on('data', (data) => console.error(data.toString()))
      }
    })
  }

  /**
   * Detect test command from package.json or common patterns
   */
  _detectTestCommand(task) {
    if (task.command) return task.command

    const pkgJsonPath = path.join(this.options.workdir, 'package.json')
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        if (pkg.scripts?.test) return pkg.scripts.test
      } catch (e) {
        // Fallback
      }
    }

    // Common fallbacks
    if (fs.existsSync(path.join(this.options.workdir, 'pytest.ini'))) {
      return 'pytest'
    }
    if (fs.existsSync(path.join(this.options.workdir, 'jest.config.js'))) {
      return 'npm test'
    }
    if (fs.existsSync(path.join(this.options.workdir, 'go.mod'))) {
      return 'go test ./...'
    }

    return 'npm test'
  }

  /**
   * Parse test output for pass/fail counts
   */
  _parseTestCount(output, type) {
    const patterns = {
      passed: [
        /(\d+)\s+passed/i,
        /(\d+)\s+tests? passed/i,
        /(\d+)✓/,
        /passing\s+(\d+)/i
      ],
      failed: [
        /(\d+)\s+failed/i,
        /(\d+)\s+tests? failed/i,
        /(\d+)✗/,
        /failing\s+(\d+)/i
      ]
    }

    const matches = patterns[type] || []
    for (const pattern of matches) {
      const match = output.match(pattern)
      if (match) return parseInt(match[1], 10)
    }
    return 0
  }

  /**
   * Rough token estimate (1 token ≈ 4 chars)
   */
  _estimateTokens(text) {
    return Math.ceil((text || '').length / 4)
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return this.metrics
  }

  /**
   * Get metrics for specific task
   */
  getTaskMetrics(taskId) {
    return this.metrics[taskId] || null
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics = {}
  }
}

module.exports = TaskExecutor
