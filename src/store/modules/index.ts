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

import { Commit, ActionTree, MutationTree } from 'vuex';
import getLocalTime from '@/utils/localtime';
import { Duration } from '../interfaces';
import * as types from '../mutation-types';
import {AxiosResponse} from 'axios';
import graph from '@/graph';

const w = window as any;
let timer: any = null;

const dateFormate = (date: Date, step: string) => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) { day = `0${dayTemp}`; }
  if (step === 'DAY') { return `${year}-${month}-${day}`; }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) { hour = `0${hourTemp}`; }
  if (step === 'HOUR') { return `${year}-${month}-${day} ${hour}`; }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) { minute = `0${minuteTemp}`; }
  if (step === 'MINUTE') { return `${year}-${month}-${day} ${hour}${minute}`; }
};
const dateFormateTime = (date: Date, step: string) => {
  const year = date.getFullYear();
  const monthTemp = date.getMonth() + 1;
  let month: string = `${monthTemp}`;
  if (monthTemp < 10) {
    month = `0${monthTemp}`;
  }
  if (step === 'MONTH') {
    return `${year}-${month}`;
  }
  const dayTemp = date.getDate();
  let day: string = `${dayTemp}`;
  if (dayTemp < 10) { day = `0${dayTemp}`; }
  if (step === 'DAY') { return `${month}-${day}`; }
  const hourTemp = date.getHours();
  let hour: string = `${hourTemp}`;
  if (hourTemp < 10) { hour = `0${hourTemp}`; }
  if (step === 'HOUR') { return `${month}-${day} ${hour}`; }
  const minuteTemp = date.getMinutes();
  let minute: string = `${minuteTemp}`;
  if (minuteTemp < 10) { minute = `0${minuteTemp}`; }
  if (step === 'MINUTE') { return `${hour}:${minute}\n${month}-${day}`; }
};

interface BsInfo {
    id: number;
    name: string;
}

export interface State {
  duration: Duration;
  eventStack: any;
  chartStack: any;
  edit: boolean;
  currentService: any;
  tenantBs: BsInfo[];
  selectedBs: any;
  currentTenant: any;
  selectedBsArray: any;
  selectedCiId: any;
  selectedCiCode: any;
  selectedTsId: any;
  currentTenantName: any;
}

let utc = w.localStorage.getItem('utc');
if (!utc) {
  utc = (-(new Date().getTimezoneOffset() / 60)).toString();
  w.localStorage.setItem('utc', utc);
}
w.localStorage.setItem('lang', 'zh');
const initState: State = {
  duration: {
    start: getLocalTime(parseInt(utc, 10), new Date().getTime() - 900000),
    end: getLocalTime(parseInt(utc, 10), new Date()),
    step: 'MINUTE',
  },
  eventStack: [],
  chartStack: [],
  edit: false,
  currentService: {label: '所有', key: ''},
  tenantBs: [],
  selectedBs: '',
  currentTenant: '',
  selectedBsArray: [],
  selectedCiId: '',
  selectedCiCode: '',
  selectedTsId: '',
  currentTenantName: '',
};

