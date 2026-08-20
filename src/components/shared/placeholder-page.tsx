export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-paper">{title}</h1>
      <p className="mt-2 text-mist">{description}</p>
    </section>
  );
}
