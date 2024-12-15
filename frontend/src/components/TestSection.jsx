import { TestCard } from './TestCard';

export function TestSection({ title, tests, isOwner, onDelete, emptyMessage }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test, i) => (
            <TestCard
              key={`${isOwner ? 'my' : 'other'}-${i}-${test.id}`}
              test={test}
              isOwner={isOwner}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
