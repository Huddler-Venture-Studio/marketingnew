"use client";
import * as React from "react";
import { Section } from "@/common/layout";
import { Input } from "@/common/input";
import { Button } from "@/common/button";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setMessage("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section
      className="bg-surface-secondary dark:bg-dark-surface-secondary py-10!"
      container="full"
    >
      <div className="container mx-auto flex flex-col gap-4 px-6 lg:flex-row lg:justify-between">
        <div className="flex flex-1 flex-col items-start gap-1">
          <h5 className="text-xl font-medium lg:text-2xl">Stay Updated</h5>
          <p className="text text-text-tertiary dark:text-dark-text-tertiary lg:text-lg">
            Get the latest updates from Huddler delivered to your inbox
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            {message && (
              <p className={`text-sm ${message.includes("Thank you") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </Section>
  );
}
