import Link from 'next/link';

export function Logo({ href = '/', inverse = false }: { href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className={`logo ${inverse ? 'logo-inverse' : ''}`}>
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>TravelDesk</span>
    </Link>
  );
}
