import PropTypes from 'prop-types';
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Spinner from '../Spinner/Spinner';

function DataTable({ columns, data = [], isLoading, intent }) {
  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
  });

  return (
      <div className="rounded-md border overflow-hidden">
          {/* Display intent */}
          {intent && <h2 className="font-bold mb-4 rounded bg-green-300 p-3">Intent: {intent}</h2>} 
          <div className="h-96 overflow-y-auto">
              <Table>
                  <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                  <TableHead key={header.id}>
                                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                  </TableHead>
                              ))}
                          </TableRow>
                      ))}
                  </TableHeader>
                  <TableBody>
                      {isLoading ? (
                          <TableRow>
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                  <div className="flex justify-center items-center">
                                      <Spinner />
                                  </div>
                              </TableCell>
                          </TableRow>
                      ) : table.getRowModel().rows.length > 0 ? (
                          table.getRowModel().rows.map((row) => (
                              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                  {row.getVisibleCells().map((cell) => (
                                      <TableCell key={cell.id}>
                                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </TableCell>
                                  ))}
                              </TableRow>
                          ))
                      ) : (
                          <TableRow>
                              <TableCell colSpan={columns.length} className="h-24 text-center">
                                  No results.
                              </TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </div>
      </div>
  );
}


DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool, 
  intent: PropTypes.string
};

export default DataTable;
