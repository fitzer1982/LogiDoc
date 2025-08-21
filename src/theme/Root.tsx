import React from 'react';
import ConditionalNavScript from '@site/src/components/ConditionalNavScript';

// This component wraps the entire app
export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      <ConditionalNavScript />
      {children}
    </>
  );
}