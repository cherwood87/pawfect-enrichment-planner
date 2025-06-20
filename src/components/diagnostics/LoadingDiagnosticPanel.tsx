import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { loadingDiagnosticService } from "@/services/diagnostics/LoadingDiagnosticService";
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface LoadingStage {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: "pending" | "completed" | "failed";
  details?: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: "component" | "network" | "render" | "bundle";
}

const LoadingDiagnosticPanel: React.FC = () => {
  const [stages, setStages] = useState<LoadingStage[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = loadingDiagnosticService.subscribe(
      (newStages, newMetrics) => {
        setStages(newStages);
        setMetrics(newMetrics);
      },
    );

    return unsubscribe;
  }, []);

  // Show panel only in development or when there are issues
  useEffect(() => {
    const shouldShow =
      process.env.NODE_ENV === "development" ||
      stages.some((s) => s.status === "failed") ||
      stages.some((s) => (s.duration || 0) > 3000);
    setIsVisible(shouldShow);
  }, [stages]);

  const handleGenerateReport = () => {
    const report = loadingDiagnosticService.generateReport();
    console.log("Generated diagnostic report:", report);

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert("Diagnostic report copied to clipboard!");
  };

  const handleClear = () => {
    loadingDiagnosticService.clear();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedStages = stages.filter((s) => s.status === "completed").length;
  const totalStages = stages.length;
  const progress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

  if (!isVisible && !isExpanded) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Loading Diagnostics</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {completedStages}/{totalStages} stages completed
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={handleGenerateReport}
                  size="sm"
                  variant="outline"
                >
                  Generate Report
                </Button>
                <Button onClick={handleClear} size="sm" variant="outline">
                  Clear
                </Button>
              </div>

              {/* Loading Stages */}
              <div>
                <h4 className="text-sm font-medium mb-2">Loading Stages</h4>
                <div className="space-y-1">
                  {stages.slice(-10).map((stage, index) => (
                    <div
                      key={`${stage.name}-${index}`}
                      className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(stage.status)}
                        <span className="font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {stage.duration && (
                          <span className="text-gray-600">
                            {stage.duration.toFixed(0)}ms
                          </span>
                        )}
                        <Badge
                          className={`text-xs ${getStatusColor(stage.status)}`}
                        >
                          {stage.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Metrics */}
              {metrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Metrics</h4>
                  <div className="space-y-1">
                    {metrics.slice(-5).map((metric, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs p-1 bg-blue-50 rounded"
                      >
                        <span>{metric.name}</span>
                        <div className="flex items-center space-x-2">
                          <span>{metric.value.toFixed(0)}ms</span>
                          <Badge variant="outline" className="text-xs">
                            {metric.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LoadingDiagnosticPanel;
