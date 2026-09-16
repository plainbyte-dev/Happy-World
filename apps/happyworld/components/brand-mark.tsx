import Image from 'next/image';

function BrandMark() {
  return (
    <Image
      src="/logo/logo.png"
      alt="Happy World Tours & Travel"
      width={1536}
      height={1024}
      className="brand-logo"
      priority
    />
  );
}

export default BrandMark;
