import React from 'react';
import { 
  makeStyles, 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableHeaderCell, 
  TableRow,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { MoreHorizontal24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';

// Define types for the table data and columns
interface TotalShells {
  approved: number;
  defect: number;
}

interface ShiftData {
  slNo: number;
  shiftNo: string;
  date: string;
  totalAnalyze: number;
  totalShells: TotalShells;
  [key: string]: any; // Allow string indexing
}

interface SubColumn {
  columnKey: string;
  label: string;
}

interface Column {
  columnKey: string;
  label: string;
  className?: string;
  subColumns?: SubColumn[];
}

interface ShiftTableProps {
  data: ShiftData[];
  columns: Column[];
  onView?: (item: ShiftData) => void;
  onEdit?: (item: ShiftData) => void;
  onReAnalyze?: (item: ShiftData) => void;
}

const useStyles = makeStyles({
  table: {
    border: '1px solid #e0e0e0',
    borderCollapse: 'collapse',
    boxShadow: 'none',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    border: '1px solid #e0e0e0',
  },
  tableCell: {
    textAlign: 'center',
    border: '1px solid #e0e0e0',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  smallColumn: {
    width: '80px',
  },
  actionColumn: {
    width: '100px',
  },
});

const ShiftTable: React.FC<ShiftTableProps> = ({ 
  data, 
  columns,
  onView,
  onEdit,
  onReAnalyze
}) => {
  const styles = useStyles();

  return (
    <Table 
      aria-label="Shift data table" 
      style={{minWidth: '510px'}}
      className={styles.table}
    >
      <TableHeader>
        <TableRow className={styles.tableRow}>
          {columns.map(col =>
            col.subColumns ? (
              <TableHeaderCell
                key={col.columnKey}
                className={styles.tableHeader}
                colSpan={col.subColumns.length}>
                {col.label}
              </TableHeaderCell>
            ) : (
              <TableHeaderCell
                key={col.columnKey}
                className={col.className === 'smallColumn' 
                  ? `${styles.tableHeader} ${styles.smallColumn}` 
                  : col.className === 'actionColumn'
                  ? `${styles.tableHeader} ${styles.actionColumn}`
                  : styles.tableHeader}
                rowSpan={2}>
                {col.label}
              </TableHeaderCell>
            ),
          )}
        </TableRow>
        <TableRow className={styles.tableRow}>
          {columns.map(col =>
            col.subColumns
              ? col.subColumns.map(subCol => (
                  <TableHeaderCell
                    key={subCol.columnKey}
                    className={styles.tableHeader}>
                    {subCol.label}
                  </TableHeaderCell>
                ))
              : null,
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} className={styles.tableRow}>
            {columns.map(col =>
              col.columnKey === 'actions' ? (
                <TableCell
                  key={col.columnKey}
                  className={`${styles.tableCell} ${styles.actionColumn}`}>
                  <Link to={`/workspace/${row.shiftNo}`} style={{marginRight: '1vw'}}>
                    View
                  </Link>
                  <Menu>
                    <MenuTrigger disableButtonEnhancement>
                      <Button
                        icon={<MoreHorizontal24Regular />}
                        appearance="subtle"
                      />
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        <MenuItem onClick={() => onView && onView(row)}>View</MenuItem>
                        <MenuItem onClick={() => onEdit && onEdit(row)}>Edit</MenuItem>
                        <MenuItem onClick={() => onReAnalyze && onReAnalyze(row)}>Re-Analyze</MenuItem>
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </TableCell>
              ) : col.subColumns ? (
                col.subColumns.map(subCol => (
                  <TableCell
                    key={subCol.columnKey}
                    className={styles.tableCell}>
                    {row[col.columnKey][subCol.columnKey]}
                  </TableCell>
                ))
              ) : (
                <TableCell
                  key={col.columnKey}
                  className={col.className === 'smallColumn' 
                    ? `${styles.tableCell} ${styles.smallColumn}` 
                    : col.className === 'actionColumn'
                    ? `${styles.tableCell} ${styles.actionColumn}`
                    : styles.tableCell}>
                  {row[col.columnKey]}
                </TableCell>
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShiftTable;
