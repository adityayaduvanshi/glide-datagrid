import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '@glideapps/glide-data-grid/dist/index.css';
import {
  DataEditor,
  GridCell,
  GridColumn,
  Item,
  EditableGridCell,
  GridSelection,
  GridMouseEventArgs,
  GridCellKind,
  Theme,
} from '@glideapps/glide-data-grid';
import styled from 'styled-components';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ReactDOM from 'react-dom';

const StyledDataEditor = styled(DataEditor)`
  /* height: 500px; */
  width: 100%;
`;
const ControlPanel = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

interface MarketData {
  id: number;
  [key: string]: any;
}
const Table = () => {
  const [data, setData] = useState<MarketData[]>([
    {
      id: 1,
      Name: 'Google',
      URL: 'google.com',
      Logo: 'https://example.com/google-logo.png',
      Category: 'Directory builder',
      'Draft / Hide': false,
      'Cover Image': 'https://example.com/google-cover.jpg',
      Description: 'Search engine and technology company',
      Tags: ['search', 'technology', 'advertising'],
      Featured: true,
      'Last Updated': '2023-10-15T10:30:00Z',
    },
    {
      id: 2,
      Name: 'Basefront',
      URL: 'basefront.com',
      Logo: 'https://example.com/basefront-logo.png',
      Category: 'Directory builder',
      'Draft / Hide': true,
      'Cover Image': 'https://example.com/basefront-cover.jpg',
      Description: 'No-code directory builder',
      Tags: ['no-code', 'directory', 'builder'],
      Featured: false,
      'Last Updated': '2023-10-14T14:45:00Z',
    },
    {
      id: 3,
      Name: 'Dirfast - Maksim',
      URL: 'dirfast.com',
      Logo: 'https://example.com/dirfast-logo.png',
      Category: 'Directory builder',
      'Draft / Hide': false,
      'Cover Image': 'https://example.com/dirfast-cover.jpg',
      Description: 'Fast directory creation tool',
      Tags: ['directory', 'fast', 'tool'],
      Featured: true,
      'Last Updated': '2023-10-13T09:15:00Z',
    },
  ]);
  const [columns, setColumns] = useState<GridColumn[]>([
    { title: 'Name', width: 200 },
    { title: 'URL', width: 200 },
    { title: 'Logo', width: 100 },
    { title: 'Category', width: 150 },
    { title: 'Draft / Hide', width: 120 },
    { title: 'Cover Image', width: 120 },
    { title: 'Description', width: 200 },
    { title: 'Tags', width: 150 },
    { title: 'Description', width: 200 },
    { title: 'Featured', width: 100 },
    { title: 'Last Updated', width: 150 },
  ]);
  const [newColumnName, setNewColumnName] = useState('');

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const item = data[row];
      const column = columns[col];
      let cellData = item[column.title] || '';

      // Special handling for certain column types
      if (column.title === 'Tags' && Array.isArray(cellData)) {
        cellData = cellData.join(', ');
      } else if (
        column.title === 'Draft / Hide' ||
        column.title === 'Featured'
      ) {
        cellData = cellData ? 'Yes' : 'No';
      } else if (column.title === 'Last Updated') {
        cellData = new Date(cellData).toLocaleString();
      }

      return {
        kind: GridCellKind.Text,
        data: cellData.toString(),
        allowOverlay: true,
        readonly: false,
        displayData: cellData.toString(),
      };
    },
    [data, columns]
  );
  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: EditableGridCell): void => {
      const newData = [...data];
      const column = columns[col];
      newData[row] = { ...newData[row], [column.title]: newValue.data };
      setData(newData);
    },
    [data, columns, setData]
  );
  const addColumn = () => {
    if (newColumnName) {
      setColumns([...columns, { title: newColumnName, width: 150 }]);
      setNewColumnName('');
    }
  };

  const addRow = () => {
    const newRow: MarketData = { id: data.length + 1 };
    columns.forEach((column) => {
      newRow[column.title] = '';
    });
    setData([...data, newRow]);
  };
  useEffect(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal';
    document.body.appendChild(portalRoot);

    return () => {
      document.body.removeChild(portalRoot);
    };
  }, []);
  const gridTheme = useMemo<Partial<Theme>>(
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
  return (
    <>
      <div className="h-[calc(100vh-100px)] w-full">
        <ControlPanel>
          <Input
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="New column name"
          />
          <Button onClick={addColumn}>Add Column</Button>
          <Button onClick={addRow}>Add Row</Button>
        </ControlPanel>
        {/* <div className="h-full w-full"> */}
        <div className="flex-grow relative">
          <StyledDataEditor
            getCellContent={getCellContent}
            columns={columns}
            rows={data.length}
            onCellEdited={onCellEdited}
            gridSelection={undefined}
            onGridSelectionChange={undefined}
            rowMarkers="number"
            editOnType
            smoothScrollY={true}
            height={data.length * 35 + 40} // Adjust the multiplier (35) for row height
            width="100%"
          />
        </div>
        {/* </div> */}
      </div>
      {ReactDOM.createPortal(null, document.body)}
    </>
  );
};

export default Table;
