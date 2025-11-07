export async function urlToHashId(url: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // 截短为前 10～12 字符即可，碰撞概率依然极低
  // 如果你的系统数据量 几十万级以内，SHA-256 截断 10-12 字符就非常安全。
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.slice(0, 12);
}
