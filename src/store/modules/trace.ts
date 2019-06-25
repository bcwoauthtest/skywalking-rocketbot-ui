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

import { Commit, ActionTree, MutationTree, Dispatch } from 'vuex';
import { AxiosResponse } from 'axios';
import graph from '@/graph';
import { Trace, Span, Option } from '../interfaces';
import * as types from '../mutation-types';

export interface State {
  services: Option[];
  instances: Option[];
  traceForm: any;
  traceList: Trace[];
  traceTotal: number;
  traceSpans: Span[];
  currentTrace: Trace;
  currentService: Option;
  traceQueryState: boolean;
}

const initState: State = {
  services: [],
  instances: [],
  traceForm: {
    paging: {pageNum: 1, pageSize: 15, needTotal: true},
    queryOrder: 'BY_START_TIME',
  },
  traceList: [],
  traceTotal: 0,
  traceSpans: [],
  currentTrace: {
    operationNames: [],
    duration: 0,
    isError: false,
    key: '',
    start: '',
    traceIds: [],
  },
  currentService: {label: '所有', key: ''},
  traceQueryState: false,
};

// getters
const getters = {};

// mutations
const mutations: MutationTree<State> = {
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
  [types.SET_INSTANCES](state: State, data: any) {
    state.instances = [{label: '所有', key: ''}].concat(data);
  },
  [types.SET_TRACE_FORM](state: State, data: any) {
    state.traceForm = data;
  },
  [types.SET_TRACE_FORM_ITEM](state: State, params: any) {
    state.traceForm[params.type] = params.data;
  },
  [types.SET_TRACELIST](state: State, data: Trace[]) {
    state.traceList = data;
  },
  [types.SET_TRACELIST_TOTAL](state: State, data: number) {
    state.traceTotal = data;
  },
  [types.SET_TRACE_SPANS](state: State, data: Span[]) {
    state.traceSpans = data;
  },
  [types.SET_CURRENT_TRACE](state: State, data: Span) {
    state.currentTrace = data;
  },
  [types.SET_TRACE_CURRENT_SERVICE](state: State, data: any) {
      state.currentService = data;
  },
  [types.SET_TRACE_QUERY_STATE](state: State, status: boolean) {
      state.traceQueryState = status;
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
  GET_INSTANCES(context: { commit: Commit }, params: any) {
    return graph
    .query('queryServiceInstance')
    .params(params)
    .then((res: AxiosResponse) => {
      context.commit(types.SET_INSTANCES, res.data.data.instanceId);
    });
  },
  SET_TRACE_FORM(context: { commit: Commit, dispatch: Dispatch }, params) {
    context.commit(types.SET_TRACE_FORM, params);
  },
  GET_TRACE_SPANS(context: { commit: Commit }, params) {
    context.commit(types.SET_TRACE_SPANS, []);
    return graph
      .query('queryTrace')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit(types.SET_TRACE_SPANS, res.data.data.trace.spans);
      });
  },
  GET_TRACELIST(context: { state: State, commit: Commit, dispatch: Dispatch }) {
    context.commit(types.SET_TRACELIST, []);
    context.commit(types.SET_TRACE_QUERY_STATE, true);
    context.commit(types.SET_TRACE_SPANS, []);
    return graph
    .query('queryTraces')
    .params({condition: context.state.traceForm})
    .then((res: AxiosResponse) => {
      context.commit(types.SET_TRACELIST, res.data.data.traces.data);
      context.commit(types.SET_TRACELIST_TOTAL, res.data.data.traces.total);
      if (res.data.data.traces.data.length > 0) {
        context.commit(types.SET_CURRENT_TRACE, res.data.data.traces.data[0]);
        context.dispatch('GET_TRACE_SPANS', {traceId: res.data.data.traces.data[0].traceIds[0]});
      } else {
        context.commit(types.SET_CURRENT_TRACE, {
          operationNames: [],
          duration: 0,
          isError: false,
          key: '',
          start: '',
          traceIds: [],
        });
        context.commit(types.SET_TRACE_SPANS, []);
      }
      context.commit(types.SET_TRACE_QUERY_STATE, false);
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
