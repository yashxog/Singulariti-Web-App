'use client'

import { AlertCircle, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

const formatTime = (timeInMs: number) => {
    const hours = Math.floor(timeInMs / 3600000);
    const minutes = Math.floor((timeInMs % 3600000) / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);

    const formatedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formatedTime;
}

export function RateLimitReachedComponent({ timeLeft }: { timeLeft: string }) {


  const [ timeToRetry, setTimeToREtry ] = useState(Number(timeLeft));

  useEffect(() => {

    if (timeToRetry <= 0) return;


    const interval = setInterval(() => {
      setTimeToREtry((prevTimeToRetry) => {
        const newTime = prevTimeToRetry - 1000;
        return newTime < 0 ? 0 : newTime;
      });
    }, 1000)

    return () => clearInterval(interval);
  }, [timeLeft])

  return (
    <div className="flex items-center justify-center min-h-screen bg-paper">
      <Card className="w-full max-w-lg bg-paper-2 border border-white">
        <CardHeader>
          <CardTitle className="text-3xl font-Normal text-center text-charcoal">Rate Limit Reached</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <span>You&apos;ve reached the maximum number of requests. Please try again later.</span>
            </AlertDescription>
          </Alert>
          <div className="flex items-center justify-center space-x-2 text-subtext text-lg font-normal">
            <Clock className="h-5 w-5" />
            <span>Try Again After</span>
            <span>
              {formatTime(timeToRetry)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="bg-mudbrown hover:bg-card-hover-1 hover:text-charcoal border border-white" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}