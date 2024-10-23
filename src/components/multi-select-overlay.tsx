import React, { useState } from 'react';
import styled from 'styled-components';

interface MultiselectOverlayProps {
  options: string[];
  selected: string[];
  onFinishedEditing: (newValue: string[]) => void;
}

const OverlayContainer = styled.div`
  background: white;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const OptionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

const OptionChip = styled.div<{ isSelected: boolean }>`
  padding: 2px 8px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  font-size: 12px;
  background-color: ${(props) => (props.isSelected ? '#e0e7ff' : '#f3f4f6')};
  color: ${(props) => (props.isSelected ? '#4338ca' : '#374151')};
  border: 1px solid ${(props) => (props.isSelected ? '#818cf8' : '#d1d5db')};

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#ddd6fe' : '#e5e7eb')};
  }
`;

const Button = styled.button`
  padding: 4px 8px;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;

  &:hover {
    background-color: #e5e7eb;
  }
`;

export const MultiselectOverlay = React.memo<MultiselectOverlayProps>(
  ({ options, selected, onFinishedEditing }) => {
    const [selectedValues, setSelectedValues] = useState(selected);

    const handleChange = (option: string) => {
      setSelectedValues((prev) =>
        prev.includes(option)
          ? prev.filter((v) => v !== option)
          : [...prev, option]
      );
    };

    const handleClose = () => {
      onFinishedEditing(selectedValues);
    };

    return (
      <OverlayContainer>
        <OptionList>
          {options.map((option) => (
            <OptionChip
              key={option}
              isSelected={selectedValues.includes(option)}
              onClick={() => handleChange(option)}
            >
              {option}
            </OptionChip>
          ))}
        </OptionList>
        <Button onClick={handleClose}>Done</Button>
      </OverlayContainer>
    );
  }
);
