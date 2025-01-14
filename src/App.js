import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [sheetId, setSheetId] = useState('default');
    const [cells, setCells] = useState({});
    const [selectedRange, setSelectedRange] = useState(null);
    const [formula, setFormula] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/sheet/${sheetId}`)
            .then(response => setCells(response.data.cells))
            .catch(error => console.error('Error fetching sheet:', error));
    }, [sheetId]);

    const handleInputChange = (row, col, value) => {
        setCells(prev => ({
            ...prev,
            [`${row},${col}`]: value,
        }));
    };

    const handleFormulaApply = () => {
      if (!selectedRange) return;
      const [startRow, startCol, endRow, endCol] = selectedRange;
      let result = 0;
      const values = [];

      for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
              const key = `${r},${c}`;
              const value = parseFloat(cells[key]) || 0;
              values.push(value);
          }
      }

      switch (formula) {
          case 'SUM':
              result = values.reduce((acc, val) => acc + val, 0);
              break;
          case 'AVERAGE':
              result = values.reduce((acc, val) => acc + val, 0) / values.length;
              break;
          case 'MAX':
              result = Math.max(...values);
              break;
          case 'MIN':
              result = Math.min(...values);
              break;
          case 'COUNT':
              result = values.length;
              break;
          default:
              break;
      }

      setCells(prev => ({
          ...prev,
          [`${startRow},${startCol}`]: result,
      }));
  };

  const saveSheet = () => {
      axios.post(`http://localhost:5000/api/sheet/${sheetId}`, { cells })
          .then(response => alert(response.data.message))
          .catch(error => console.error('Error saving sheet:', error));
  };

  const renderGrid = () => {
    const rows = 10, cols = 10;
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const key = `${r},${c}`;
            row.push(
                <input
                    key={key}
                    value={cells[key] || ''}
                    onChange={e => handleInputChange(r, c, e.target.value)}
                    className="cell"
                    placeholder=" "
                />
            );
        }
        grid.push(
            <div className="row" key={r}>
                {row}
            </div>
        );
    }
    return grid;
};
return (
  <div className="App">
      <header className="App-header">
          <h1>Google Sheets Clone</h1>
          <button onClick={saveSheet}>Save Sheet</button>
          <div>
              <select value={formula} onChange={e => setFormula(e.target.value)}>
                  <option value="">Select Formula</option>
                  <option value="SUM">SUM</option>
                  <option value="AVERAGE">AVERAGE</option>
                  <option value="MAX">MAX</option>
                  <option value="MIN">MIN</option>
                  <option value="COUNT">COUNT</option>
              </select>
              <button onClick={handleFormulaApply}>Apply Formula</button>
          </div>
      </header>
      <main>{renderGrid()}</main>
  </div>
);
};

export default App;
