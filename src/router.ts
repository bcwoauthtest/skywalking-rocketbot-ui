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

import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/containers/login.vue';
import Index from './views/containers/index.vue';
import Dashboard from './views/containers/dashboard.vue';
import Trace from './views/containers/trace.vue';
import Topology from './views/containers/topology.vue';
import Alarm from './views/containers/alarm.vue';
import Log from './views/containers/log.vue';

Vue.use(Router);
const w: any = window;
w.axiosCancel = [];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      component: Login,
      meta: { login: true },
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: 'dashboard/:tenantId',
          component: Dashboard,
          name: 'dashboard',
        },
        {
          path: 'trace/:tenantId',
          component: Trace,
          name: 'trace',
        },
        {
          path: 'log/:tenantId',
          component: Log,
          name: 'log',
        },
        {
          path: 'alarm/:tenantId',
          component: Alarm,
          name: 'alarm',
        },
        {
          path: ':tenantId',
          component: Topology,
          name: 'topo',
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  window.localStorage.setItem('version', '6');
  window.localStorage.setItem('skywalking-authority', 'admin');
  const token = window.localStorage.getItem('skywalking-authority');
  if (w.axiosCancel.length !== 0) {
    for (const func of  w.axiosCancel) {
      setTimeout(func(), 0);
    }
    w.axiosCancel = [];
  }
  /*if (to.meta.login && (token === null || token === 'guest')) {
    next();
  } else if (token === null || token === 'guest') {
    next('/login');
  } else if (to.meta.login) {
    next(from.path);
  } else {*/
  next();
  /*}*/
});

export default router;
