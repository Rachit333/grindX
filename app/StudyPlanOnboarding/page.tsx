"use client";
import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";

export default function JoinStudyPlan() {
  const [planId, setPlanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidUUID = (uuid: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const joinStudyPlan = async (id: string = planId) => {
    setError(null);
    setSuccess(null);
    setCopied(false);

    if (!isValidUUID(id)) {
      setError("Please enter a valid study plan ID");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to join a study plan");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`/api/joinStudyPlan?StudyPlanID=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join study plan");
      }

      setSuccess(data.message);
      setShareableLink(
        `${window.location.origin}/JoinStudyPlan?planId=${id}`
      );
      setPlanId("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to join study plan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlanId = urlParams.get("planId");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsAuthReady(true);
      if (urlPlanId) {
        setPlanId(urlPlanId);
        if (user) {
          await joinStudyPlan(urlPlanId);
        } else {
          setError("Please sign in to join a study plan");
        }
      } else {
        inputRef.current?.focus();
      }
    });

    return () => unsubscribe();
  }, []);

  const copyToClipboard = async () => {
    if (shareableLink) {
      try {
        await navigator.clipboard.writeText(shareableLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
      </div>
      <div className="flex justify-center items-center min-h-screen dark:bg-zinc-950 relative">
        <Card className="w-full max-w-md mx-auto ">
          <CardHeader>
            <CardTitle>Join Study Plan</CardTitle>
            <CardDescription>
              Enter the unique ID of the study plan you want to join or use the
              link provided.
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              joinStudyPlan();
            }}
          >
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Input
                  ref={inputRef}
                  id="planId"
                  placeholder="Enter study plan ID"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  disabled={loading}
                  aria-label="Study Plan ID"
                  aria-describedby="planId-description"
                />
                <p
                  id="planId-description"
                  className="text-sm text-muted-foreground"
                >
                  The ID should be in the format:
                  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                </p>
              </div>
              {shareableLink && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Shareable Link:</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={shareableLink}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      aria-label="Copy shareable link"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600">
                      Copied to clipboard!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !planId}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Joining..." : "Join Study Plan"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
