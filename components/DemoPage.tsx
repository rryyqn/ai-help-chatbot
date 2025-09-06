import { Button } from "@/components/ui/button";
import { BookText, DollarSign, Github, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-xl font-semibold">Website</div>

            <Button variant="outline" asChild className="shadow-none">
              <Link href="https://github.com/rryyqn/ai-chatbot">
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Open Source AI Chatbot Template
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Open the chat in the bottom right corner to start a conversation
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Button asChild className="w-fit">
              <Link href="https://github.com/rryyqn/ai-chatbot">
                Source Code <Github />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-18 h-18 bg-primary/5 mx-auto rounded-lg my-2 justify-center flex items-center">
                <ShieldCheck className=" size-10" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Arcjet Protected</h3>
              <p className="text-muted-foreground">
                Rate limiting and bot protection
              </p>
            </div>
            <div className="text-center">
              <div className="w-18 h-18 bg-primary/5 mx-auto rounded-lg my-2 justify-center flex items-center">
                <DollarSign className="size-10" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free AI Models</h3>
              <p className="text-muted-foreground">
                Built with Gemini AI&apos;s generous free tier
              </p>
            </div>
            <div className="text-center">
              <div className="w-18 h-18 bg-primary/5 mx-auto rounded-lg my-2 justify-center flex items-center">
                <BookText className="size-10" strokeWidth={1} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Training</h3>
              <p className="text-muted-foreground">
                Customize your chatbot&apos;s responses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-2 my-20">
        <div className="container mx-auto px-4 text-center bg-gradient-to-bl from-primary/90 to-black py-20 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Get The Template
          </h2>
          <p className="text-ring mb-4 mx-auto">
            Docs and instructions are in the GitHub repository. Give it a star
            while you&apos;re at it ;&#41;
          </p>
          <Button className="border border-muted-foreground bg-transparent hover:bg-secondary/5">
            <Link href="https://github.com/rryyqn/ai-chatbot">GitHub</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="">
        <div className="container mx-auto px-4">
          <div className="py-8 text-center text-sm text-muted-foreground">
            Made with ❤️ by{" "}
            <a
              rel="noopener"
              href="https://rryyqn.com/"
              target="_blank"
              className="underline"
            >
              rryyqn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
