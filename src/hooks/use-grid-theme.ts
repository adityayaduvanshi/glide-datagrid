import { useMemo } from 'react';
import { Theme } from '@glideapps/glide-data-grid';

export const useGridTheme = () => {
  return useMemo<Partial<Theme>>(
    () => ({
      accentColor: '#4C9AFF',
      accentLight: '#E9F2FF',
      textDark: '#1A1A1A',
      textMedium: '#666666',
      textLight: '#FFFFFF',
      bgCell: '#FFFFFF',
      bgCellMedium: '#F3F3F3',
      bgHeader: '#F9F9F9',
      bgHeaderHasFocus: '#E9F2FF',
      bgHeaderHovered: '#F3F3F3',
    }),
    []
  );
};
