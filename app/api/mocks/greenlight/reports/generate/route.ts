export async function POST(req: Request) {
  const body = await req.json();
  const { analysisId, campaignData, recommendations, forecast } = body;
  
  // Simulate report generation
  const reportId = `report_${analysisId}_${Date.now()}`;
  
  // Simulate delay
  await new Promise((r) => setTimeout(r, 500));
  
  return Response.json({
    reportId,
    analysisId,
    generatedAt: new Date().toISOString(),
    sections: [
      {
        title: 'Executive Summary',
        content: `Campaign performance analysis with ${campaignData?.roi?.toFixed(1) || 'N/A'}% ROI`,
      },
      {
        title: 'Performance Metrics',
        content: campaignData,
      },
      {
        title: 'Recommendations',
        content: recommendations || [],
      },
      ...(forecast ? [{
        title: 'Forecast',
        content: forecast,
      }] : []),
    ],
    format: 'pdf',
    downloadUrl: `/api/mocks/greenlight/reports/${reportId}/download`,
  });
}

