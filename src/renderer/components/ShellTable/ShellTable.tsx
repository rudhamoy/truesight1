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

// Define types for the table data and columns
interface ShellData {
  slNo: number;
  plateNo: number;
  shellNo: number;
  zeroOrientation: string;
  ninetyOrientation: string;
  remarks: string;
  [key: string]: any; // Allow string indexing
}

interface Column {
  columnKey: string;
  label: string;
  className?: string;
}

interface ShellTableProps {
  data: ShellData[];
  columns: Column[];
  onView?: (item: ShellData) => void;
  onEdit?: (item: ShellData) => void;
  onReAnalyze?: (item: ShellData) => void;
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

const ShellTable: React.FC<ShellTableProps> = ({ 
  data, 
  columns,
  onView,
  onEdit,
  onReAnalyze
}) => {
  const styles = useStyles();

  return (
    <Table 
      aria-label="Shell data table" 
      style={{minWidth: '510px'}}
      className={styles.table}
    >
      <TableHeader>
        <TableRow className={styles.tableRow}>
          {columns.map(col => (
            <TableHeaderCell
              key={col.columnKey}
              className={col.className === 'smallColumn' 
                ? `${styles.tableHeader} ${styles.smallColumn}` 
                : col.className === 'actionColumn'
                ? `${styles.tableHeader} ${styles.actionColumn}`
                : styles.tableHeader}
            >
              {col.label}
            </TableHeaderCell>
          ))}
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

export default ShellTable;
