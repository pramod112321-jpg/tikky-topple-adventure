import { Token } from '@/lib/gameTypes';

interface TikiTokenProps {
  token: Token;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  index?: number;
  orderNumber?: number;
}

const sizeClasses = {
  sm: 'w-11 h-11 text-base',
  md: 'w-14 h-14 text-xl',
  lg: 'w-16 h-16 text-2xl',
};

export function TikiToken({ token, size = 'md', selected, onClick, index, orderNumber }: TikiTokenProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`tiki-token ${sizeClasses[size]} ${
          selected ? 'ring-4 ring-secondary scale-110 z-10' : ''
        } ${onClick ? 'cursor-pointer hover:scale-110 hover:z-10' : 'cursor-default'}`}
        style={{
          background: `linear-gradient(145deg, ${token.color}, ${token.color}cc)`,
          animationDelay: index ? `${index * 0.05}s` : '0s',
          boxShadow: `0 3px 8px -1px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)`,
          border: '3px solid hsla(0, 0%, 100%, 0.3)',
        }}
        title={`${token.emoji} ${token.label} (P${token.ownerId + 1})`}
      >
        {/* Tiki face shine effect */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        <span className="drop-shadow-md relative z-10">{token.emoji}</span>
      </button>
      {orderNumber !== undefined && (
        <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
          {orderNumber}
        </span>
      )}
    </div>
  );
}
