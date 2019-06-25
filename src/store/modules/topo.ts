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

import { Commit, ActionTree, Dispatch } from 'vuex';
import graph from '../../graph';
import * as types from '../mutation-types';
import { AxiosResponse } from 'axios';
interface Option {
  key: string;
  label: string;
}
interface Call {
  avgResponseTime: number;
  callType: string;
  cpm: number;
  isAlert: boolean;
  source: string;
  target: string;
}
interface Node {
  apdex: number;
  avgResponseTime: number;
  cpm: number;
  id: string;
  isAlarm: boolean;
  name: string;
  numOfServer: number;
  numOfServerAlarm: number;
  numOfServiceAlarm: number;
  sla: number;
  type: string;
  userDefName: string;
  userDefNodeType: string;
  host: string;
  hostIP: string;
  bsName: string;
}

export interface State {
  callback: any;
  calls: Call[];
  nodes: Node[];
  currentNode: any;
  current: Option;
  mode: boolean;
  getResponseTimeTrend: number[];
  getSLATrend: number[];
  getThroughputTrend: number[];
  show: boolean;
  services: Option[];
  colorThreshold: any;
  showEdit: boolean;
  selectedCiServcies: any;
  selectedCiServiceKeyArray: any;
  busiestNode: any;
  busiestCall: any;
  lowestResponseNode: any;
  lowestResponseCall: any;
  lowestServiceLevelNode: any;
  canRollUp: boolean;
  canDrillDown: boolean;
  topoShowLevel: string;
  currentTopoBs: any;
  currentTopoTs: any;
  currentTopoNode: any;
  currentTopoService: any;
  showSearch: boolean;
}

const initState: State = {
  callback: '',
  mode: true,
  calls: [],
  nodes: [],
  currentNode: {},
  current: {
    key: 'default',
    label: 'default',
  },
  getResponseTimeTrend: [],
  getSLATrend: [],
  getThroughputTrend: [],
  show: true,
  services: [],
  colorThreshold: '100,500',
  showEdit: false,
  selectedCiServcies: {label: '', key: ''},
  selectedCiServiceKeyArray: [],
  lowestResponseCall: undefined,
  lowestResponseNode: undefined,
  busiestCall: undefined,
  busiestNode: undefined,
  lowestServiceLevelNode: undefined,
  canRollUp: false,
  canDrillDown: true,
  topoShowLevel: '',
  currentTopoBs: {label: 'All', key: ''},
  currentTopoTs: {label: 'All', key: ''},
  currentTopoNode: {label: 'All', key: ''},
  currentTopoService: {label: 'All', key: ''},
  showSearch: false,
};

// getters
const getters = {};

