import React from "react";
import { Table } from "antd";
import { createStyles } from "antd-style";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      .${antCls}-table-container {
        .${antCls}-table-body,
        .${antCls}-table-content {
          scrollbar-width: thin;
          scrollbar-color: #eaeaea transparent;
          scrollbar-gutter: stable;
        }
      }
    `,
  };
});

const TableReports = ({columns,dataSource,pagination,tableHeight,className}) => {
  const { styles } = useStyle();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table
          className={`${styles.customTable } ${className} w-full`}
          columns={columns}
          dataSource={dataSource || []}
          pagination={pagination} // Removed pagination
          scroll={{ y: tableHeight }} // Keeps scroll enabled
        />
      </div>
    </div>
  );
};

export default TableReports;
