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
  GridDragEventArgs,
} from '@glideapps/glide-data-grid';
import { CustomGridColumn } from '../../hooks/use-table-columns';
import { Button } from '../ui/button';
import { Sheet, SheetContent } from '../ui/sheet';
import { MultiselectOverlay } from '../multi-select-overlay';

type MultiselectCellData = {
  kind: 'multiselect-cell';
  options: string[];
  selected: string[];
  allowCreation: boolean;
};

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

const ScrollableContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  /* Webkit browsers like Chrome, Safari */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
`;
const StyledEditor = styled(DataEditor)`
  width: 100%;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  overflow: hidden;
  font-family: ${(props) => props.theme.fontFamily};
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
    // console.log(`Resizing column: ${column.id} to ${newSize}`);
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
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

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
      if (column.type === 'button') {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: false,
          copyData: 'View Details',
          data: {
            kind: 'button-cell',
            onClick: () => {
              setSelectedRow(item);
              console.log('clicked', item);
            },
          },
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

        case 'multiselect':
          const options = column.options || [];
          const selectedValues = item[column.id] || [];
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: selectedValues.join(', '),
            data: {
              kind: 'multiselect-cell',
              options: options,
              selected: selectedValues,
              allowCreation: true,
            } as MultiselectCellData,
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
      const newData = [...data];
      const filteredIndex = filteredData.findIndex(
        (item) => item.id === newData[row].id
      );
      const column = columns[col];

      if (
        column.type === 'multiselect' &&
        newValue.kind === GridCellKind.Custom &&
        (newValue.data as MultiselectCellData).kind === 'multiselect-cell'
      ) {
        const multiselectData = newValue.data as MultiselectCellData;
        newData[filteredIndex] = {
          ...newData[filteredIndex],
          [column.id]: multiselectData.selected,
        };
      } else {
        // Handle other cell types
        // ...
      }

      setData(newData);
    },
    [data, filteredData, columns, setData]
  );

  const customRenderers = useCallback((): readonly CustomRenderer[] => {
    const buttonRenderer: CustomRenderer<any> = {
      kind: GridCellKind.Custom,
      isMatch: (cell: GridCell): cell is GridCell =>
        (cell as any)?.data?.kind === 'button-cell',
      draw: (args, cell) => {
        const { ctx, theme, rect } = args;
        const { x, y, width, height } = rect;

        ctx.fillStyle = theme.bgCell;
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = theme.textDark;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('View Details', x + width / 2, y + height / 2);

        return true;
      },
      onClick: (args) => {
        const cell = args.cell as any;
        if (cell.data?.onClick) {
          cell.data.onClick();
        }
        return true;
      },
    };

    const multiselectRenderer: CustomRenderer<any> = {
      kind: GridCellKind.Custom,
      isMatch: (cell: any): cell is any =>
        cell.kind === GridCellKind.Custom &&
        (cell.data as any).kind === 'multiselect-cell',
      draw: (args, cell) => {
        const { ctx, theme, rect } = args;
        const { x, y, width, height } = rect;
        const { selected } = cell.data;

        // Draw background
        ctx.fillStyle = theme.bgCell;
        ctx.fillRect(x, y, width, height);

        // Draw tags
        const padding = 4;
        const tagHeight = height - 2 * padding;
        const tagSpacing = 4;
        let currentX = x + padding;

        ctx.font = `${theme.baseFontStyle} ${theme.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        selected.forEach((value: string, index: number) => {
          const tagWidth = ctx.measureText(value).width + 10;

          if (currentX + tagWidth > x + width - padding) {
            // If there's not enough space, draw ellipsis and stop
            ctx.fillStyle = theme.textMedium;
            ctx.fillText('...', currentX, y + height / 2);
            return;
          }

          // Draw tag background
          ctx.fillStyle = theme.bgBubble;
          ctx.beginPath();
          ctx.roundRect(currentX, y + padding, tagWidth, tagHeight, 4);
          ctx.fill();

          // Draw tag text
          ctx.fillStyle = theme.textDark;
          ctx.fillText(value, currentX + 5, y + height / 2);

          currentX += tagWidth + tagSpacing;
        });

        return true;
      },
      onClick: () => true,
      provideEditor: (cell) => {
        console.log('Providing editor for multiselect cell', cell);
        return (props) => (
          <MultiselectOverlay
            options={cell.data.options}
            selected={cell.data.selected}
            onFinishedEditing={(newValue) => {
              console.log('Finished editing multiselect', newValue);
              props.onFinishedEditing({
                ...cell,
                data: {
                  ...cell.data,
                  selected: newValue,
                },
              });
            }}
            // allowCreation={cell.data.allowCreation}
          />
        );
      },
    };

    const renderers = [buttonRenderer, multiselectRenderer];

    return renderers;
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
    // console.log('Selected rows data:', selectedData);
    // Perform any action with the selected data here
  }, [getSelectedRowsData]);

  const [dragRow, setDragRow] = useState<number | undefined>(undefined);

  const onRowMoved = useCallback(
    (startIndex: number, endIndex: number) => {
      const newData = [...data];
      const [movedItem] = newData.splice(startIndex, 1);
      newData.splice(endIndex, 0, movedItem);
      setData(newData);
    },
    [data, setData]
  );

  const onDragStart = useCallback((args: GridDragEventArgs) => {
    if (args.location) {
      setDragRow(args.location[1]);
    }
  }, []);

  const onDragEnd = useCallback(
    (args: GridDragEventArgs) => {
      if (dragRow !== undefined && args.location) {
        const endRow = args.location[1];
        onRowMoved(dragRow, endRow);
      }
      setDragRow(undefined);
    },
    [dragRow, onRowMoved]
  );

  if (!data || !columns) {
    return null;
  }

  return (
    <>
      <StyledEditor
        searchResults={[]}
        smoothScrollX={true}
        smoothScrollY={true}
        getCellsForSelection={true}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        showSearch={showSearch}
        onSearchClose={() => {
          setShowSearch(false);
          setSearchValue('');
        }}
        rowHeight={40}
        headerHeight={48}
        rowMarkerWidth={40}
        getCellContent={getCellContent}
        columns={columnsWithSizes}
        rows={filteredData.length}
        onCellEdited={onCellEdited}
        rowMarkers="both"
        editOnType
        verticalBorder={true}
        height={filteredData.length * 35 + 100}
        width="100%"
        theme={theme}
        customRenderers={customRenderers()}
        onColumnResize={onColumnResize}
        onCellActivated={(cell) => {
          console.log('Cell activated:', cell);
          const [col, row] = cell;
          const column = columns[col];
          console.log('Column type:', column.type);
          if (column.type === 'multiselect' || column.type === 'select') {
            console.log('Activating multiselect/select cell');
            return true; // This will open the overlay for multiselect/select cells
          }
          return false; // Don't open overlay for other cell types
        }}
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
        onRowMoved={onRowMoved}
        onDragStart={onDragStart}
        // onDragEnd={onDragEnd}

        rowMarkerStartIndex={1}
        onHeaderMenuClick={() => {}}
      />
      <Sheet open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <SheetContent>SS</SheetContent>
      </Sheet>
    </>
  );
};
