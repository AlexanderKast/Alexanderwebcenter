import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

const sizes = {
  sm: { icon: 32, textMain: 'text-sm', textSub: 'text-[9px]' },
  md: { icon: 44, textMain: 'text-base', textSub: 'text-[10px]' },
  lg: { icon: 64, textMain: 'text-xl', textSub: 'text-xs' },
};

export function Logo({ size = 'md', variant = 'full' }: LogoProps) {
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.svg"
        alt="Alexander Cast"
        width={200}
        height={200}
        style={{ height: `${s.icon}px`, width: 'auto' }}
        className="flex-shrink-0"
        priority
      />
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <div className={`${s.textMain} tracking-[0.15em] uppercase`}>
            <span className="font-light text-white">Alexander</span>
            {' '}
            <span className="font-black text-white">Cast</span>
          </div>
          <span className={`${s.textSub} italic tracking-widest text-gold-400`}>
            Digital Business
          </span>
        </div>
      )}
    </div>
  );
}

