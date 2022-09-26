import React from 'react'
import { Table } from 'semantic-ui-react'
import { useEffect, useState } from "react";
import styles from "../../styles/RenderLogs.module.css";

export default function SinglePartitionTransfer({ data }) {
  const [logs, setLogs] = useState(data);
  useEffect((): any => {
  }, [data]);

  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='2'>Process Logs</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className={styles.latest}>
        {logs.map((item: string, i: number) => {
          let json = JSON.parse(item);
          return (
            <Table.Row key={i}>
              <Table.Cell width={5}>{json.timestamp}</Table.Cell>
              <Table.Cell>{json.message}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  )
}