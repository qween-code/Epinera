import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function createCategory(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const parentId = formData.get('parentId') as string;
  const slug = name.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  await supabase.from('categories').insert({
    name,
    slug,
    parent_id: parentId || null,
  });
  revalidatePath('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const id = formData.get('id') as string;
  await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/admin/categories');
}

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  const parentCategories = (categories || []).filter((c) => !c.parent_id);
  const childCategories = (categories || []).filter((c) => c.parent_id);

  return (
    <div>
      <h1 className="text-2xl font-heading mb-8"><span className="text-gradient">Kategori Yönetimi</span></h1>

      {/* Add Category Form */}
      <div className="neo rounded-xl p-6 mb-8">
        <h2 className="terminal-label mb-4">// YENİ KATEGORİ EKLE</h2>
        <form action={createCategory} className="flex flex-col sm:flex-row gap-4">
          <input type="text" name="name" required placeholder="Kategori adı" className="input flex-1" />
          <select name="parentId" className="input sm:w-48">
            <option value="">Ana Kategori</option>
            {parentCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-success whitespace-nowrap">+ Ekle</button>
        </form>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {parentCategories.map((parent) => {
          const children = childCategories.filter((c) => c.parent_id === parent.id);
          return (
            <div key={parent.id} className="neo-flat rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{parent.name}</h3>
                  <p className="text-xs text-[var(--text-ghost)] font-mono-accent">/{parent.slug}</p>
                </div>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={parent.id} />
                  <button type="submit" className="btn btn-sm btn-danger">Sil</button>
                </form>
              </div>
              {children.length > 0 && (
                <div className="mt-3 ml-6 space-y-2">
                  {children.map((child) => (
                    <div key={child.id} className="flex justify-between items-center neo-inset-sm rounded-lg p-3">
                      <div>
                        <span className="text-sm text-[var(--text-secondary)]">{child.name}</span>
                        <span className="text-xs text-[var(--text-ghost)] ml-2 font-mono-accent">/{child.slug}</span>
                      </div>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={child.id} />
                        <button type="submit" className="btn btn-sm btn-danger">Sil</button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {(!categories || categories.length === 0) && (
          <div className="neo rounded-2xl p-14 text-center">
            <h2 className="text-xl font-heading mb-2">Henüz Kategori Yok</h2>
            <p className="text-sm text-[var(--text-tertiary)]">Yukarıdaki formu kullanarak kategori ekleyin</p>
          </div>
        )}
      </div>
    </div>
  );
}
