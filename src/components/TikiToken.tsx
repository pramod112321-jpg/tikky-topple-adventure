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
          backgroundColor: token.color,
          animationDelay: index ? `${index * 0.05}s` : '0s',
        }}
        title={`${token.emoji} ${token.label} (P${token.ownerId + 1})`}
      >
        <span className="drop-shadow-md">{token.emoji}</span>
      </button>
      {orderNumber !== undefined && (
        <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md z-20">
          {orderNumber}
        </span>
      )}
    </div>
  );
}
