import React, { useState } from 'react';

const Table = ({ headers, data, actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnToSearch, setColumnToSearch] = useState(headers[0]?.key || '');

  const filteredData = data.filter(row =>
    columnToSearch !== 'actions' &&
    row[columnToSearch].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page <= totalPages && page > 0) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div style={{ overflow: 'hidden', width: '100%', padding:'1.25rem' }}>
      <div className="row mb-2">
        <div className="col-sm-2">
          <select className="form-select" onChange={(e) => setColumnToSearch(e.target.value)} value={columnToSearch}>
          {headers
            .filter(header => header.key !== 'actions')
            .map((header) => (
              <option key={header.key} value={header.key}>{header.label}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-8">
          <input
            className="form-control" 
            type="text"
            placeholder={`Pesquisar por ${headers.find(header => header.key === columnToSearch)?.label}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-sm-2" style={{height: ""}}>
          <select className="form-select " onChange={handleRowsPerPageChange} value={rowsPerPage}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
                {headers.map((header, index) => (
                  <th key={index} className={header.className || ''}>
                    {header.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className={header.className || ''}>
                    {header.key === 'actions' ? (
                      <div className="table-action">
                        {actions.map((action, actionIndex) => (
                          <a
                            key={actionIndex}
                            href="#"
                            onClick={() => action.func(row)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`feather feather-${action.icon} align-middle`}
                            >
                              {action.icon === 'edit-2' && (
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              )}
                              {action.icon === 'trash' && (
                                <>
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </>
                              )}
                            </svg>
                          </a>
                        ))}
                      </div>
                    ) : (
                      row[header.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <nav aria-label="Page navigation example">
          <ul className="pagination pagination-sm">
            <li className="page-item">
              <a className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                <i className="fas fa-angle-left"></i>
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li className="page-item" key={index}>
                <a className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                <i className="fas fa-angle-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Table;
