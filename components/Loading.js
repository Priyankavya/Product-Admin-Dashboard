export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="text-gray-600">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

        <p>{text}</p>
      </div>
    </div>
  );
}