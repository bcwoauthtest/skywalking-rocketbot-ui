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

<template>
<div id="app">
  <RkHeader @reloadFooter="reloadFooter"/>
  <router-view></router-view>
  <!--<RkFooter ref="footer"/>-->
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State, Getter, Mutation } from 'vuex-class';
import RkHeader from '@/components/rk-header.vue';
import RkFooter from '@/components/rk-footer.vue';
import timeFormat from '@/utils/timeFormat';

@Component({
  components: {
    RkHeader, RkFooter,
  },
})
export default class RouterIndex extends Vue {
  @State('rocketbot') private rocketbotGlobal: any;
  @Action('SET_DURATION') private SET_DURATION: any;
  @Mutation('SET_CURRENT_TENANT') private SET_CURRENT_TENANT: any;
  @Mutation('SET_SELECTED_BS') private SET_SELECTED_BS: any;
  @Action('GET_TENANT_BS_INFO') private GET_TENANT_BS_INFO: any;
  @Action('GET_CI_SERVICE_INFO') private GET_CI_SERVICE_INFO: any;
  @Getter('tenantBs') private tenantBs: any;
  @Getter('selectedBs') private selectedBs: any;
  @Getter('currentTenant') private currentTenant: any;
  @Getter('durationTime') private durationTime: any;
  private isRouterAlive: boolean = true;

  public reloadFooter(timeArray: Date[]): void {
    const footer: any = this.$refs.footer;
    footer.time = timeArray;
  }

  private async created() {

    this.$store.commit('SET_CURRENT_TENANT', this.$router.currentRoute.params.tenantId);
    if (this.$router.currentRoute.query.bsId && this.$router.currentRoute.query.bsId !== '') {
      this.$store.commit('SET_SELECTED_BS', this.$router.currentRoute.query.bsId);
    }
    if (this.$router.currentRoute.query.tsId && this.$router.currentRoute.query.tsId !== '') {
      this.$store.commit('SET_SELECTED_TS', this.$router.currentRoute.query.tsId);
    }
    if (this.$router.currentRoute.query.ciId && this.$router.currentRoute.query.ciId !== '') {
      this.$store.commit('SET_SELECTED_CI_ID', this.$router.currentRoute.query.ciId);
    }
    if (this.$router.currentRoute.query.ciCode && this.$router.currentRoute.query.ciCode !== '') {
      this.$store.commit('SET_SELECTED_CI_CODE', this.$router.currentRoute.query.ciCode);
    }
    if (this.$router.currentRoute.query.startTime && this.$router.currentRoute.query.startTime !== ''
        && this.$router.currentRoute.query.endTime && this.$router.currentRoute.query.endTime !== '') {
      const startTimeDateArray = this.$router.currentRoute.query.startTime.toString().split(' ')[0].split('-');
      const startTimeTimeArray = this.$router.currentRoute.query.startTime.toString().split(' ')[1].split(':');
      const startTime = new Date(Number(startTimeDateArray[0]),
        Number(startTimeDateArray[1]) - 1, Number(startTimeDateArray[2]),
        Number(startTimeTimeArray[0]), Number(startTimeTimeArray[1]), Number(startTimeTimeArray[2]));
      const endTimeDateArray = this.$router.currentRoute.query.endTime.toString().split(' ')[0].split('-');
      const endTimeTimeArray = this.$router.currentRoute.query.endTime.toString().split(' ')[1].split(':');
      const endTime = new Date(Number(endTimeDateArray[0]),
        Number(endTimeDateArray[1]) - 1, Number(endTimeDateArray[2]),
        Number(endTimeTimeArray[0]), Number(endTimeTimeArray[1]), Number(endTimeTimeArray[2]));
      this.$store.commit('SET_DURATION', timeFormat([startTime, endTime]));
    }
    /*this.topoParam = '/' + this.$router.currentRoute.params.tenantId;*/
    this.GET_TENANT_BS_INFO({tenantId: this.$router.currentRoute.params.tenantId});
  }
}
</script>
