import { notFound } from 'next/navigation';
import { getAllPackageSlugs, getPackageBySlug, getRelatedPackages } from '@/lib/packages';
import PackageDetailView from '@/components/package/package-detail-view';

export async function generateStaticParams() {
  const slugs = await getAllPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getPackageBySlug(slug);
  if (!detail) return {};
  return {
    title: detail.name,
    description: detail.description,
    alternates: { canonical: `/packages/${slug}` },
  };
}

async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getPackageBySlug(slug);
  if (!detail) notFound();

  const related = await getRelatedPackages(detail);

  return <PackageDetailView detail={detail} related={related} />;
}

export default PackagePage;
