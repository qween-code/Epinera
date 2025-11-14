// This component now accepts a list of categories as a prop,
// making it a reusable and dynamic UI component.

type Category = {
  name: string;
  slug: string;
};

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex-shrink-0 px-6 py-3 bg-gray-700 rounded-full text-white hover:bg-sky-600 transition-colors"
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}
