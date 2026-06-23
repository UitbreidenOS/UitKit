/**
 * Skill Composition Tests
 */

const composer = require('./skill-composition');

describe('Skill Composition', () => {
  describe('Builder', () => {
    test('should create builder instance', () => {
      const builder = composer.createBuilder();
      expect(builder).toBeDefined();
      expect(builder.nodes).toEqual([]);
      expect(builder.edges).toEqual([]);
    });

    test('should add skill node', () => {
      const builder = composer.createBuilder();
      const skillId = builder.addSkill('processData', async (data) => {
        return { ...data, processed: true };
      });

      expect(skillId).toBeDefined();
      expect(builder.nodes.length).toBe(1);
      expect(builder.nodes[0].name).toBe('processData');
      expect(builder.nodes[0].type).toBe(composer.NODE_TYPES.SKILL);
    });

    test('should add conditional node', () => {
      const builder = composer.createBuilder();
      const condId = builder.addConditional(
        composer.CONTROL_FLOW.IF,
        (data) => data.value > 10
      );

      expect(builder.nodes.length).toBe(1);
      expect(builder.nodes[0].type).toBe(composer.NODE_TYPES.CONDITIONAL);
      expect(builder.nodes[0].controlFlow).toBe(composer.CONTROL_FLOW.IF);
    });

    test('should add loop node', () => {
      const builder = composer.createBuilder();
      const loopId = builder.addLoop(composer.CONTROL_FLOW.FOR, { condition: 5 });

      expect(builder.nodes.length).toBe(1);
      expect(builder.nodes[0].type).toBe(composer.NODE_TYPES.LOOP);
      expect(builder.nodes[0].loopType).toBe(composer.CONTROL_FLOW.FOR);
    });

    test('should add parallel node', () => {
      const builder = composer.createBuilder();
      const parallelId = builder.addParallel({ limit: 10 });

      expect(builder.nodes.length).toBe(1);
      expect(builder.nodes[0].type).toBe(composer.NODE_TYPES.PARALLEL);
      expect(builder.nodes[0].limit).toBe(10);
    });

    test('should add error handler node', () => {
      const builder = composer.createBuilder();
      const errorId = builder.addErrorHandler(async (error) => {
        return { recovered: true };
      });

      expect(builder.nodes.length).toBe(1);
      expect(builder.nodes[0].type).toBe(composer.NODE_TYPES.ERROR_HANDLER);
    });

    test('should connect nodes', () => {
      const builder = composer.createBuilder();
      const skill1 = builder.addSkill('step1', async (data) => data);
      const skill2 = builder.addSkill('step2', async (data) => data);

      builder.connect(skill1, skill2, { label: 'success' });

      expect(builder.edges.length).toBe(1);
      expect(builder.edges[0].from).toBe(skill1);
      expect(builder.edges[0].to).toBe(skill2);
    });

    test('should build workflow', () => {
      const builder = composer.createBuilder();
      builder.addSkill('step1', async (data) => data);
      const workflow = builder.build('testWorkflow');

      expect(workflow.id).toBe('testWorkflow');
      expect(workflow.nodes.length).toBe(1);
      expect(workflow.sortedNodes).toBeDefined();
    });

    test('should reject invalid workflow', () => {
      const builder = composer.createBuilder({ timeout: 1000 });
      builder.addConditional(composer.CONTROL_FLOW.INVALID);
      builder.nodes.pop();
      builder.addConditional('invalid', () => true);

      expect(() => builder.build()).toThrow();
    });

    test('should clear builder', () => {
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      builder.clear();

      expect(builder.nodes.length).toBe(0);
      expect(builder.edges.length).toBe(0);
    });
  });

  describe('Workflow Execution', () => {
    test('should execute simple skill workflow', async () => {
      const builder = composer.createBuilder();
      builder.addSkill('double', async (data) => data * 2);
      const workflow = builder.build();

      const result = await composer.executeWorkflow(workflow, 5);

      expect(result.status).toBe('completed');
      expect(result.output).toBe(10);
    });

    test('should execute skill chain', async () => {
      const builder = composer.createBuilder();
      const skill1 = builder.addSkill('add', async (data) => data + 10);
      const skill2 = builder.addSkill('multiply', async (data) => data * 2);

      builder.connect(skill1, skill2);
      const workflow = builder.build();

      const result = await composer.executeWorkflow(workflow, 5);

      expect(result.status).toBe('completed');
      expect(result.output).toBe(30); // (5 + 10) * 2
    });

    test('should handle skill errors', async () => {
      const builder = composer.createBuilder();
      builder.addSkill('failing', async () => {
        throw new Error('Intentional failure');
      });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.status).toBe('failed');
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should retry on error', async () => {
      let attempts = 0;
      const builder = composer.createBuilder();
      builder.addSkill(
        'retry-task',
        async () => {
          attempts++;
          if (attempts < 3) throw new Error('Try again');
          return 'success';
        },
        { retries: 3, errorStrategy: composer.ERROR_STRATEGIES.RETRY }
      );

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.status).toBe('completed');
      expect(attempts).toBe(3);
    });

    test('should use fallback on error', async () => {
      const builder = composer.createBuilder();
      builder.addSkill(
        'failing',
        async () => {
          throw new Error('Failed');
        },
        {
          fallback: async () => 'fallback value',
          errorStrategy: composer.ERROR_STRATEGIES.FALLBACK,
        }
      );

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.status).toBe('completed');
      expect(result.output).toBe('fallback value');
    });

    test('should pass context variables', async () => {
      const builder = composer.createBuilder();
      builder.addSkill('useVar', async (data, vars) => {
        return { data, varValue: vars.multiplier };
      });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, { input: 5 }, {
        variables: { multiplier: 10 },
      });

      expect(result.output.varValue).toBe(10);
    });

    test('should track execution metrics', async () => {
      const builder = composer.createBuilder();
      builder.addSkill('task', async (data) => data);
      const workflow = builder.build();

      const result = await composer.executeWorkflow(workflow, {});

      expect(result.metrics.totalDuration).toBeGreaterThanOrEqual(0);
      expect(result.metrics.stepCount).toBe(1);
      expect(result.metrics.errorCount).toBe(0);
    });
  });

  describe('Conditional Execution', () => {
    test('should evaluate IF condition', async () => {
      const builder = composer.createBuilder();
      const cond = builder.addConditional(
        composer.CONTROL_FLOW.IF,
        (data) => data.value > 10
      );

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, { value: 15 });

      expect(result.status).toBe('completed');
    });

    test('should evaluate SWITCH condition', async () => {
      const builder = composer.createBuilder();
      builder.addConditional(composer.CONTROL_FLOW.SWITCH, null, {
        branches: {
          'data.type === "A"': 'branchA',
          'data.type === "B"': 'branchB',
        },
        defaultBranch: 'default',
      });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, { type: 'A' });

      expect(result.status).toBe('completed');
    });
  });

  describe('Loop Execution', () => {
    test('should execute FOR loop', async () => {
      const builder = composer.createBuilder();
      builder.addLoop(composer.CONTROL_FLOW.FOR, { condition: 5 });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, []);

      expect(result.status).toBe('completed');
      expect(result.output.iterations).toBe(5);
    });

    test('should execute FOREACH loop', async () => {
      const builder = composer.createBuilder();
      builder.addLoop(composer.CONTROL_FLOW.FOREACH, {
        iterator: 'items',
        variable: 'item',
      });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, { items: [1, 2, 3] });

      expect(result.status).toBe('completed');
      expect(result.output.iterations).toBe(3);
    });

    test('should respect max iterations', async () => {
      const builder = composer.createBuilder();
      builder.addLoop(composer.CONTROL_FLOW.WHILE, {
        condition: () => true,
        maxIterations: 100,
      });

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.output.iterations).toBeLessThanOrEqual(100);
    });
  });

  describe('Template Storage', () => {
    test('should save workflow as template', () => {
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const templateId = composer.TemplateStorage.saveTemplate(
        'myTemplate',
        workflow,
        { tags: ['test', 'basic'] }
      );

      expect(templateId).toBeDefined();
      expect(composer.TemplateStorage.templates.size).toBe(1);
    });

    test('should load template', () => {
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const templateId = composer.TemplateStorage.saveTemplate('test', workflow);
      const loaded = composer.TemplateStorage.loadTemplate(templateId);

      expect(loaded.name).toBe('test');
      expect(loaded.workflow).toBeDefined();
    });

    test('should list templates', () => {
      composer.TemplateStorage.clear();
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      composer.TemplateStorage.saveTemplate('tmpl1', workflow, { tags: ['tag1'] });
      composer.TemplateStorage.saveTemplate('tmpl2', workflow, { tags: ['tag2'] });

      const list = composer.TemplateStorage.listTemplates();
      expect(list.length).toBe(2);
    });

    test('should filter templates by tag', () => {
      composer.TemplateStorage.clear();
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      composer.TemplateStorage.saveTemplate('tmpl1', workflow, { tags: ['production'] });
      composer.TemplateStorage.saveTemplate('tmpl2', workflow, { tags: ['test'] });

      const list = composer.TemplateStorage.listTemplates({ tag: 'production' });
      expect(list.length).toBe(1);
    });

    test('should clone template', () => {
      composer.TemplateStorage.clear();
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const originalId = composer.TemplateStorage.saveTemplate('original', workflow);
      const clonedId = composer.TemplateStorage.cloneTemplate(originalId, 'cloned');

      expect(clonedId).not.toBe(originalId);
      const cloned = composer.TemplateStorage.loadTemplate(clonedId);
      expect(cloned.name).toBe('cloned');
      expect(cloned.metadata.clonedFrom).toBe(originalId);
    });

    test('should export and import template', () => {
      composer.TemplateStorage.clear();
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const originalId = composer.TemplateStorage.saveTemplate('test', workflow);
      const json = composer.TemplateStorage.exportTemplate(originalId);
      expect(typeof json).toBe('string');

      composer.TemplateStorage.clear();
      const importedId = composer.TemplateStorage.importTemplate(json);
      const imported = composer.TemplateStorage.loadTemplate(importedId);

      expect(imported.name).toBe('test');
    });

    test('should delete template', () => {
      composer.TemplateStorage.clear();
      const builder = composer.createBuilder();
      builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const templateId = composer.TemplateStorage.saveTemplate('test', workflow);
      const result = composer.TemplateStorage.deleteTemplate(templateId);

      expect(result.deleted).toBe(true);
      expect(composer.TemplateStorage.templates.size).toBe(0);
    });
  });

  describe('Execution History', () => {
    test('should record execution', () => {
      composer.ExecutionHistory.clear();
      const execution = {
        id: 'exec_1',
        workflowId: 'workflow_1',
        status: 'completed',
        output: { result: 'success' },
        errors: [],
        metrics: { totalDuration: 100 },
      };

      composer.ExecutionHistory.record(execution);
      expect(composer.ExecutionHistory.executions.length).toBe(1);
    });

    test('should retrieve execution', () => {
      composer.ExecutionHistory.clear();
      const execution = {
        id: 'exec_1',
        workflowId: 'workflow_1',
        status: 'completed',
        output: { result: 'success' },
        errors: [],
        metrics: { totalDuration: 100 },
      };

      composer.ExecutionHistory.record(execution);
      const retrieved = composer.ExecutionHistory.getExecution('exec_1');

      expect(retrieved.id).toBe('exec_1');
    });

    test('should list executions by status', () => {
      composer.ExecutionHistory.clear();

      for (let i = 0; i < 5; i++) {
        composer.ExecutionHistory.record({
          id: `exec_${i}`,
          workflowId: 'wf_1',
          status: i % 2 === 0 ? 'completed' : 'failed',
          errors: [],
          metrics: {},
        });
      }

      const completed = composer.ExecutionHistory.listExecutions({ status: 'completed' });
      expect(completed.length).toBe(3);
    });

    test('should calculate metrics', () => {
      composer.ExecutionHistory.clear();

      for (let i = 0; i < 3; i++) {
        composer.ExecutionHistory.record({
          id: `exec_${i}`,
          workflowId: 'wf_1',
          status: 'completed',
          errors: [],
          metrics: { totalDuration: 100 + i * 10 },
        });
      }

      const metrics = composer.ExecutionHistory.getMetrics('wf_1');
      expect(metrics.totalExecutions).toBe(3);
      expect(metrics.successCount).toBe(3);
      expect(parseFloat(metrics.successRate)).toBe(100);
    });

    test('should limit history size', () => {
      composer.ExecutionHistory.clear();
      composer.ExecutionHistory.maxSize = 10;

      for (let i = 0; i < 20; i++) {
        composer.ExecutionHistory.record({
          id: `exec_${i}`,
          workflowId: 'wf_1',
          status: 'completed',
          errors: [],
          metrics: {},
        });
      }

      expect(composer.ExecutionHistory.executions.length).toBeLessThanOrEqual(10);
    });
  });

  describe('UI Builder', () => {
    test('should generate UI schema', () => {
      const builder = composer.createBuilder();
      const skillId = builder.addSkill('test', async (data) => data);
      const workflow = builder.build();

      const schema = composer.UIBuilder.generateUISchema(workflow);

      expect(schema.canvas).toBeDefined();
      expect(schema.nodes.length).toBe(1);
      expect(schema.palette).toBeDefined();
    });

    test('should calculate node positions', () => {
      const builder = composer.createBuilder();
      builder.addSkill('s1', async (d) => d);
      builder.addSkill('s2', async (d) => d);
      builder.addSkill('s3', async (d) => d);
      const workflow = builder.build();

      const schema = composer.UIBuilder.generateUISchema(workflow);
      const positions = schema.nodes.map(n => n.position);

      expect(positions[0].x).toBeLessThan(positions[1].x);
      expect(positions[0].y).toBeLessThanOrEqual(positions[1].y);
    });

    test('should validate drop operations', () => {
      const skillNode = { type: composer.NODE_TYPES.SKILL };
      const condNode = { type: composer.NODE_TYPES.CONDITIONAL };

      const valid = composer.UIBuilder.validateDrop(skillNode, condNode);
      expect(valid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle FAIL_FAST strategy', async () => {
      const builder = composer.createBuilder();
      builder.addSkill('step1', async () => {
        throw new Error('Step 1 failed');
      });
      builder.addSkill('step2', async () => 'never reached');

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.status).toBe('failed');
    });

    test('should handle CONTINUE strategy', async () => {
      const builder = composer.createBuilder();
      builder.addSkill(
        'step1',
        async () => {
          throw new Error('Step 1 failed');
        },
        { errorStrategy: composer.ERROR_STRATEGIES.CONTINUE }
      );
      builder.addSkill('step2', async () => 'reached');

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.steps.length).toBe(2);
    });

    test('should handle SKIP strategy', async () => {
      const builder = composer.createBuilder();
      builder.addSkill(
        'optional',
        async () => {
          throw new Error('Optional step failed');
        },
        { errorStrategy: composer.ERROR_STRATEGIES.SKIP }
      );

      const workflow = builder.build();
      const result = await composer.executeWorkflow(workflow, {});

      expect(result.status).not.toBe('failed');
    });
  });

  describe('Validation', () => {
    test('should validate workflow structure', () => {
      const validation = composer.validateWorkflow([], []);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should detect missing node references', () => {
      const nodes = [{ id: 'n1', type: composer.NODE_TYPES.SKILL }];
      const edges = [{ from: 'n1', to: 'n_missing' }];

      const validation = composer.validateWorkflow(nodes, edges);
      expect(validation.valid).toBe(false);
    });

    test('should topologically sort nodes', () => {
      const nodes = [
        { id: 'n1', type: composer.NODE_TYPES.SKILL },
        { id: 'n2', type: composer.NODE_TYPES.SKILL },
        { id: 'n3', type: composer.NODE_TYPES.SKILL },
      ];
      const edges = [
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
      ];

      const sorted = composer.topologicalSort(nodes, edges);
      expect(sorted[0].id).toBe('n1');
      expect(sorted[1].id).toBe('n2');
      expect(sorted[2].id).toBe('n3');
    });
  });
});
