import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-black dark:text-white text-sm font-medium leading-normal">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

