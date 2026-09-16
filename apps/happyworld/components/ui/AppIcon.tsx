import {
  AlertTriangle,
  Ban,
  BarChart3,
  Beaker,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Globe,
  Heart,
  HelpCircle,
  Lightbulb,
  Lock,
  MapPin,
  Minus,
  Phone,
  Plus,
  PlusCircle,
  ShieldCheck,
  Star,
  Users,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  StarIcon: Star,
  MapPinIcon: MapPin,
  UserGroupIcon: Users,
  ChartBarIcon: BarChart3,
  ExclamationTriangleIcon: AlertTriangle,
  MinusIcon: Minus,
  PlusIcon: Plus,
  MagnifyingGlassPlusIcon: ZoomIn,
  XMarkIcon: X,
  ChevronLeftIcon: ChevronLeft,
  ChevronRightIcon: ChevronRight,
  ChevronDownIcon: ChevronDown,
  LightBulbIcon: Lightbulb,
  ClockIcon: Clock,
  DownloadIcon: Download,
  NoSymbolIcon: Ban,
  BeakerIcon: Beaker,
  HeartIcon: Heart,
  GlobeAltIcon: Globe,
  PlusCircleIcon: PlusCircle,
  ShieldCheckIcon: ShieldCheck,
  LockClosedIcon: Lock,
  PhoneIcon: Phone,
};

export type IconName = keyof typeof ICONS;

type AppIconProps = {
  name: IconName | (string & {});
  size?: number;
  className?: string;
  variant?: 'solid' | 'outline';
  strokeWidth?: number;
};

function AppIcon({ name, size = 16, className, variant = 'outline', strokeWidth }: AppIconProps) {
  const Lucide = ICONS[name] ?? HelpCircle;
  return (
    <Lucide
      size={size}
      className={className}
      strokeWidth={strokeWidth ?? (variant === 'solid' ? 2.5 : 2)}
      fill={variant === 'solid' ? 'currentColor' : 'none'}
    />
  );
}

export default AppIcon;
