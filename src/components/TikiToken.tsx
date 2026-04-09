import { Token } from '@/lib/gameTypes';

interface TikiTokenProps {
  token: Token;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  index?: number;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-16 h-16 text-xl',
};

export function TikiToken({ token, size = 'md', selected, onClick, index }: TikiTokenProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`tiki-token ${sizeClasses[size]} ${selected ? 'ring-4 ring-secondary scale-110' : ''} ${onClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
      style={{
        backgroundColor: token.color,
        animationDelay: index ? `${index * 0.05}s` : '0s',
      }}
      title={`${token.label} (Player ${token.ownerId + 1})`}
    >
      <span className="drop-shadow-md">{token.label}</span>
    </button>
  );
}
