import { useState, useCallback } from 'react';
import { GridColumn, GridColumnIcon } from '@glideapps/glide-data-grid';

export type ColumnType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'url'
  | 'image';

export interface CustomGridColumn extends Omit<GridColumn, 'id'> {
  title: string;
  type: ColumnType;
  id: string;
  width?: number;
  options?: string[];
}

export const useTableColumns = () => {
  const [columns, setColumns] = useState<CustomGridColumn[]>([
    {
      id: 'name',
      title: 'Name',
      type: 'text',
      icon: GridColumnIcon.HeaderString,
      width: 150,
    },
    { id: 'url', title: 'URL', type: 'url', icon: GridColumnIcon.HeaderUri },
    {
      id: 'logo',
      title: 'Logo',
      type: 'image',
      icon: GridColumnIcon.HeaderImage,
      width: 150,
    },
    {
      id: 'category',
      title: 'Category',
      type: 'multiselect',
      icon: GridColumnIcon.HeaderString,
      width: 150,
      options: [
        'Directory builder',
        'Website builder',
        'Social Media',
        'E-commerce',
      ],
    },
    {
      id: 'draft_hide',
      title: 'Draft / Hide',
      type: 'boolean',
      icon: GridColumnIcon.HeaderBoolean,
      width: 150,
    },
    {
      id: 'cover_image',
      title: 'Cover Image',
      type: 'image',
      icon: GridColumnIcon.HeaderImage,
      width: 150,
    },
    {
      id: 'description',
      title: 'Description',
      type: 'text',
      icon: GridColumnIcon.HeaderString,
      width: 150,
    },
    {
      id: 'tags',
      title: 'Tags',
      type: 'multiselect',
      icon: GridColumnIcon.HeaderArray,
      width: 150,
    },
    {
      id: 'featured',
      title: 'Featured',
      type: 'boolean',
      icon: GridColumnIcon.HeaderBoolean,
      width: 150,
    },
    {
      id: 'last_updated',
      title: 'Last Updated',
      type: 'date',
      icon: GridColumnIcon.HeaderDate,
      width: 150,
    },
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text');

  const addColumn = useCallback(() => {
    if (newColumnName) {
      const newColumn: CustomGridColumn = {
        id: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        title: newColumnName,
        width: 150,
        type: newColumnType,
        icon: GridColumnIcon.HeaderBoolean,
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
      setNewColumnType('text');
    }
  }, [newColumnName, newColumnType, columns]);

  return {
    columns,
    setColumns,
    newColumnName,
    setNewColumnName,
    newColumnType,
    setNewColumnType,
    addColumn,
  };
};