// getters
const getters = {
  intervalTime(state: State) {
    let interval: number = 946080000000;
    switch (state.duration.step) {
      case 'MINUTE':
        interval = 60000;
        break;
      case 'HOUR':
        interval = 3600000;
        break;
      case 'DAY':
        interval = 86400000;
        break;
      case 'MONTH':
        interval = (state.duration.end.getTime() - state.duration.start.getTime())
        / (state.duration.end.getFullYear() * 12 + state.duration.end.getMonth()
        - state.duration.start.getFullYear() * 12 - state.duration.start.getMonth());
        break;
    }
    const startUnix: number = state.duration.start.getTime();
    const endUnix: number = state.duration.end.getTime();
    const timeIntervals: number[] = [];
    for (let i = 0; i <= endUnix - startUnix; i += interval) {
      const temp: any = dateFormateTime(new Date(startUnix + i), state.duration.step);
      timeIntervals.push(temp);
    }
    return timeIntervals;
  },
  durationTime(state: State) {
    const startTemp = new Date(state.duration.start);
    const endTemp = new Date(state.duration.end);
    const stepTemp = state.duration.step;
    return {
      start: dateFormate(startTemp, stepTemp),
      end: dateFormate(endTemp, stepTemp),
      step: stepTemp,
    };
  },
  currentService(state: State) {
    return state.currentService;
  },
  tenantBs(state: State) {
      return state.tenantBs;
  },
  selectedBs(state: State) {
    return state.selectedBs;
  },
  currentTenant(state: State) {
    return state.currentTenant;
  },
  selectedBsArray(state: State) {
    return state.selectedBsArray;
  }
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_DURATION](state: State, data: Duration) {
    state.duration = data;
  },
  [types.SET_EVENTS](state: State, data: any[]) {
    state.eventStack = data;
  },
  [types.SET_CURRENT_TOPO_SERVICE](state: State, data: any) {
      state.currentService = data;
  },
  [types.SET_TENANT_BS](state: State, data: any[]) {
    state.tenantBs = data;
    const selectedBsIds = state.selectedBs.split(',');
    for (const i in selectedBsIds) {
      for (const j in data) {
        if (data[j].key === selectedBsIds[i]) {
          state.selectedBsArray.push(data[j]);
          break;
        }
      }
    }
  },
  [types.SET_CHARTS](state: State, data: any[]) {
    state.chartStack.push(data);
  },
  [types.RUN_EVENTS](state: State) {
    clearTimeout(timer);
    timer = setTimeout(() => state.eventStack.forEach((event: any) => { setTimeout(event(), 0); }), 500);
  },
  [types.SET_CURRENT_TENANT](state: State, status: string) {
    state.currentTenant = status;
  },
  [types.SET_CURRENT_TENANT_NAME](state: State, status: string) {
    state.currentTenantName = status;
  },
  [types.SET_EDIT](state: State, status: boolean) {
    state.edit = status;
  },
  [types.SET_SELECTED_BS](state: State, data: string) {
    state.selectedBs = data;
  },
  [types.SET_SELECTED_CI_ID](state: State, data: string) {
    state.selectedCiId = data;
  },
  [types.SET_SELECTED_CI_CODE](state: State, data: string) {
    state.selectedCiCode = data;
  },
  [types.SET_SELECTED_TS](state: State, data: string) {
    state.selectedTsId = data;
  },
};

// actions
const actions: ActionTree<State, any> = {
  SET_DURATION(context: { commit: Commit }, data: Duration) {
    context.commit(types.SET_DURATION, data);
    context.commit(types.RUN_EVENTS);
  },
  RUN_EVENTS(context: { commit: Commit }) {
    if (w.axiosCancel.length !== 0) {
      for (const event of w.axiosCancel) { setTimeout(event(), 0); }
      w.axiosCancel = [];
    }
    context.commit(types.RUN_EVENTS);
  },
  SET_CHARTS(context: { commit: Commit }, data: any[]) {
    context.commit(types.SET_CHARTS, data);
  },
  CLEAR_CHARTS(context: { commit: Commit }) {
    context.commit(types.SET_CHARTS, []);
  },
  SET_EDIT(context: { commit: Commit }, status: boolean) {
    context.commit(types.SET_EDIT, status);
  },
  GET_TENANT_BS_INFO(context: { commit: Commit; state: State; }, params: any) {
    /*context.commit('SET_TENANT_BS',[{key:'1', label:'1111'}, {key:'2', label:'2222'}])*/
    return graph
      .query('queryBsInfos')
      .params(params)
      .then((res: AxiosResponse) => {
        context.commit('SET_TENANT_BS', res.data.data.getBsInfo.infos);
        context.commit('SET_CURRENT_TENANT_NAME', res.data.data.getBsInfo.tenantName);
      });
  },
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
