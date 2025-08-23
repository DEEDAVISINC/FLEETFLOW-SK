// AI Company Dashboard Integration with Cost-Optimized Batching
// REPLACES individual API calls with batched processing

import { aiBatchService } from './AIBatchService';

// Replace expensive individual AI calls with efficient batched processing
export class AICompanyIntegration {
  // OLD WAY: Individual API call for each task (EXPENSIVE)
  // const response = await fetch('/api/ai/claude', { ... }); // $0.35 per call

  // NEW WAY: Batch multiple tasks together (CHEAP)
  async processTask(
    type:
      | 'email_analysis'
      | 'lead_qualification'
      | 'contract_review'
      | 'scheduling',
    content: string,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<string> {
    // Queue task for batch processing instead of immediate API call
    const taskId = await aiBatchService.queueTask({
      type,
      content,
      priority,
    });

    console.log(`📤 Task queued for batch processing: ${taskId}`);
    return taskId;
  }

  // Get result when batch processing is complete
  async getTaskResult(taskId: string, timeout: number = 30000): Promise<any> {
    const startTime = Date.now();

    // Poll for result with timeout
    while (Date.now() - startTime < timeout) {
      const result = await aiBatchService.getTaskResult(taskId);

      if (result && result.result && result.result.status !== 'queued') {
        return result.result;
      }

      // Wait 2 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error(`Task ${taskId} timed out after ${timeout}ms`);
  }

  // INTEGRATION: Replace AI Company Dashboard individual calls

  // Email Analysis (was: individual API call per email)
  async analyzeEmails(
    emails: Array<{ id: string; content: string }>
  ): Promise<Array<{ id: string; analysis: any }>> {
    console.log(
      `🔄 Batching ${emails.length} emails for analysis (was ${emails.length} individual calls)`
    );

    const results = [];

    // Process emails in batch instead of individually
    for (const email of emails) {
      const taskId = await this.processTask(
        'email_analysis',
        email.content,
        'medium'
      );
      results.push({ id: email.id, taskId });
    }

    // Wait for batch processing and collect results
    const analysisResults = [];
    for (const { id, taskId } of results) {
      try {
        const analysis = await this.getTaskResult(taskId);
        analysisResults.push({ id, analysis });
      } catch (error) {
        console.error(`Email analysis failed for ${id}:`, error);
        analysisResults.push({
          id,
          analysis: {
            error: 'Analysis failed',
            sentiment: 5,
            urgency: 'M',
            action: 'Y',
            priority: 3,
          },
        });
      }
    }

    return analysisResults;
  }

  // Lead Qualification (was: individual API call per lead)
  async qualifyLeads(
    leads: Array<{ id: string; data: string }>
  ): Promise<Array<{ id: string; qualification: any }>> {
    console.log(
      `🎯 Batching ${leads.length} leads for qualification (was ${leads.length} individual calls)`
    );

    const results = [];

    for (const lead of leads) {
      const taskId = await this.processTask(
        'lead_qualification',
        lead.data,
        'high'
      );
      results.push({ id: lead.id, taskId });
    }

    const qualificationResults = [];
    for (const { id, taskId } of results) {
      try {
        const qualification = await this.getTaskResult(taskId);
        qualificationResults.push({ id, qualification });
      } catch (error) {
        console.error(`Lead qualification failed for ${id}:`, error);
        qualificationResults.push({
          id,
          qualification: {
            error: 'Qualification failed',
            score: 5,
            budget: 'M',
            timeline: 'month',
            fit: 'N',
          },
        });
      }
    }

    return qualificationResults;
  }

  // Contract Review (was: individual API call per contract)
  async reviewContracts(
    contracts: Array<{ id: string; content: string }>
  ): Promise<Array<{ id: string; review: any }>> {
    console.log(
      `📄 Batching ${contracts.length} contracts for review (was ${contracts.length} individual calls)`
    );

    const results = [];

    for (const contract of contracts) {
      const taskId = await this.processTask(
        'contract_review',
        contract.content,
        'high'
      );
      results.push({ id: contract.id, taskId });
    }

    const reviewResults = [];
    for (const { id, taskId } of results) {
      try {
        const review = await this.getTaskResult(taskId);
        reviewResults.push({ id, review });
      } catch (error) {
        console.error(`Contract review failed for ${id}:`, error);
        reviewResults.push({
          id,
          review: {
            error: 'Review failed',
            risk: 'M',
            issues: 'Unable to analyze',
            recommendation: 'revise',
          },
        });
      }
    }

    return reviewResults;
  }

  // Scheduling Analysis (was: individual API call per scheduling request)
  async analyzeScheduling(
    requests: Array<{ id: string; details: string }>
  ): Promise<Array<{ id: string; analysis: any }>> {
    console.log(
      `📅 Batching ${requests.length} scheduling requests (was ${requests.length} individual calls)`
    );

    const results = [];

    for (const request of requests) {
      const taskId = await this.processTask(
        'scheduling',
        request.details,
        'medium'
      );
      results.push({ id: request.id, taskId });
    }

    const analysisResults = [];
    for (const { id, taskId } of results) {
      try {
        const analysis = await this.getTaskResult(taskId);
        analysisResults.push({ id, analysis });
      } catch (error) {
        console.error(`Scheduling analysis failed for ${id}:`, error);
        analysisResults.push({
          id,
          analysis: {
            error: 'Analysis failed',
            availability: 'Y',
            conflicts: 'Unknown',
            best_time: '2:00 PM',
          },
        });
      }
    }

    return analysisResults;
  }

  // Force process current batch (for urgent tasks)
  async forceProcessBatch(): Promise<void> {
    console.log('⚡ Force processing current batch');
    await aiBatchService.forceProcessBatch();
  }

  // Get current usage and savings
  getUsageStats() {
    return aiBatchService.getUsageStats();
  }

  // Simulate realistic AI staff activity with batched processing
  async simulateAIStaffActivity(): Promise<{
    emailsProcessed: number;
    leadsQualified: number;
    contractsReviewed: number;
    schedulingTasks: number;
    totalCost: number;
    savedCost: number;
  }> {
    // Simulate daily AI staff workload
    const dailyWorkload = {
      emails: Math.floor(Math.random() * 20) + 10, // 10-30 emails
      leads: Math.floor(Math.random() * 10) + 5, // 5-15 leads
      contracts: Math.floor(Math.random() * 3) + 1, // 1-4 contracts
      scheduling: Math.floor(Math.random() * 8) + 3, // 3-11 scheduling
    };

    // Process workload in batches
    const emailTasks = Array.from({ length: dailyWorkload.emails }, (_, i) => ({
      id: `email_${i}`,
      content: `Sample email content for analysis ${i}`,
    }));

    const leadTasks = Array.from({ length: dailyWorkload.leads }, (_, i) => ({
      id: `lead_${i}`,
      data: `Sample lead data for qualification ${i}`,
    }));

    const contractTasks = Array.from(
      { length: dailyWorkload.contracts },
      (_, i) => ({
        id: `contract_${i}`,
        content: `Sample contract content for review ${i}`,
      })
    );

    const schedulingTasks = Array.from(
      { length: dailyWorkload.scheduling },
      (_, i) => ({
        id: `schedule_${i}`,
        details: `Sample scheduling request ${i}`,
      })
    );

    // Execute batched processing
    try {
      await Promise.all([
        this.analyzeEmails(emailTasks),
        this.qualifyLeads(leadTasks),
        this.reviewContracts(contractTasks),
        this.analyzeScheduling(schedulingTasks),
      ]);

      // Calculate costs and savings
      const totalTasks =
        dailyWorkload.emails +
        dailyWorkload.leads +
        dailyWorkload.contracts +
        dailyWorkload.scheduling;

      // Old way: individual API calls
      const oldCost = totalTasks * 0.35; // $0.35 per individual call

      // New way: batched calls (approximately 4-6 batch calls total)
      const newCost = Math.ceil(totalTasks / 10) * 2.5; // $2.50 per batch call (10 tasks per batch)

      const saved = oldCost - newCost;

      console.log(`✅ AI Staff Activity Complete:`);
      console.log(
        `📧 Emails: ${dailyWorkload.emails}, 🎯 Leads: ${dailyWorkload.leads}, 📄 Contracts: ${dailyWorkload.contracts}, 📅 Scheduling: ${dailyWorkload.scheduling}`
      );
      console.log(
        `💰 Cost: $${newCost.toFixed(2)} (was $${oldCost.toFixed(2)}) - Saved: $${saved.toFixed(2)}`
      );

      return {
        emailsProcessed: dailyWorkload.emails,
        leadsQualified: dailyWorkload.leads,
        contractsReviewed: dailyWorkload.contracts,
        schedulingTasks: dailyWorkload.scheduling,
        totalCost: newCost,
        savedCost: saved,
      };
    } catch (error) {
      console.error('❌ AI staff activity simulation failed:', error);

      return {
        emailsProcessed: 0,
        leadsQualified: 0,
        contractsReviewed: 0,
        schedulingTasks: 0,
        totalCost: 0,
        savedCost: 0,
      };
    }
  }
}

// Export singleton instance
export const aiCompanyIntegration = new AICompanyIntegration();

// Usage tracking for the AI Company Dashboard
export interface DailyStats {
  tasksProcessed: number;
  costIncurred: number;
  costSaved: number;
  apiCallsMade: number;
  apiCallsAvoided: number;
  efficiencyGain: number;
}

