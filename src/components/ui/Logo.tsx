import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({ className = '', width = 168, height = 32 }: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="punto fly logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
};
