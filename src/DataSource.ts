import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  //1.Create a property called resolution to the DataSource class.
  resolution: number;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    
    //1.Create a property called resolution to the DataSource class.
    this.resolution = instanceSettings.jsonData.resolution || 1000.0;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Return a constant for each query.
    const data = options.targets.map(target => {
      //2.In the map function, use the lodash/defaults package to set default values for query properties that haven’t been set:
      const query = defaults(target, defaultQuery);

      //3.Create a data frame with a time field and a number field:
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });
      
      //1.Create a couple of helper variables:
      // duration of the time range, in milliseconds.
      const duration = to - from;
      
      // step determines how close in time (ms) the points will be to each other.
      //2.In the query method, use the resolution property to calculate the step size.
      const step = duration / this.resolution;


      //2.Add the values to the data frame:
      for (let t = 0; t < duration; t += step) {
        //1.In the query method, use the frequency property to adjust our equation.
        frame.add({ time: from + t, value: Math.sin((2 * Math.PI * query.frequency * t) / duration) });

      }

      //3.Return the data frame:
      return frame;
      
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
