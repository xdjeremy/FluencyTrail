import type { ReactNode } from 'react';

/**
 * MetadataValue represents the possible types that can appear in the metadata
 * Including nested objects and arrays for complex data structures
 */
export type MetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: MetadataValue }
  | MetadataValue[];

/**
 * Props for the MetadataTable component
 * @property metadata - Object containing key-value pairs of metadata
 */
interface MetadataTableProps {
  metadata: Record<string, MetadataValue>;
}

/**
 * MetadataTable displays a table of key-value pairs from a metadata object
 * Handles nested objects and arrays by converting them to formatted strings
 */
const MetadataTable = ({ metadata }: MetadataTableProps) => {
  // Type guard to validate metadata object
  const isValidMetadata = (
    value: unknown
  ): value is Record<string, MetadataValue> => {
    return value !== null && typeof value === 'object';
  };

  if (!isValidMetadata(metadata)) {
    return null;
  }

  /**
   * Renders a metadata value based on its type
   * @param value - The value to render
   * @returns ReactNode containing the formatted value
   */
  const renderValue = (value: MetadataValue): ReactNode => {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <table className="rw-table">
      <tbody>
        {Object.entries(metadata).map(([key, value]) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{renderValue(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MetadataTable;
