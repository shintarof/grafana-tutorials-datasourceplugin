import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  queryText?: string;
  constant: number;
  
  //1.Add a new number property called frequency to the query model:
  frequency: number;
}

export const defaultQuery: Partial<MyQuery> = {
  constant: 6.5,

  //2.Set a default value to the new frequency property:
  frequency: 1.0,
};

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}
