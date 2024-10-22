import React from 'react';
import styled from 'styled-components';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import { ColumnType } from '../../hooks/use-table-data';
// import { Select } from '../ui/select';

const StyledControlPanel = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

interface ControlPanelProps {
  newColumnName: string;
  setNewColumnName: (name: string) => void;
  newColumnType: any;
  setNewColumnType: (type: any) => void;
  addColumn: () => void;
  addRow: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  newColumnName,
  setNewColumnName,
  newColumnType,
  setNewColumnType,
  addColumn,
  addRow,
}) => (
  <StyledControlPanel>
    <Input
      value={newColumnName}
      onChange={(e) => setNewColumnName(e.target.value)}
      placeholder="New column name"
    />
    <select
      value={newColumnType}
      onChange={(e) => setNewColumnType(e.target.value as any)}
    >
      <option value="text">Text</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
      <option value="date">Date</option>
      <option value="select">Select</option>
      <option value="multiselect">Multi-select</option>
      <option value="url">URL</option>
      <option value="image">Image</option>
    </select>
    <Button onClick={addColumn}>Add Column</Button>
    <Button onClick={addRow}>Add Row</Button>
  </StyledControlPanel>
);
