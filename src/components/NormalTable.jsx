import { CardBody, Typography, Avatar, Progress } from "@material-tailwind/react";
import PropTypes from 'prop-types';

const NormalTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography className="p-4 text-center">No Data Available</Typography>;
  }

  // Extract table column names dynamically
  const columns = Object.keys(data[0]);

  return (
    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <table className="w-full min-w-[640px] table-auto border-collapse ">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border-b py-3 px-6 text-left bg-gray-100">
                <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-700">
                  {col.replace(/_/g, " ")} {/* Convert snake_case to readable text */}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className=" border-b border-gray-300 py-3 px-5 text-blue-gray-700">
                  {col === "professional" && row[col]?.image ? (
                    <div className="flex items-center gap-4">
                      <Avatar src={row[col]?.image || "/default-avatar.png"} alt={row[col]?.name || "No Name"} size="sm" />
                      <Typography variant="small" className="font-bold">
                        {row[col]?.name || "Unknown"}
                      </Typography>
                    </div>
                  ) : col === "status" ? (
                    <div className="w-10/12">
                      <Typography variant="small" className="mb-1 block text-xs font-medium text-blue-gray-600">
                        {row[col] === 1 ? "Accept" : "Not Accept"}
                      </Typography>
                      <Progress value={row[col] === 1 ? 100 : 50} variant="gradient" color={row[col] === 1 ? "green" : "blue"} className="h-1" />
                    </div>
                  ) : (
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {row[col] || "N/A"}
                    </Typography>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardBody>
  );
};
NormalTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NormalTable;

