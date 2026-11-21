export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("The image upload key is missing.");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.data?.url) {
    throw new Error("Image upload failed. Please try another image.");
  }
  return json.data.url as string;
}