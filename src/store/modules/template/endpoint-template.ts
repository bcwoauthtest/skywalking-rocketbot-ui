/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default [
  {
    o: 'Global',
    n: 'Global Brief',
    comp: 'ChartBrief',
    t: '全局概览',
    type: 'global',
    w: 3,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Endpoint Avg Response',
    comp: 'ChartAvgResponse',
    t: '应用端点平均响应时间',
    type: 'endpointInfo',
    w: 3,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Endpoint Avg Throughput',
    comp: 'ChartAvgThroughput',
    t: '应用端点平均吞吐量',
    type: 'endpointInfo',
    w: 3,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Endpoint Avg SLA',
    comp: 'ChartAvgSLA',
    t: '应用端点平均SLA',
    type: 'endpointInfo',
    w: 3,
  },
  {
    o: 'Global',
    n: 'Global Percent Response(line)',
    comp: 'ChartResponseLine',
    t: 'Global Percent Response',
    type: 'global',
    w: 3,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Endpoint Percent Response(line)',
    comp: 'ChartResponseLine',
    t: 'Endpoint Percent Response',
    type: 'endpointInfo',
    w: 3,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Dependency Map',
    comp: 'ChartDependency',
    t: '应用端点依赖图',
    type: 'endpointInfo',
    w: 6,
  },
  {
    o: 'ServiceEndpoint',
    n: 'Endpoint Top Slow Traces',
    comp: 'ChartTrace',
    t: '应用端点慢调用TOPN',
    type: 'endpointInfo.queryBasicTraces',
    w: 6,
  },
  {
    o: 'Global',
    n: 'Global Top Slow Endpoint',
    comp: 'ChartSlow',
    t: '全局慢服务端点TOPN',
    type: 'global.getTopNSlowEndpoint',
    w: 6,
  },
];
