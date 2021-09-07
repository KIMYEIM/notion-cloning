export const API_END_POINT = 'https://kdt.roto.codes';

export const request = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'yeim',
      },
    });

    if (res.ok) {
      return await res.json();
    }

    return undefined;
  } catch (e) {
    alert(e.message);
  }
};
