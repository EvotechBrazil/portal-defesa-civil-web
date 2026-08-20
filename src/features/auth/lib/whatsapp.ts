export function digitsOf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function formatWhatsapp(digits: string): string {
  return digits;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a foto."));
    reader.readAsDataURL(file);
  });
}
