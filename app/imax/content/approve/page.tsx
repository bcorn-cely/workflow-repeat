/**
 * IMAX Content Release Approval Page
 * 
 * Client-side page for approving or rejecting content release in the IMAX content review workflow.
 * This page is accessed via a link sent to approvers, containing an approval token.
 */

"use client"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Film, Video, ShieldCheck, AlertTriangle } from "lucide-react"

function ContentApprovalContent() {
  const searchParams = useSearchParams()
  const rawToken = searchParams.get("token")
  // Clean the token - remove any trailing quotes, commas, or whitespace that might have been introduced during URL encoding/decoding
  const token = rawToken ? rawToken.replace(/['",]+$/, '').trim() : null
  const [approved, setApproved] = useState<boolean | null>(null)
  const [comment, setComment] = useState("")
  const [releaseNotes, setReleaseNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (approvedValue: boolean) => {
    if (!token) {
      setError("Missing approval token")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/workflows/imax/content/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          approved: approvedValue,
          comment: comment.trim() || undefined,
          releaseNotes: releaseNotes.trim() || undefined,
          by: "content-manager@imax.com", // In production, get from auth
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Approval failed")
      }

      setApproved(approvedValue)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit approval")
    } finally {
      setSubmitting(false)
    }
  }

  if (approved !== null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center border-purple-500/20">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            {approved ? (
              <ShieldCheck className="h-8 w-8 text-purple-600" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {approved ? "Content Release Approved" : "Content Release Rejected"}
          </h1>
          <p className="text-muted-foreground">
            {approved
              ? "The content has been approved and will proceed to distribution."
              : "The content release has been rejected. The requester will be notified."}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold">Content Release Approval</h1>
          </div>
          <p className="text-muted-foreground">
            Review and approve or reject this content for IMAX distribution
          </p>
        </div>

        <Card className="p-6 border-purple-500/20 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Film className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Content Details</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Content ID:</span>
              <span className="font-mono">{token?.split(":")[0] || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>Pending Release Approval</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reviewer Role:</span>
              <span className="capitalize">Content Manager</span>
            </div>
          </div>
        </Card>

        {error && (
          <Card className="p-4 mb-6 border-red-500/20 bg-red-500/10">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-6 border-purple-500/20 mb-6">
          <h3 className="font-semibold mb-3">Add Comment (Optional)</h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add any comments, feedback, or notes about the content..."
            className="min-h-[120px] mb-4"
          />
          <h3 className="font-semibold mb-3">Release Notes (Optional)</h3>
          <Textarea
            value={releaseNotes}
            onChange={(e) => setReleaseNotes(e.target.value)}
            placeholder="Add release notes or distribution instructions..."
            className="min-h-[100px]"
          />
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Approve Release
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            variant="outline"
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reject Release
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ContentApprovalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center border-purple-500/20">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-purple-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Preparing content approval page</p>
        </Card>
      </div>
    }>
      <ContentApprovalContent />
    </Suspense>
  )
}

