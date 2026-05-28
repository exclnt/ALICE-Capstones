import { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    const baseTitle = 'ALICE';
    document.title = `${title} | ${baseTitle}`;
  }, [title]);

  return null;
}
