import React, { useCallback, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  DataEditor,
  GridCell,
  Item,
  EditableGridCell,
  GridCellKind,
  Theme,
  CustomRenderer,
  GridColumn,
  GridSelection,
  CompactSelection,
} from '@glideapps/glide-data-grid';
import { CustomGridColumn } from '../../hooks/use-table-columns';
import { Button } from '../ui/button';

const useEventListener = (
  eventName: string,
  handler: (event: any) => void,
  element = window
) => {
  useEffect(() => {
    element.addEventListener(eventName, handler);
    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
};

const StyledEditor = styled(DataEditor)`
  width: 100%;
`;

interface StyledDataEditorProps {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  columns: CustomGridColumn[];
  theme: Partial<Theme>;
}

export const StyledDataEditor: React.FC<StyledDataEditorProps> = ({
  data,
  setData,
  columns,
  theme,
}) => {
  const [columnSizes, setColumnSizes] = useState(() =>
    columns.reduce((acc, col) => ({ ...acc, [col.id]: col.width }), {})
  );

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    console.log(`Resizing column: ${column.id} to ${newSize}`);
    setColumnSizes((prev) => ({ ...prev, [column.id as string]: newSize }));
  }, []);

  const columnsWithSizes = columns.map((col) => ({
    ...col,
    width: (columnSizes as Record<string, number>)[col.id] ?? col.width,
  }));

  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [data, searchValue]);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      if (
        !filteredData ||
        row >= filteredData.length ||
        col >= columns.length
      ) {
        return {
          kind: GridCellKind.Loading,
          allowOverlay: false,
        };
      }

      const item = filteredData[row];
      const column = columns[col];
      let cellData = item[column.id] || '';

      if (cellData === undefined || cellData === null) {
        return {
          kind: GridCellKind.Text,
          data: '',
          displayData: '',
          allowOverlay: true,
          readonly: false,
        };
      }

      switch (column.type) {
        case 'boolean':
          return {
            kind: GridCellKind.Boolean,
            data: Boolean(cellData),
            allowOverlay: false,
            readonly: false,
          };
        case 'number':
          return {
            kind: GridCellKind.Number,
            data: Number(cellData),
            displayData: cellData.toString(),
            allowOverlay: true,
            readonly: false,
          };
        // case 'date':
        //   return {
        //     kind: GridCellKind.Number,
        //     data: cellData ? new Date(cellData) : undefined,
        //     displayData: cellData
        //       ? new Date(cellData).toLocaleDateString()
        //       : '',
        //     allowOverlay: true,
        //     readonly: false,
        //   };
        case 'url':
          return {
            kind: GridCellKind.Uri,
            data: cellData.toString(),
            allowOverlay: true,
            readonly: false,
          };
        // case 'image':
        //   return {
        //     kind: GridCellKind.Image,
        //     data: [{ src: cellData.toString() }],
        //     allowOverlay: true,
        //     readonly: false,
        //   };
        case 'select':
        case 'multiselect':
          const bubbleData = Array.isArray(cellData) ? cellData : [cellData];
          return {
            kind: GridCellKind.Bubble,
            data: bubbleData,
            allowOverlay: true,
            // readonly: false,
          };
        default:
          return {
            kind: GridCellKind.Text,
            data: cellData.toString(),
            displayData: cellData.toString(),
            allowOverlay: true,
            readonly: false,
          };
      }
    },
    [filteredData, columns]
  );

  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: EditableGridCell): void => {
      if (!filteredData || row >= filteredData.length || col >= columns.length)
        return;

      const newData = [...data];
      const filteredIndex = data.indexOf(filteredData[row]);
      const column = columns[col];

      switch (newValue.kind) {
        case GridCellKind.Text:
        case GridCellKind.Number:
        case GridCellKind.Uri:
        case GridCellKind.Boolean:
        case GridCellKind.Image:
          newData[filteredIndex] = {
            ...newData[filteredIndex],
            [column.id]: newValue.data,
          };
          break;
        case GridCellKind.Custom:
          if (column.type === 'multiselect' || column.type === 'select') {
            newData[filteredIndex] = {
              ...newData[filteredIndex],
              [column.id]: newValue.data,
            };
          }
          break;
        default:
          console.warn(`Unhandled cell kind: ${newValue.kind}`);
      }

      setData(newData);
    },
    [filteredData, data, columns, setData]
  );

  const customRenderers = useCallback((): readonly CustomRenderer[] => {
    const bubbleRenderer: CustomRenderer<any> = {
      kind: GridCellKind.Bubble,
      isMatch: (cell: GridCell): cell is GridCell =>
        cell.kind === GridCellKind.Bubble,
      draw: (args, cell) => {
        // Default drawing behavior
        return false;
      },
      onClick: (args) => {
        // Custom click behavior if needed
        return false;
      },
      onPaste: (value, cellData) => {
        return {
          ...cellData,
          data: value.split(',').map((v) => v.trim()),
        };
      },
    };

    return [bubbleRenderer];
  }, []);
  useEventListener(
    'keydown',
    useCallback((event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyF') {
        setShowSearch((cv) => !cv);
        event.stopPropagation();
        event.preventDefault();
      }
    }, [])
  );

  const [gridSelection, setGridSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  const onSelectionChanged = useCallback((newSelection: GridSelection) => {
    setGridSelection(newSelection);
  }, []);

  const getSelectedRowsData = useCallback(() => {
    const selectedIndices = gridSelection.rows.toArray();
    return selectedIndices.map((index) => filteredData[index]);
  }, [gridSelection, filteredData]);

  const handleSelectedRowsAction = useCallback(() => {
    const selectedData = getSelectedRowsData();
    console.log('Selected rows data:', selectedData);
    // Perform any action with the selected data here
  }, [getSelectedRowsData]);

  if (!data || !columns) {
    return null; // or return a loading indicator
  }

  return (
    <>
      {/* <Button
        onClick={handleSelectedRowsAction}
        disabled={gridSelection.rows.length === 0}
      >
        Action on Selected Rows
      </Button> */}
      <StyledEditor
        searchResults={[]}
        getCellsForSelection={true}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        showSearch={showSearch}
        onSearchClose={() => {
          setShowSearch(false);
          setSearchValue('');
        }}
        getCellContent={getCellContent}
        columns={columnsWithSizes}
        rows={filteredData.length}
        onCellEdited={onCellEdited}
        rowMarkers="both"
        editOnType
        smoothScrollY={true}
        height={filteredData.length * 35 + 40}
        width="100%"
        theme={theme}
        customRenderers={customRenderers()}
        onColumnResize={onColumnResize}
        rightElement={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.alert('Add a column!')}
          >
            +
          </Button>
        }
        rightElementProps={{
          fill: false,
          sticky: false,
        }}
        gridSelection={gridSelection}
        onGridSelectionChange={onSelectionChanged}
        rowSelect="multi"
      />
    </>
  );
};