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

import { Commit, ActionTree } from 'vuex';
import * as types from '../mutation-types';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import {Option} from '@/store/interfaces';

interface LogParams {
  paging: number;
  type: string;
}

interface KiColumn {
  ifKeyColumn: string;
  code: string;
  ifValueColumn: string;
  columnOrder: string;
  dataType: string;
  cname: string;
  ifShow: string;
  unit: string;
}

interface KeyIndicator {
  kiLabel: string;
  kiName: string;
  kiColumns: any[];
  valueColumn: any;
}

export interface State {
  logs: any[];
  total: number;
  services: Option[];
  currentCiCode: string;
  currentKi: KeyIndicator;
  kis: KeyIndicator[];
  queryLogEnd: boolean;
}

const initState: State = {
  logs: [],
  services: [],
  total: 0,
  currentCiCode: '',
  currentKi: {
    kiLabel: '',
    kiName: '',
    kiColumns: [],
    valueColumn: {},
  },
  kis: [],
  queryLogEnd: false,
};

// getters
const getters = {
};

// mutations
const mutations = {
  [types.SET_LOG](state: State, data: []) {
    let formatResult: any[] = [];
    for (const m in data) {
        const oneLog: any = JSON.parse(data[m]);
        formatResult.push(oneLog);
    }
    state.logs = formatResult;
  },
  [types.SET_KI_INFOS](state: State, data: []) {
    state.kis = data;
  },
  [types.SET_LOG_QUERY_FLAG](state: State, data: boolean) {
    state.queryLogEnd = data;
  },
  [types.SET_CURRENT_KI](state: State, data: any) {
    state.currentKi = data;
  },
  [types.SET_CURRENT_CI](state: State, data: any) {
    state.currentCiCode = data;
  },
  [types.SET_LOG_TOTAL](state: State, total: number) {
    state.total = total;
  },
  [types.SET_SERVICES](state: State, data: any) {
    for (const i in data) {
      if (data[i].userDefName !== undefined && data[i].userDefName !== '') {
        data[i].label = data[i].userDefName;
      } else if (data[i].label.indexOf('@') !== -1) {
        data[i].label = data[i].label.split('@')[0];
      }
    }
    state.services = data;
  },
  [types.CLEAR_LOG](state: State) {
    state.logs = [];
    state.total = 0;
  },
};

// actions
const actions: ActionTree<State, any> = {
  GET_KI_INFOS(context: { commit: Commit; state: State}, params: any) {
    context.commit(types.SET_LOG_QUERY_FLAG, false);
    context.commit(types.CLEAR_LOG);
    return graph
      .query('queryKiInfos')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_CURRENT_CI, res.data.data.queryBsLogKiLabels.ciCode);
        let formatResult: KeyIndicator[] = [];
        const data = res.data.data.queryBsLogKiLabels.bsKiLabels;
        for (const i in data) {
          let kiData: KeyIndicator = {
            kiLabel: '',
            kiName: '',
            kiColumns: [],
            valueColumn: {},
          };
          const dataKiColumns: any[] = data[i]['kiColumns'];
          for (const j in dataKiColumns) {
            const oneColumn: any = JSON.parse(dataKiColumns[j]);
            kiData.kiColumns.push(oneColumn);
          }
          kiData.valueColumn = JSON.parse(data[i]['valueColumn']);
          kiData.kiLabel = data[i]['kiLabel'];
          kiData.kiName = data[i]['kiName'];
          formatResult.push(kiData);
        }
        context.commit(types.SET_KI_INFOS, formatResult);
        context.commit(types.SET_CURRENT_KI, formatResult[0]);
        const logParams: any = {
          ciCode: res.data.data.queryBsLogKiLabels.ciCode,
          kiLabel: formatResult[0].kiLabel.toLowerCase(),
          valueColumnLabel: formatResult[0].valueColumn.code,
          queryDuration: params.queryDuration,
          paging: {
            pageNum: 1,
            pageSize: 20,
            needTotal: true,
          },
        };
        return graph
          .query('queryLogs')
          .params(logParams)
          .then((resInfo: AxiosResponse) => {
            context.commit(types.SET_LOG, resInfo.data.data.queryBsLogs.logs);
            context.commit(types.SET_LOG_TOTAL, resInfo.data.data.queryBsLogs.total);
            context.commit(types.SET_LOG_QUERY_FLAG, true);
          });
      });
  },
  GET_LOGS(context: { commit: Commit; state: State}, params: any) {
    if (!params.isChangePage) {
      context.commit(types.SET_LOG_QUERY_FLAG, false);
      context.commit(types.CLEAR_LOG);
    }

    return graph
      .query('queryLogs')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_LOG, res.data.data.queryBsLogs.logs);
        context.commit(types.SET_LOG_TOTAL, res.data.data.queryBsLogs.total);
        context.commit(types.SET_LOG_QUERY_FLAG, true);
      });
  },
  CLEAR_LOG(context: { commit: Commit; state: State }) {
    context.commit(types.CLEAR_LOG);
  },
  GET_SERVICES(context: { commit: Commit }, params: any) {
    return graph
      .query('queryServices')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_SERVICES, res.data.data.services);
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
