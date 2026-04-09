interface RulesScreenProps {
  onBack: () => void;
}

export function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="max-w-2xl w-full animate-slide-up">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors mb-6 font-bold text-sm flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        <h1 className="tiki-title text-4xl md:text-5xl mb-8 text-center">How to Play</h1>

        <div className="space-y-6">
          <RuleSection
            icon="🎯"
            title="Objective"
            content="Score the most points by getting your tokens to the highest positions on the track!"
          />
          <RuleSection
            icon="🏗️"
            title="Setup"
            content="All tokens start stacked at the beginning of the track. Each player owns 2 tokens (shown by their emoji). The stack is shuffled randomly."
          />
          <RuleSection
            icon="🔄"
            title="Turns"
            content="Players take turns in order. On each turn, you MUST perform exactly ONE action."
          />
          <RuleSection
            icon="➡️"
            title="Action 1: Move"
            content="Move the top 1, 2, or 3 tokens from the rearmost stack forward by 1 position. The order of moved tokens stays the same."
          />
          <RuleSection
            icon="🔀"
            title="Action 2: Reorder"
            content="Take the top 2 or 3 tokens from the rearmost stack and rearrange their order. Tap them in the new order you want (first tap = new top)."
          />
          <RuleSection
            icon="🏁"
            title="Game End"
            content="The game ends when all tokens reach the final position, OR after 30 turns. Tokens are scored by their final positions — further ahead = more points. Within the same position, higher in the stack = more points."
          />
          <RuleSection
            icon="💡"
            title="Strategy Tips"
            content="Push your own tokens forward while trying to leave opponents' tokens behind. Use reordering to get your tokens on top before a big move!"
          />
        </div>

        <div className="mt-8 text-center">
          <button onClick={onBack} className="tiki-btn text-lg">
            Got it! 👍
          </button>
        </div>
      </div>
    </div>
  );
}

function RuleSection({ icon, title, content }: { icon: string; title: string; content: string }) {
  return (
    <div className="tiki-card flex gap-4 items-start">
      <span className="text-3xl flex-shrink-0 mt-1">{icon}</span>
      <div>
        <h3 className="font-display text-xl text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
