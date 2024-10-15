import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import './Historicos.css';
import { ToastContainer, toast } from 'react-toastify';

const TextFilter = ({ column }) => {
  
  return (
    <input
      type="text"
      onChange={e => column.setFilter(e.target.value || undefined)}
      placeholder={`Buscar por ${column.id.replace(/_/g, ' ')}`}
      style={{ padding: '0px', marginBottom: '0px' }}
    />
  );
};

const columns = [
  
  { Header: 'Bot Proceso', accessor: 'nombre_bot', Filter: TextFilter },
  { Header: 'Servidor de ejecución', accessor: 'nombre_servidor', Filter: TextFilter },
  { Header: 'Usuario', accessor: 'nombre_usuario', Filter: TextFilter },
  { Header: 'Fecha de Ejecución', accessor: 'Fecha_ejecucion', Filter: TextFilter },
];

const Historicos = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`gestion-rpa-backend.vercel.app/api/ejecuciones-bot`);
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Históricos', 14, 16);
    doc.autoTable({
      head: [columns.map(col => col.Header)],
      body: data.map(row => columns.map(col => row[col.accessor])),
      startY: 10,
    });
    doc.save('historicos.pdf');
  };

  return (
    <div className="historicos-container">
      <h1 className="historicos-title">Históricos</h1>
      <div className="historicos-button-container">
        <button className="historicos-button-csv">
          <CSVLink data={data} filename={"historicos.csv"} style={{ color: 'white', textDecoration: 'none' }}>
            Descargar CSV
          </CSVLink>
        </button>
        <button className="historicos-button-pdf" onClick={generatePDF}>
          Descargar PDF
        </button>
      </div>
      <div className="historicos-table-wrapper">
        <table {...getTableProps()} className="historicos-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className="table-header">
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="historicos-th">
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
            <tr className="historicos-filter-row">
              {headerGroups[0].headers.map(column => (
                <th key={column.id}>
                  {column.canFilter ? column.render('Filter') : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="table-row">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="historicos-td">{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="historicos-pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'} Inicio</button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<' } Anterior</button>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>Siguiente {'>'}</button>
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>{'>>'} Última</button>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 15].map(size => (
            <option key={size} value={size}>
              Mostrar {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Historicos;
