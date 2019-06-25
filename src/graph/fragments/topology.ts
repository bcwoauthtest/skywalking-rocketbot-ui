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

export const TopoServiceInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_server_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_server_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_relation_server_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const TopoClientInfo = {
  variable: '$duration: Duration!, $id: ID!',
  query: `
    getResponseTimeTrend: getLinearIntValues(metric: {
      name: "service_relation_client_resp_time"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getThroughputTrend: getLinearIntValues(metric: {
      name: "service_relation_client_cpm"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
    getSLATrend: getLinearIntValues(metric: {
      name: "service_relation_client_call_sla"
      id: $id
    }, duration: $duration) {
      values {
        value
      }
    }
`};

export const Topo = {
  variable: '$tenantId: String, $bsIds: String!, $tsIds: String, $nodeIds: String, $duration: Duration!',
  query: `
  topo: getGlobalTopology(tenantId: $tenantId, bsIds: $bsIds, tsIds: $tsIds, nodeIds: $nodeIds, duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      userDefNodeType
      isReal
      host
      bsId
      tsId
      nodeId
      ciId
      hostIP
    }
    calls {
      id
      source
      target
      callType
      detectPoint
    }
  }`};

export const TopoInfo = {
    variable: '$duration: Duration!',
    query: `
  topo: getGlobalTopology(duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      userDefNodeType
      isReal
      host
      hostIP
    }
    calls {
      id
      source
      target
      callType
      detectPoint
    }
  }`};

export const ServiceTopo = {
    variable: '$serviceId: ID!, $duration: Duration!',
    query: `
  topo: getServiceTopology(serviceId: $serviceId, duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      userDefNodeType
      isReal
      host
      hostIP
    }
    calls {
      id
      source
      target
      callType
      detectPoint
    }
  }`};

export const ServicesTopo = {
  variable: '$serviceIds: [Int!]!, $duration: Duration!',
  query: `
  topo: getServicesTopology(serviceIds: $serviceIds, duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      userDefNodeType
      isReal
      host
      hostIP
    }
    calls {
      id
      source
      target
      callType
      detectPoint
    }
  }`};

export const TopoMetric = {
  variable: '$ids: [ID!]!',
  query: `
  sla: getValues(metric: {
    name: "service_sla"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  nodeCpm: getValues(metric: {
    name: "service_cpm"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  nodeLatency: getValues(metric: {
    name: "service_resp_time"
    ids: $ids
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};

export const TopoServiceMetric = {
  variable: '$idsS: [ID!]!',
  query: `
  cpmS: getValues(metric: {
    name: "service_relation_server_cpm"
    ids: $idsS
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  latencyS: getValues(metric: {
    name: "service_relation_client_resp_time"
    ids: $idsS
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};

export const TopoClientMetric = {
  variable: '$idsC: [ID!]!',
  query: `
  cpmC: getValues(metric: {
    name: "service_relation_client_cpm"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }
  latencyC: getValues(metric: {
    name: "service_relation_client_resp_time"
    ids: $idsC
  }, duration: $duration) {
    values {
      id
      value
    }
  }`};

export const UpdateDefName = {
  variable: '$serviceSequence: String!, $userDefineNodeName: String!',
  query: `
  setUserDefineNodeName(serviceSequence: $serviceSequence, userDefineNodeName: $userDefineNodeName) {
    status
  }`};

export const UpdateDefBSName = {
  variable: '$bsId: String!, $userDefineBsNodeName: String!',
  query: `
  setUserDefineBsNodeName(bsId: $bsId, userDefineBsNodeName: $userDefineBsNodeName) {
    status
  }`};

export const UpdateDefTSName = {
  variable: '$tsId: String!, $userDefineTsNodeName: String!',
  query: `
  setUserDefineTsNodeName(tsId: $tsId, userDefineTsNodeName: $userDefineTsNodeName) {
    status
  }`};

export const UpdateDefNodeName = {
  variable: '$nodeId: String!, $userDefineNodeNodeName: String!',
  query: `
  setUserDefineNodeNodeName(nodeId: $nodeId, userDefineNodeNodeName: $userDefineNodeNodeName) {
    status
  }`};

export const UpdateDefNodeType = {
  variable: '$serviceSequence: String!, $userDefineNodeType: String!',
  query: `
  setUserDefineNodeType(serviceSequence: $serviceSequence, userDefineNodeType: $userDefineNodeType) {
    status
  }`};

export const WrappedBsTopo = {
  variable: '$tenantId: String, $bsIds: String!, $duration: Duration!',
  query: `
  topo: getTopologyWrappedByBs(tenantId: $tenantId, bsIds: $bsIds, duration: $duration) {
    nodes {
      id
      name
      userDefName
    }
    calls {
      id
      source
      target
    }
    metricResult{
      sla{
        values {
          id
          value
        }
      }
      nodeCpm{
        values {
          id
          value
        }
      }
      nodeLatency{
        values {
          id
          value
        }
      }
      cpmS{
        values {
          id
          value
        }
      }
      latencyS{
        values {
          id
          value
        }
      }
      cpmC{
        values {
          id
          value
        }
      }
      latencyC{
        values {
          id
          value
        }
      }
    }
  }`};

export const WrappedTsTopo = {
  variable: '$tenantId: String, $bsIds: String!, $duration: Duration!',
  query: `
  topo: getTopologyWrappedByTs(tenantId: $tenantId, bsIds: $bsIds, duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      bsName
    }
    calls {
      id
      source
      target
    }
    metricResult{
      sla{
        values {
          id
          value
        }
      }
      nodeCpm{
        values {
          id
          value
        }
      }
      nodeLatency{
        values {
          id
          value
        }
      }
      cpmS{
        values {
          id
          value
        }
      }
      latencyS{
        values {
          id
          value
        }
      }
      cpmC{
        values {
          id
          value
        }
      }
      latencyC{
        values {
          id
          value
        }
      }
    }
  }`};

export const WrappedNodeTopo = {
  variable: '$tenantId: String, $bsIds: String!, $tsIds: String, $duration: Duration!',
  query: `
  topo: getTopologyWrappedByNode(tenantId: $tenantId, bsIds: $bsIds, tsIds: $tsIds, duration: $duration) {
    nodes {
      id
      name
      userDefName
      type
      bsName
    }
    calls {
      id
      source
      target
    }
    metricResult{
      sla{
        values {
          id
          value
        }
      }
      nodeCpm{
        values {
          id
          value
        }
      }
      nodeLatency{
        values {
          id
          value
        }
      }
      cpmS{
        values {
          id
          value
        }
      }
      latencyS{
        values {
          id
          value
        }
      }
      cpmC{
        values {
          id
          value
        }
      }
      latencyC{
        values {
          id
          value
        }
      }
    }
  }`};
