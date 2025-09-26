import { Section } from "@/common/layout";

export function LoadingFallback() {
  return (
    <Section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md mb-4 mx-auto max-w-md"></div>
          <div className="h-4 bg-gray-200 rounded-md mb-2 mx-auto max-w-lg"></div>
          <div className="h-4 bg-gray-200 rounded-md mx-auto max-w-md"></div>
        </div>
      </div>
    </Section>
  );
}

export function ErrorFallback() {
  return (
    <Section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Huddler</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your collaboration platform for teams that get things done.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="https://docs.huddler.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Documentation
          </a>
          <a 
            href="https://knowledge.huddler.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Knowledge Base
          </a>
        </div>
      </div>
    </Section>
  );
}