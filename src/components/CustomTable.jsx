
import PropTypes from "prop-types";


const CustomTable = ({ columns, data, }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full  table-auto border-collapse text-left ">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-100 text-sm">
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 ${col.width || ""}`}>
                {col.label}
              </th>
            ))}
     
          </tr>
          
          
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-200 text-sm">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-2 ${col.width || ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CustomTable;

