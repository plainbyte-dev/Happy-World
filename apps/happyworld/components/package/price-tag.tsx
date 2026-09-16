type PriceTagProps = {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  suffix?: string;
};

const SIZE_CLASS: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'pkg-price-sm',
  md: 'pkg-price-md',
  lg: 'pkg-price-lg',
};

function PriceTag({ amount, currency = 'NPR', size = 'md', suffix = 'per person' }: PriceTagProps) {
  return (
    <span className={`pkg-price ${SIZE_CLASS[size]}`}>
      <span className="pkg-price-prefix">From</span>
      <span className="pkg-price-amount">{currency} {amount.toLocaleString()}</span>
      {suffix ? <span className="pkg-price-suffix">{suffix}</span> : null}
    </span>
  );
}

export default PriceTag;
