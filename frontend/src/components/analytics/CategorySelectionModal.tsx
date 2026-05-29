import { AnimatePresence, motion } from 'framer-motion';
import { useCategories } from '../../hooks/useCategoriesHook';

interface CategorySelectionModalProp {
  isSelecting: boolean;
  toggleSelecting: () => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export function CategorySelectionModal({
  isSelecting,
  toggleSelecting,
  selectedCategories,
  setSelectedCategories,
}: CategorySelectionModalProp) {
  const { data } = useCategories();

  return (
    <AnimatePresence>
      {isSelecting && (
        <section className={`fixed inset-0 z-30  flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/10"
            onClick={toggleSelecting}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-bg-main rounded-xl w-80 md:w-120  relative ring-1 ring-primary/25/50`}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">Pilih Kategori</h2>
                <button
                  onClick={toggleSelecting}
                  className="ml-2 bg-text-main text-bg-main px-3 py-1 rounded-xl"
                >
                  Close
                </button>
              </div>

              {data?.categories.map((category, index) => (
                <div key={category} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`category-${index}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category));
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                    className="mr-2 "
                  />
                  <label htmlFor={`category-${index}`}>{category}</label>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
}
