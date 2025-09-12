<script>
  let uploading = false;
  let msg = '';

  async function handleSubmit(e) {
    uploading = true;
    msg = '';
    const body = new FormData(e.target);
    try {
const r = await fetch('/uploads', { method:'POST', body });
      const j = await r.json();
      msg = j.ok ? `Saved as ${j.name}` : 'Upload failed';
    } catch (err) {
      msg = err.message;
    } finally {
      uploading = false;
    }
  }
</script>
<form on:submit|preventDefault={handleSubmit}>
  <input type="file" name="file" required />
  <button type="submit" disabled={uploading}>
    {uploading ? 'Uploading…' : 'Upload'}
  </button>
</form>
<p>{msg}</p>

<img src="/uploads/56c3a1a-ef8b-4f9b-8d16-97904711e7f9-cropped-Fixed-White-Pink-ByMeklit-2025-Logo-Update-1.webp" alt="No Hello">

