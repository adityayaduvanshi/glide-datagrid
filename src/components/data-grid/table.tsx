import React, { useEffect } from 'react';
import '@glideapps/glide-data-grid/dist/index.css';
import styled from 'styled-components';
import { useTableData } from '../../hooks/use-table-data';
import { useTableColumns } from '../../hooks/use-table-columns';
import { useGridTheme } from '../../hooks/use-grid-theme';
import { ControlPanel } from './control-panel';
import { StyledDataEditor } from './styled-data-editor';
import ReactDOM from 'react-dom';

const TableContainer = styled.div`
  height: calc(100vh - 100px);
  width: 100%;
`;

const Table: React.FC = () => {
  const { data, setData, addRow } = useTableData();
  const {
    columns,
    setColumns,
    newColumnName,
    setNewColumnName,
    newColumnType,
    setNewColumnType,
    addColumn,
  } = useTableColumns();
  const gridTheme = useGridTheme();

  useEffect(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'portal';
    document.body.appendChild(portalRoot);

    return () => {
      document.body.removeChild(portalRoot);
    };
  }, []);

  return (
    <>
      <TableContainer>
        <ControlPanel
          newColumnName={newColumnName}
          setNewColumnName={setNewColumnName}
          newColumnType={newColumnType}
          setNewColumnType={setNewColumnType}
          addColumn={addColumn}
          addRow={addRow}
        />
        <div className="flex-grow relative">
          <StyledDataEditor
            data={data}
            setData={setData}
            columns={columns}
            theme={gridTheme}
          />
        </div>
      </TableContainer>

      {ReactDOM.createPortal(null, document.body)}
    </>
  );
};

export default Table;
