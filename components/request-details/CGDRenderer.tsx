import React from 'react'
import { Table } from 'semantic-ui-react'
import { useState } from "react";

export default function CGDRenderer({ data }) {
  const [logs, setLogs] = useState(data);

  return (
    <Table selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='2'>Consumer Group Description</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {logs.map((item: string, i: number) => {
          let json = JSON.parse(item);
          return (
            <Table.Row key={i}>
              <Table.Cell><pre>{json.message}</pre></Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  )
}