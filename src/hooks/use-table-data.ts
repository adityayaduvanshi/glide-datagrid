import { useState, useCallback } from 'react';

export const useTableData = () => {
  const [data, setData] = useState<any[]>([
    {
      id: 1,
      name: 'Google',
      url: 'google.com',
      logo: 'https://example.com/google-logo.png',
      category: ['Directory builder'],
      draft_hide: false,
      cover_image: 'https://example.com/google-cover.jpg',
      description: 'Search engine and technology company',
      tags: ['search', 'technology', 'advertising'],
      featured: true,
      last_updated: '2023-10-15T10:30:00Z',
    },
    {
      id: 2,
      name: 'Facebook',
      url: 'facebook.com',
      logo: 'https://example.com/facebook-logo.png',
      category: ['Social Media'],
      draft_hide: true,
      cover_image: 'https://example.com/facebook-cover.jpg',
      description: 'Social networking platform',
      tags: ['social', 'networking', 'advertising'],
      featured: false,
      last_updated: '2023-10-14T09:15:00Z',
    },
    {
      id: 3,
      name: 'Amazon',
      url: 'amazon.com',
      logo: 'https://example.com/amazon-logo.png',
      category: ['E-commerce'],
      draft_hide: false,
      cover_image: 'https://example.com/amazon-cover.jpg',
      description: 'Online retail and cloud computing',
      tags: ['shopping', 'cloud', 'technology'],
      featured: true,
      last_updated: '2023-10-13T14:20:00Z',
    },
    // {
    //   id: 2,
    //   Name: 'Basefront',
    //   URL: 'basefront.com',
    //   Logo: 'https://example.com/basefront-logo.png',
    //   Category: 'Directory builder',
    //   'Draft / Hide': true,
    //   'Cover Image': 'https://example.com/basefront-cover.jpg',
    //   Description: 'No-code directory builder',
    //   Tags: ['no-code', 'directory', 'builder'],
    //   Featured: false,
    //   'Last Updated': '2023-10-14T14:45:00Z',
    // },
    // {
    //   id: 3,
    //   Name: 'Dirfast - Maksim',
    //   URL: 'dirfast.com',
    //   Logo: 'https://example.com/dirfast-logo.png',
    //   Category: 'Directory builder',
    //   'Draft / Hide': false,
    //   'Cover Image': 'https://example.com/dirfast-cover.jpg',
    //   Description: 'Fast directory creation tool',
    //   Tags: ['directory', 'fast', 'tool'],
    //   Featured: true,
    //   'Last Updated': '2023-10-13T09:15:00Z',
    // },
  ]);

  const addRow = useCallback(() => {
    const newRow: any = { id: data.length + 1 };
    setData([...data, newRow]);
  }, [data]);

  return { data, setData, addRow };
};
