export async function retry(fn, retries = 3) {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const delay = 2 ** attempt * 100;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      if (attempt === retries) throw err;
    }
  }
}