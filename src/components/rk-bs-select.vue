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
    <div style="width:350px;padding: 10px 0 10px 0">
        <multiselect
            v-model="value"
            :options="options"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="请选择业务系统"
            label="label"
            track-by="key"
            :preselect-first="false"
            selectLabel="点击选择"
            deselectLabel="点击取消"
            selectedLabel="已选"
            @close="onEndSelect"
            >
          <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">已选择{{ values.length }} 个业务系统</span>
          </template>
          <span slot="noResult">无匹配的业务系统</span>
          <span slot="noOptions">无可选业务系统</span>
        </multiselect>
    </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';
import Multiselect from 'vue-multiselect';

export default {
    props: {
        options: {
            type: Array,
            default() {
                return [];
            },
        },
        selectedBs: {
            type: Array,
            default() {
                return '';
            },
        },
    },
    data() {
        return {
            value: this.selectedBs,
        };
    },
    components: {
        Multiselect,
    },
    /*data () {
        return {
            value: [],
            options: [{key:'1', label:'1111'}, {key:'2', label:'2222'}],
        }
    },*/
    methods: {
        onEndSelect() {
            let bsids = '';
            for (let i = 0; i < this.value.length; i++) {
                bsids = bsids + this.value[i].key;
                if (i !== (this.value.length - 1)) {
                    bsids = bsids + ',';
                }
            }
            if (bsids === this.$store.getters.selectedBs) {
                return;
            }
            this.$store.commit('SET_SELECTED_TS', '');
            this.$store.commit('SET_SELECTED_BS', bsids);
            if (this.value.length > 1 || this.value.length === 0) {
                this.$store.dispatch('rocketTopo/GET_WRAPPED_BS_TOPO', {tenantId: this.$store.getters.currentTenant,
                    bsIds: bsids, duration: this.$store.getters.durationTime});
                this.$store.commit('rocketTopo/SET_CURRENT_TOPO_LEVEL', 'wrappedBs');
                this.$store.commit('rocketTopo/SET_CAN_DRILL_DOWN', true);
                this.$store.commit('rocketTopo/SET_CAN_ROLL_UP', false);
            } else if (this.value.length === 1) {
                this.$store.dispatch('rocketTopo/GET_WRAPPED_TS_TOPO', {tenantId: this.$store.getters.currentTenant,
                    bsIds: bsids, duration: this.$store.getters.durationTime});
                this.$store.commit('rocketTopo/SET_CURRENT_TOPO_LEVEL', 'wrappedTs');
                this.$store.commit('rocketTopo/SET_CAN_DRILL_DOWN', true);
                this.$store.commit('rocketTopo/SET_CAN_ROLL_UP', true);
            } else {
                this.$store.dispatch('rocketTopo/GET_TOPO', {tenantId: this.$store.getters.currentTenant,
                    bsIds: bsids, duration: this.$store.getters.durationTime});
                this.$store.commit('rocketTopo/SET_CURRENT_TOPO_LEVEL', 'topo');
                this.$store.commit('rocketTopo/SET_CAN_DRILL_DOWN', false);
                this.$store.commit('rocketTopo/SET_CAN_ROLL_UP', true);
            }
            this.$store.dispatch('rocketTopo/GET_SERVICES', {isAddress: '0',
                tenantId: this.$store.getters.currentTenant, bsIds: bsids,
                duration: this.$store.getters.durationTime});
            this.$store.commit('rocketTopo/SET_NODE', {id: '', name: '', host: ''});
        },
    },
};
</script>
<style>
.multiselect {
    max-height:30px;
    min-height:20px;
    font-size:12px;
}
.multiselect__single {
    font-size:12px;
    background: #efeff1;
}
.multiselect__input {
    font-size:12px;
    background: #efeff1;
}
.multiselect__placeholder {
    font-size:12px;
}
.multiselect__select {
    height: 28px;
}
.multiselect__tags {
    max-height:30px;
    min-height:20px;
    display: block;
    padding: 4px 40px 0 8px;
    border-radius: 0px;
    border: 1px solid #e8e8e8;
    background: #efeff1;
    font-size: 14px;
}
.multiselect__option {
  max-height:30px;
  min-height:20px;
  padding:7px 12px;
}
.multiselect__option:after {
    top: 0;
    right: 0;
    position: absolute;
    line-height: 30px;
    padding-right: 12px;
    padding-left: 20px;
    font-size: 13px;
}
.multiselect__option--highlight {
    /*background: #41b883;*/
    background: #a6a6a6;
    outline: none;
    color: white;
}

.multiselect__option--highlight:after {
    content: attr(data-select);
    /*background: #41b883;*/
    background: #a6a6a6;
    color: white;
}
.multiselect__option--selected.multiselect__option--highlight {
    /*background: #ff6a6a;*/
    background: #a6a6a6;
    color: #fff;
}

.multiselect__option--selected.multiselect__option--highlight:after {
    /*background: #ff6a6a;*/
    background: #a6a6a6;
    content: attr(data-deselect);
    color: #fff;
}
</style>

