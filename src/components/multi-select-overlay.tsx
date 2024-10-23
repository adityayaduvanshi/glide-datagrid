import React, { useState } from 'react';
import { GridCell, GridCellKind } from '@glideapps/glide-data-grid';

interface MultiselectOverlayProps {
  options: string[];
  selected: string[];
  onFinishedEditing: (newValue: GridCell) => void;
}

export const MultiselectOverlay: React.FC<MultiselectOverlayProps> = ({
  options,
  selected,
  onFinishedEditing,
}) => {
  const [selectedValues, setSelectedValues] = useState(selected);

  const handleChange = (option: string) => {
    const newSelected = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelected);
  };

  const handleClose = () => {
    onFinishedEditing({
      kind: GridCellKind.Custom,
      data: {
        kind: 'multiselect-cell',
        selected: selectedValues,
        options,
      },
      allowOverlay: true,
      copyData: selectedValues.join(', '),
    });
  };

  return (
    <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
      {options.map((option) => (
        <div key={option}>
          <label>
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleChange(option)}
            />
            {option}
          </label>
        </div>
      ))}
      <button onClick={handleClose}>Done</button>
    </div>
  );
};
