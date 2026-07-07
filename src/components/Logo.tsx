import logoImage from '../assets/LOGO_ECOVILLE_SMART.png'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  xs: 'h-11 w-11',
  sm: 'h-10 w-10',
  md: 'h-28 w-28',
  lg: 'h-36 w-36',
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="Ecoville SmartClean"
      className={`object-contain ${sizes[size]} ${className}`}
    />
  )
}
