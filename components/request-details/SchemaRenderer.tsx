import React from 'react'
import { Segment, Popup, Container } from 'semantic-ui-react'
import SyntaxHighlighter from 'react-syntax-highlighter';

export function SchemaRenderer({ schemaId, schemaType, currentSchema }) {
  return (
    <React.Fragment>
      <Popup trigger={
        <Segment>
          <p>{schemaType} [{schemaId}]</p>
        </Segment>
      } hoverable={true}>
        <Popup.Content>
          <Container>
            <SyntaxHighlighter
              language='JSON'
              lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap'} }}
              wrapLines={true}
            >
              {currentSchema}
            </SyntaxHighlighter>
          </Container>
        </Popup.Content>
      </Popup>
    </React.Fragment>
  )
}