// mutations
const mutations = {
  [types.SET_SERVICES](state: State, data: any) {
    for (let i in data) {
      if (data[i].userDefName !== undefined && data[i].userDefName !== '') {
        data[i].label = data[i].userDefName;
      } else if (data[i].label.indexOf('@') !== -1) {
        data[i].label = data[i].label.split('@')[0];
      }
    }
    state.services = [{label: '所有', key: ''}].concat(data);
  },
  [types.SET_CALLBACK](state: State, data: any) {
    state.callback = data;
  },
  [types.SET_MODE](state: State, data: boolean) {
    state.mode = data;
  },
  [types.SET_CAN_ROLL_UP](state: State, data: boolean) {
    state.canRollUp = data;
  },
  [types.SET_CAN_DRILL_DOWN](state: State, data: boolean) {
    state.canDrillDown = data;
  },
  [types.SET_NODE](state: State, data: any) {
    state.currentNode = data;
  },
  [types.SET_SELECTED_CI_SERVICES](state: State, data: any) {
    state.selectedCiServcies = data;
  },
  [types.SET_CURRENT_TOPO_LEVEL](state: State, data: any) {
    state.topoShowLevel = data;
  },
  [types.SET_SELECTED_CI_SERVICE_KEY_ARRAY](state: State, data: any) {
    state.selectedCiServiceKeyArray = data;
  },
  [types.SET_TOPO_CURRENT_BS](state: State, data: any) {
    state.currentTopoBs = data;
  },
  [types.SET_TOPO_CURRENT_TS](state: State, data: any) {
    state.currentTopoTs = data;
  },
  [types.SET_TOPO_CURRENT_NODE](state: State, data: any) {
    state.currentTopoNode = data;
  },
  [types.SET_TOPO_CURRENT_SERVICE](state: State, data: any) {
    state.currentTopoService = data;
  },
  [types.SET_TOPO](state: State, data: any) {
    state.calls = data.calls;
    state.nodes = data.nodes;
    let busiestNodeValue = 0;
    let lowestResponseNodeValue = 999999;
    let lowestSlaNodeValue = 100;
    state.busiestNode = undefined;
    state.busiestCall = undefined;
    state.lowestServiceLevelNode = undefined;
    state.lowestResponseNode = undefined;
    state.lowestResponseCall = undefined;
    for (let j = 0; j < data.nodes.length; j += 1) {
      if (data.nodes[j].cpm !== undefined && data.nodes[j].cpm > busiestNodeValue) {
        busiestNodeValue = data.nodes[j].cpm;
        state.busiestNode = data.nodes[j];
      }
      if (data.nodes[j].sla !== undefined && data.nodes[j].sla < lowestSlaNodeValue) {
        lowestSlaNodeValue = data.nodes[j].sla;
        state.lowestServiceLevelNode = data.nodes[j];
      }
      if (data.nodes[j].latency !== undefined && data.nodes[j].latency < lowestResponseNodeValue) {
        lowestResponseNodeValue = data.nodes[j].latency;
        state.lowestResponseNode = data.nodes[j];
      }
    }
    let busiestCallValue = 0;
    let lowestResponseCallValue = 999999;
    for (let j = 0; j < data.calls.length; j += 1) {
      if (data.calls[j].cpm !== undefined && data.calls[j].cpm > busiestCallValue) {
        busiestCallValue = data.calls[j].cpm;
        state.busiestCall = data.calls[j];
      }
      if (data.calls[j].latency !== undefined && data.calls[j].latency < lowestResponseCallValue) {
        lowestResponseCallValue = data.calls[j].latency;
        state.lowestResponseCall = data.calls[j];
      }
    }
  },
  [types.SET_TOPO_DETAIL_SHOW](state: State, data: any) {
    state.show = data;
  },
  [types.SET_TOPO_EDIT_SHOW](state: State, data: any) {
    state.showEdit = data;
  },
  [types.SET_TOPO_SEARCH_SHOW](state: State, data: any) {
    state.showSearch = data;
  },
  [types.SET_TOPO_RELATION](state: State, data: any) {
    state.getResponseTimeTrend = data.getResponseTimeTrend ?
      data.getResponseTimeTrend.values.map((i: any) => i.value) : [];
    state.getSLATrend = data.getSLATrend ? data.getSLATrend.values.map((i: any) => i.value) : [];
    state.getThroughputTrend = data.getThroughputTrend ? data.getThroughputTrend.values.map((i: any) => i.value) : [];
  },
  [types.SET_NODE_DEF_NAME](state: State, data: any) {
    for (const node in state.nodes) {
      if (state.nodes[node].id === data.serviceSequence) {
        state.nodes[node].userDefName = data.userDefineNodeName;
        break;
      }
    }
  },
  [types.SET_NODE_DEF_TYPE](state: State, data: any) {
    for (const node in state.nodes) {
      if (state.nodes[node].id === data.serviceSequence) {
        state.nodes[node].userDefNodeType = data.userDefineNodeType;
        break;
      }
    }
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_SERVICES(context: { commit: Commit }, params: any) {
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
          context.commit(types.SET_SERVICES, res.data.data.services);
      });
  },
  CLEAR_TOPO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO, {calls: [], nodes: []});
  },
  CLEAR_TOPO_INFO(context: { commit: Commit; state: State; }) {
    context.commit(types.SET_TOPO_RELATION, {});
  },
  GET_TOPO_SERVICE_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoServiceInfo')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
    });
  },
  GET_TOPO_CLIENT_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('queryTopoClientInfo')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit('SET_TOPO_RELATION', res.data.data);
    });
  },
  UPDATE_USER_DEF_NAME(context: { commit: Commit; state: State; }, params: any) {
    return graph
      .query('updateDefName')
      .params(params)
      .then((res: AxiosResponse) => {
        const status = res.data.data.setUserDefineNodeName.status;
        if (status === 'OK') {
          context.commit(types.SET_NODE_DEF_NAME, params);
        }
      });
  },
  UPDATE_USER_DEF_BS_NAME(context: { commit: Commit; state: State; }, params: any) {
    return graph
      .query('updateDefBsName')
      .params(params)
      .then((res: AxiosResponse) => {
        const status = res.data.data.setUserDefineBsNodeName.status;
        if (status === 'OK') {
          context.commit(types.SET_NODE_DEF_NAME, params);
        }
      });
  },
  UPDATE_USER_DEF_TS_NAME(context: { commit: Commit; state: State; }, params: any) {
    return graph
      .query('updateDefTsName')
      .params(params)
      .then((res: AxiosResponse) => {
        const status = res.data.data.setUserDefineTsNodeName.status;
        if (status === 'OK') {
          context.commit(types.SET_NODE_DEF_NAME, params);
        }
      });
  },
  UPDATE_USER_DEF_NODE_NAME(context: { commit: Commit; state: State; }, params: any) {
    return graph
      .query('updateDefNodeName')
      .params(params)
      .then((res: AxiosResponse) => {
        const status = res.data.data.setUserDefineNodeNodeName.status;
        if (status === 'OK') {
          context.commit(types.SET_NODE_DEF_NAME, params);
        }
      });
  },
  UPDATE_USER_DEF_NODE_TYPE(context: { commit: Commit; state: State; }, params: any) {
    return graph
    .query('updateDefNodeType')
    .params(params)
    .then((res: AxiosResponse) => {
        const status = res.data.data.setUserDefineNodeType.status;
        if (status === 'OK') {
          context.commit(types.SET_NODE_DEF_TYPE, params);
        }
    });
  },
  GET_TOPO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    return graph
    .query('queryTopo')
    .params(params)
    .then((res: AxiosResponse) => {
      const calls = res.data.data.topo.calls;
      const nodes = res.data.data.topo.nodes;
      if (calls.length === 0  || nodes.length === 0) {
        return context.commit(types.SET_TOPO, {calls, nodes});
      }
      const ids = nodes.map((i: any) => i.id);
      const idsS = calls.filter((i: any) => i.detectPoint === 'SERVER').map((b: any) => b.id);
      const idsC = calls.filter((i: any) => i.detectPoint === 'CLIENT').map((b: any) => b.id);
      return graph
        .query('queryTopoInfo')
        .params({...params, ids, idsC, idsS})
        .then((info: AxiosResponse) => {
          const resInfo = info.data.data;
          if (!resInfo.sla) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.sla.values.length; i += 1) {
            for (let j = 0; j < nodes.length; j += 1) {
              if (nodes[j].id === resInfo.sla.values[i].id) {
                nodes[j] = {
                  ...nodes[j],
                  sla: resInfo.sla.values[i].value / 100,
                  cpm: resInfo.nodeCpm.values[i].value,
                  latency: resInfo.nodeLatency.values[i].value,
                };
              }
            }
          }
          if (!resInfo.cpmC) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
            for (let j = 0; j < calls.length; j += 1) {
              if (calls[j].id === resInfo.cpmC.values[i].id) {
                calls[j] = {
                  ...calls[j],
                  cpm: resInfo.cpmC.values[i].value,
                  latency: resInfo.latencyC.values[i].value,
                };
              }
            }
          }
          if (!resInfo.cpmS) {
            return context.commit(types.SET_TOPO, {calls, nodes});
          }
          for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
            for (let j = 0; j < calls.length; j += 1) {
              if (calls[j].id === resInfo.cpmS.values[i].id) {
                calls[j] = {
                  ...calls[j],
                  cpm: resInfo.cpmS.values[i].value,
                  latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                };
              }
            }
          }
          context.commit(types.SET_TOPO, {calls, nodes});
        });
    });
  },
  GET_SERVICES_TOPO_INFO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    context.commit(types.SET_TOPO, {calls: [], nodes: []});
    return graph
      .query('queryServicesTopo')
      .params(params)
      .then((ciResInfo: AxiosResponse) => {
        const calls = ciResInfo.data.data.topo.calls;
        const nodes = ciResInfo.data.data.topo.nodes;
        if (calls.length === 0  || nodes.length === 0) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        const ids = nodes.map((i: any) => i.id);
        const idsS = calls.filter((i: any) => i.detectPoint === 'SERVER').map((b: any) => b.id);
        const idsC = calls.filter((i: any) => i.detectPoint === 'CLIENT').map((b: any) => b.id);
        return graph
          .query('queryTopoInfo')
          .params({...params, ids, idsC, idsS})
          .then((info: AxiosResponse) => {
            const resInfo = info.data.data;
            if (!resInfo.sla) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.sla.values.length; i += 1) {
              for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[j].id === resInfo.sla.values[i].id) {
                  nodes[j] = {
                    ...nodes[j],
                    sla: resInfo.sla.values[i].value / 100,
                    cpm: resInfo.nodeCpm.values[i].value,
                    latency: resInfo.nodeLatency.values[i].value,
                  };
                }
              }
            }
            if (!resInfo.cpmC) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
              for (let j = 0; j < calls.length; j += 1) {
                if (calls[j].id === resInfo.cpmC.values[i].id) {
                  calls[j] = {
                    ...calls[j],
                    cpm: resInfo.cpmC.values[i].value,
                    latency: resInfo.latencyC.values[i].value,
                  };
                }
              }
            }
            if (!resInfo.cpmS) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
              for (let j = 0; j < calls.length; j += 1) {
                if (calls[j].id === resInfo.cpmS.values[i].id) {
                  calls[j] = {
                    ...calls[j],
                    cpm: resInfo.cpmS.values[i].value,
                    latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                  };
                }
              }
            }
            context.commit(types.SET_TOPO, {calls, nodes});
          });
      });
  },
  GET_CI_TOPO_INFO(context: { commit: Commit; state: State; }, params: any) {
    return graph
      .query('queryCiServices')
      .params(params)
      .then((res: AxiosResponse) => {
        let serviceArray = res.data.data.services;
        for (const i in serviceArray) {
          if (serviceArray[i].userDefName !== undefined && serviceArray[i].userDefName !== '') {
            serviceArray[i].label = serviceArray[i].userDefName;
          } else if (serviceArray[i].label.indexOf('@') !== -1) {
            serviceArray[i].label = serviceArray[i].label.split('@')[0];
          }
        }
        let keyString: string = '';
        let displayLabel: string  = '';
        let serviceIds: any[] = [];
        for (const j in serviceArray) {
          serviceIds.push(serviceArray[j].key);
          displayLabel = displayLabel + ',' + serviceArray[j].label;
          keyString = keyString + ',' + serviceArray[j].key;
        }
        context.commit('SET_TOPO_CURRENT_SERVICE', {label: displayLabel.substr(1), key: keyString});
        context.commit('SET_SELECTED_CI_SERVICE_KEY_ARRAY', serviceIds);
        context.commit(types.SET_NODE, {id: '', name: '', host: ''});
        if (serviceIds.length > 0) {
          return graph
            .query('queryServicesTopo')
            .params({duration: params.duration, serviceIds})
            .then((ciResInfo: AxiosResponse) => {
              const calls = ciResInfo.data.data.topo.calls;
              const nodes = ciResInfo.data.data.topo.nodes;
              if (calls.length === 0  || nodes.length === 0) {
                return context.commit(types.SET_TOPO, {calls, nodes});
              }
              const ids = nodes.map((i: any) => i.id);
              const idsS = calls.filter((i: any) => i.detectPoint === 'SERVER').map((b: any) => b.id);
              const idsC = calls.filter((i: any) => i.detectPoint === 'CLIENT').map((b: any) => b.id);
              return graph
                .query('queryTopoInfo')
                .params({...params, ids, idsC, idsS})
                .then((info: AxiosResponse) => {
                  const resInfo = info.data.data;
                  if (!resInfo.sla) {
                    return context.commit(types.SET_TOPO, {calls, nodes});
                  }
                  for (let i = 0; i < resInfo.sla.values.length; i += 1) {
                    for (let j = 0; j < nodes.length; j += 1) {
                      if (nodes[j].id === resInfo.sla.values[i].id) {
                        nodes[j] = {
                          ...nodes[j],
                          sla: resInfo.sla.values[i].value / 100,
                          cpm: resInfo.nodeCpm.values[i].value,
                          latency: resInfo.nodeLatency.values[i].value,
                        };
                      }
                    }
                  }
                  if (!resInfo.cpmC) {
                    return context.commit(types.SET_TOPO, {calls, nodes});
                  }
                  for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
                    for (let j = 0; j < calls.length; j += 1) {
                      if (calls[j].id === resInfo.cpmC.values[i].id) {
                        calls[j] = {
                          ...calls[j],
                          cpm: resInfo.cpmC.values[i].value,
                          latency: resInfo.latencyC.values[i].value,
                        };
                      }
                    }
                  }
                  if (!resInfo.cpmS) {
                    return context.commit(types.SET_TOPO, {calls, nodes});
                  }
                  for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
                    for (let j = 0; j < calls.length; j += 1) {
                      if (calls[j].id === resInfo.cpmS.values[i].id) {
                        calls[j] = {
                          ...calls[j],
                          cpm: resInfo.cpmS.values[i].value,
                          latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                        };
                      }
                    }
                  }
                  context.commit(types.SET_TOPO, {calls, nodes});
                });
            });
        }
      });
  },
  GET_WRAPPED_BS_TOPO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    context.commit(types.SET_TOPO, {calls: [], nodes: []});
    return graph
      .query('queryWrappedBsTopo')
      .params(params)
      .then((res: AxiosResponse) => {
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        if (calls.length === 0  || nodes.length === 0) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        const resInfo = res.data.data.topo.metricResult;
        if (!resInfo.sla) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.sla.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.sla.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                sla: resInfo.sla.values[i].value / 100,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeCpm.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeCpm.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                cpm: resInfo.nodeCpm.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeLatency.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeLatency.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                latency: resInfo.nodeLatency.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmC) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmC.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmC.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyC.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyC.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmS) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmS.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmS.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyS.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
              };
            }
          }
        }
        context.commit(types.SET_TOPO, {calls, nodes});
      });
  },
  GET_WRAPPED_TS_TOPO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    context.commit(types.SET_TOPO, {nodes: [], calls: []});
    return graph
      .query('queryWrappedTsTopo')
      .params(params)
      .then((res: AxiosResponse) => {
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        if (calls.length === 0  || nodes.length === 0) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        const resInfo = res.data.data.topo.metricResult;
        if (!resInfo.sla) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.sla.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.sla.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                sla: resInfo.sla.values[i].value / 100,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeCpm.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeCpm.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                cpm: resInfo.nodeCpm.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeLatency.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeLatency.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                latency: resInfo.nodeLatency.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmC) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmC.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmC.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyC.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyC.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmS) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmS.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmS.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyS.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
              };
            }
          }
        }
        context.commit(types.SET_TOPO, {calls, nodes});
      });
  },
  GET_WRAPPED_NODE_TOPO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    context.commit(types.SET_TOPO, {nodes: [], calls: []});
    return graph
      .query('queryWrappedNodeTopo')
      .params(params)
      .then((res: AxiosResponse) => {
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        if (calls.length === 0  || nodes.length === 0) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        const resInfo = res.data.data.topo.metricResult;
        if (!resInfo.sla) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.sla.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.sla.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                sla: resInfo.sla.values[i].value / 100,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeCpm.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeCpm.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                cpm: resInfo.nodeCpm.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.nodeLatency.values.length; i += 1) {
          for (let j = 0; j < nodes.length; j += 1) {
            if (nodes[j].id === resInfo.nodeLatency.values[i].id) {
              nodes[j] = {
                ...nodes[j],
                latency: resInfo.nodeLatency.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmC) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmC.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmC.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyC.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyC.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyC.values[i].value,
              };
            }
          }
        }
        if (!resInfo.cpmS) {
          return context.commit(types.SET_TOPO, {calls, nodes});
        }
        for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.cpmS.values[i].id) {
              calls[j] = {
                ...calls[j],
                cpm: resInfo.cpmS.values[i].value,
              };
            }
          }
        }
        for (let i = 0; i < resInfo.latencyS.values.length; i += 1) {
          for (let j = 0; j < calls.length; j += 1) {
            if (calls[j].id === resInfo.latencyS.values[i].id) {
              calls[j] = {
                ...calls[j],
                latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
              };
            }
          }
        }
        context.commit(types.SET_TOPO, {calls, nodes});
      });
  },
  GET_SERVICE_TOPO(context: { commit: Commit; state: State; }, params: any) {
    context.commit(types.SET_NODE, {id: '', name: '', host: ''});
    return graph
      .query('queryServiceTopo')
      .params(params)
      .then((res: AxiosResponse) => {
        const calls = res.data.data.topo.calls;
        const nodes = res.data.data.topo.nodes;
        const ids = nodes.map((i: any) => i.id);
        const idsS = calls.filter((i: any) => i.detectPoint === 'SERVER').map((b: any) => b.id);
        const idsC = calls.filter((i: any) => i.detectPoint === 'CLIENT').map((b: any) => b.id);
        return graph
          .query('queryTopoInfo')
          .params({...params, ids, idsC, idsS})
          .then((info: AxiosResponse) => {
            const resInfo = info.data.data;
            if (!resInfo.sla) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.sla.values.length; i += 1) {
              for (let j = 0; j < nodes.length; j += 1) {
                if (nodes[j].id === resInfo.sla.values[i].id) {
                  nodes[j] = {
                    ...nodes[j],
                    sla: resInfo.sla.values[i].value / 100,
                    cpm: resInfo.nodeCpm.values[i].value,
                    latency: resInfo.nodeLatency.values[i].value,
                  };
                }
              }
            }
            if (!resInfo.cpmC) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.cpmC.values.length; i += 1) {
              for (let j = 0; j < calls.length; j += 1) {
                if (calls[j].id === resInfo.cpmC.values[i].id) {
                  calls[j] = {
                    ...calls[j],
                    cpm: resInfo.cpmC.values[i].value,
                    latency: resInfo.latencyC.values[i].value,
                  };
                }
              }
            }
            if (!resInfo.cpmS) {
              return context.commit(types.SET_TOPO, {calls, nodes});
            }
            for (let i = 0; i < resInfo.cpmS.values.length; i += 1) {
              for (let j = 0; j < calls.length; j += 1) {
                if (calls[j].id === resInfo.cpmS.values[i].id) {
                  calls[j] = {
                    ...calls[j],
                    cpm: resInfo.cpmS.values[i].value,
                    latency: resInfo.latencyS.values[i] ? resInfo.latencyS.values[i].value : '',
                  };
                }
              }
            }
            context.commit(types.SET_TOPO, {calls, nodes});
          });
      });
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  actions,
  mutations,
};
