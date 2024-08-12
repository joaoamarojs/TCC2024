import React from 'react';

const Table = ({ headers, data, actions }) => {
  return (
    <table className="table">
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
        {data.map((row, rowIndex) => (
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
  );
};

export default Table;
