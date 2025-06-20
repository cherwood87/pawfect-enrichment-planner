interface LoadingStage {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'completed' | 'failed';
  details?: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'component' | 'network' | 'render' | 'bundle';
}

class LoadingDiagnosticService {
  private stages: Map<string, LoadingStage> = new Map();
  private metrics: PerformanceMetric[] = [];
  private subscribers: ((stages: LoadingStage[], metrics: PerformanceMetric[]) => void)[] = [];

  // Stage tracking
  startStage(name: string, details?: any) {
    const stage: LoadingStage = {
      name,
      startTime: performance.now(),
      status: 'pending',
      details
    };
    
    this.stages.set(name, stage);
    console.log(`🚀 [Loading] Starting: ${name}`, details);
    this.notifySubscribers();
  }

  completeStage(name: string, details?: any) {
    const stage = this.stages.get(name);
    if (stage) {
      stage.endTime = performance.now();
      stage.duration = stage.endTime - stage.startTime;
      stage.status = 'completed';
      if (details) stage.details = { ...stage.details, ...details };
      
      console.log(`✅ [Loading] Completed: ${name} (${stage.duration.toFixed(2)}ms)`, stage.details);
      this.notifySubscribers();
    }
  }

  failStage(name: string, error: any) {
    const stage = this.stages.get(name);
    if (stage) {
      stage.endTime = performance.now();
      stage.duration = stage.endTime - stage.startTime;
      stage.status = 'failed';
      stage.details = { ...stage.details, error: error.message || error };
      
      console.error(`❌ [Loading] Failed: ${name} (${stage.duration?.toFixed(2)}ms)`, error);
      this.notifySubscribers();
    }
  }

  // Performance metrics
  recordMetric(name: string, value: number, category: PerformanceMetric['category'] = 'component') {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      category
    };
    
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
    
    console.log(`📊 [Metric] ${name}: ${value}ms (${category})`);
    this.notifySubscribers();
  }

  // Bundle size tracking
  recordBundleLoad(componentName: string, loadTime: number) {
    this.recordMetric(`Bundle: ${componentName}`, loadTime, 'bundle');
  }

  // Network request tracking
  recordNetworkRequest(endpoint: string, duration: number, success: boolean) {
    this.recordMetric(
      `Network: ${endpoint}`, 
      duration, 
      'network'
    );
    
    if (!success) {
      console.warn(`🌐 [Network] Failed request to ${endpoint} after ${duration}ms`);
    }
  }

  // Render performance tracking
  recordRenderTime(componentName: string, renderTime: number) {
    this.recordMetric(`Render: ${componentName}`, renderTime, 'render');
    
    if (renderTime > 16) { // Longer than 60fps frame
      console.warn(`🐌 [Render] Slow render detected: ${componentName} (${renderTime.toFixed(2)}ms)`);
    }
  }

  // Subscription management
  subscribe(callback: (stages: LoadingStage[], metrics: PerformanceMetric[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    const stages = Array.from(this.stages.values());
    this.subscribers.forEach(callback => callback(stages, this.metrics));
  }

  // Diagnostic reports
  generateReport() {
    const stages = Array.from(this.stages.values());
    const totalTime = stages.reduce((sum, stage) => sum + (stage.duration || 0), 0);
    const failedStages = stages.filter(s => s.status === 'failed');
    const slowStages = stages.filter(s => (s.duration || 0) > 1000);
    
    const report = {
      summary: {
        totalStages: stages.length,
        totalTime: totalTime.toFixed(2),
        failedStages: failedStages.length,
        slowStages: slowStages.length
      },
      stages: stages.sort((a, b) => (b.duration || 0) - (a.duration || 0)),
      metrics: this.metrics.slice(-20), // Last 20 metrics
      recommendations: this.generateRecommendations(stages)
    };
    
    console.log('📋 [Diagnostic Report]', report);
    return report;
  }

  private generateRecommendations(stages: LoadingStage[]) {
    const recommendations = [];
    
    const slowStages = stages.filter(s => (s.duration || 0) > 2000);
    if (slowStages.length > 0) {
      recommendations.push(`Consider optimizing these slow stages: ${slowStages.map(s => s.name).join(', ')}`);
    }
    
    const failedStages = stages.filter(s => s.status === 'failed');
    if (failedStages.length > 0) {
      recommendations.push(`Fix these failed stages: ${failedStages.map(s => s.name).join(', ')}`);
    }
    
    return recommendations;
  }

  // Clear data
  clear() {
    this.stages.clear();
    this.metrics = [];
    this.notifySubscribers();
    console.log('🧹 [Diagnostic] Cleared all data');
  }
}

export const loadingDiagnosticService = new LoadingDiagnosticService();
