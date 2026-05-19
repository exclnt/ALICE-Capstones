import { useState } from 'react';

export default function Greeting() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Selamat Pagi';
    } else if (hour >= 12 && hour < 15) {
      return 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
      return 'Selamat Sore';
    } else {
      return 'Selamat Malam';
    }
  });

  return greeting;
}
