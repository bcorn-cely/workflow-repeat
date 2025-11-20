'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

function CampaignReportContent() {
  const searchParams = useSearchParams();
  const rawToken = searchParams.get('token');
  const token = rawToken ? rawToken.replace(/['"]+$/, '').trim() : null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock report data - in a real app, this would be fetched from the API
  const mockReportData = {
    analysisId: token || 'analysis_123',
    campaignName: 'Q4 Family Finance Campaign',
    dateRange: {
      start: '2024-10-01',
      end: '2024-12-31',
    },
    performance: {
      totalSpend: 125000,
      totalRevenue: 187500,
      roi: 50,
      cac: 125,
      conversions: 1000,
      conversionRate: 3.2,
    },
    channelBreakdown: [
      { channel: 'google_ads', spend: 50000, revenue: 75000, roi: 50, conversions: 400 },
      { channel: 'facebook', spend: 30000, revenue: 45000, roi: 50, conversions: 240 },
      { channel: 'instagram', spend: 25000, revenue: 37500, roi: 50, conversions: 200 },
      { channel: 'tiktok', spend: 20000, revenue: 30000, roi: 50, conversions: 160 },
    ],
    recommendations: [
      {
        type: 'scale',
        channel: 'google_ads',
        reason: 'High ROI of 50.0%',
        expectedImpact: 'Increase revenue by ~15% with 30% budget increase',
      },
      {
        type: 'optimize',
        channel: 'tiktok',
        reason: 'Lower conversion rate compared to other channels',
        expectedImpact: 'Optimize targeting and creative to improve ROI by 20-30%',
      },
    ],
    forecast: {
      projectedRevenue: 206250,
      projectedCAC: 108,
      projectedROI: 55,
      confidence: 85,
    },
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-4xl w-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-muted-foreground">Loading campaign report...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="greenlight-theme min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/10 dark:to-emerald-950/10 p-4">
      <div className="container max-w-6xl mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campaign Analysis Report</h1>
            <p className="text-muted-foreground">
              {mockReportData.campaignName} • {mockReportData.dateRange.start} to {mockReportData.dateRange.end}
            </p>
          </div>
          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
            Analysis ID: {mockReportData.analysisId}
          </Badge>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics and ROI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${mockReportData.performance.totalSpend.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${mockReportData.performance.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  {mockReportData.performance.roi > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  {mockReportData.performance.roi.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CAC</p>
                <p className="text-2xl font-bold">${mockReportData.performance.cac}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>Breakdown by marketing channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.channelBreakdown.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold capitalize">{channel.channel.replace('_', ' ')}</p>
                    <p className="text-sm text-muted-foreground">
                      ${channel.spend.toLocaleString()} spend • ${channel.revenue.toLocaleString()} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{channel.roi.toFixed(1)}% ROI</p>
                    <p className="text-sm text-muted-foreground">{channel.conversions} conversions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions to improve performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Badge variant={rec.type === 'scale' ? 'default' : 'secondary'}>
                      {rec.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold">{rec.channel ? `Channel: ${rec.channel}` : 'General'}</p>
                      <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                      <p className="text-sm text-green-600 mt-2">Expected Impact: {rec.expectedImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forecast */}
        {mockReportData.forecast && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Forecast</CardTitle>
              <CardDescription>Projected outcomes based on historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Projected Revenue</p>
                  <p className="text-2xl font-bold">${mockReportData.forecast.projectedRevenue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Projected CAC</p>
                  <p className="text-2xl font-bold">${mockReportData.forecast.projectedCAC}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold">{mockReportData.forecast.confidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center pt-4">
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            Download PDF Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CampaignReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-muted-foreground">Loading report page...</p>
          </div>
        </Card>
      </div>
    }>
      <CampaignReportContent />
    </Suspense>
  );
}

