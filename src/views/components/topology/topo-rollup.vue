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
  <div class="micro-rollup-topo-chart" :style="height">
   <div class="micro-rollup-topo-container" ref="rooluptopo" style="width: 100%;height: 100%;"></div>
  </div>
</template>
<script lang="js">
import * as d3 from 'd3';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import cyCanvas from 'cytoscape-canvas';

cytoscape.use(dagre);

export default{
  props: {
    datas: {
      type: Object,
      default() {
        return {
          nodes: [],
          calls: [],
        };
      },
    },
    coloringThreshold: {
      type: String,
      default() {
          return '100,500';
      },
    },
    topoLevel: {
      type: String,
      default() {
          return '';
      },
    },
  },
  data() {
    return {
      BS: require('./assets/ApplicationSystem.png'),
      TS: require('./assets/TS.png'),
      NODE: require('./assets/Node.png'),
      UNKNOWN: require('./assets/UNKNOWN.png'),
      TOMCAT: require('./assets/TOMCAT.png'),
      ORACLE: require('./assets/ORACLE.png'),
      MYSQL: require('./assets/MYSQL.png'),
      MONGODB: require('./assets/MONGODB.png'),
      DB2: require('./assets/DB2.png'),
      WEBSPHERE: require('./assets/websphere.png'),
      WEBLOGIC: require('./assets/weblogic.png'),
      SQLSERVER: require('./assets/SQL.png'),
      DBCLUSTER: require('./assets/DBCluster.png'),
      APPCLUSTER: require('./assets/AppCluster.png'),
      LATENCY_COLOR_RANGE: ['#339933', '#d4b106', '#cf1322'],
      chartElements: [],
      minLineWidth: 3,
      maxLineWidth: 12,
      borderWidthDef: 4,
      highlightOutRadius: 26,
      highlightInRadius: 22,
      minZoomedFontSizeDef: '',
      height: {
        height: '',
      },
    };
  },
  watch: {
    'datas.nodes': 'draw',
    'coloringThreshold': 'changeLineColor',
  },
  created() {
    this.hh();
  },
  methods: {
    hh() {
      this.height.height = window.innerHeight - 120 + 'px';
    },
    draw() {
      const codeId = this.datas.nodes.map((i) => i.id);
      for (let i = 0; i < this.datas.calls.length; i += 1) {
        const singleCall = this.datas.calls[i];
        if (codeId.indexOf(singleCall.target) === -1 ) {
            this.datas.calls[i].target = this.datas.calls[i].source;
        }
      }
      const compElements = this.transformData();
      let layoutDirDef = 'LR';
      let nodeWidthAndHeightDef = 40;
      let nodeSepDef = 50;
      let edgeSepDef = 10;
      let rankSepDef = 80;
      let labelFontSizeDef = 15;
      let paddingDef = 30;
      this.minZoomedFontSizeDef = '';
      this.borderWidthDef = 4;
      let borderWidth = 4;
      // let outRadiusDef  = 22;
      let outRadiusDef  = 20;
      let inRadiusDef = 18;
      let minLengthDef = 3;
      this.minLineWidth = 3;
      this.maxLineWidth = 12;
      this.highlightOutRadius = 26;
      this.highlightInRadius = 22;
      if (compElements.nodes.length > 50) {
        layoutDirDef = 'TB';
        nodeWidthAndHeightDef = 200;
        nodeSepDef = 220;
        rankSepDef = 60;
        edgeSepDef = 4;
        labelFontSizeDef = 75;
        paddingDef = 50;
        this.minZoomedFontSizeDef = '100px';
        this.borderWidthDef = 20;
        borderWidth = 20;
        minLengthDef = 4;
        this.minLineWidth = 12;
        this.maxLineWidth = 60;
        outRadiusDef = 100;
        inRadiusDef = 90;
        this.highlightOutRadius = 130;
        this.highlightInRadius = 110;
      } else if (compElements.nodes.length > 30) {
        layoutDirDef = 'TB';
        nodeWidthAndHeightDef = 120;
        nodeSepDef = 140;
        rankSepDef = 80;
        edgeSepDef = 40;
        labelFontSizeDef = 45;
        paddingDef = 50;
        this.minZoomedFontSizeDef = '100px';
        this.borderWidthDef = 12;
        borderWidth = 12;
        this.minLineWidth = 6;
        this.maxLineWidth = 36;
        outRadiusDef = 60;
        inRadiusDef = 54;
        this.highlightOutRadius = 78;
        this.highlightInRadius = 66;
      }
      this.chartElements = compElements;
      this.cy = cytoscape({
        container: this.$refs.rooluptopo,
        zoom: 1,
        maxZoom: 1,
        boxSelectionEnabled: true,
        wheelSensitivity: 0.2,
        layout: {
          animate: false,
          minLen: minLengthDef,
          name: 'dagre',
          rankDir: layoutDirDef,
          fit: true,
          nodeDimensionsIncludeLabels: true,
          padding: paddingDef,
          nodeSep: nodeSepDef,
          rankSep: rankSepDef,
          edgeSep: edgeSepDef,
        },
        style: [],
        elements: compElements,
      });

      this.cy.style().selector('node')
        .css({
          'width': nodeWidthAndHeightDef,
          'height': nodeWidthAndHeightDef,
          'text-valign': 'bottom',
          'text-halign': 'center',
          'font-family': 'Microsoft YaHei',
          'content': 'data(displayName)',
          'text-margin-y': 10,
          // 'border-width': this.borderWidthDef,
          'border-width': 0,
          'font-size': labelFontSizeDef,
          'border-color': '#40a9ff',
          'background-image': (ele) => this.getNodeImg(ele),
          'background-width': '70%',
          'background-height': '70%',
          'background-color': '#e6f7ff',
          'min-zoomed-font-size': this.minZoomedFontSizeDef,
        })
        .update();

      this.drawLine();

      const layer = this.cy.cyCanvas();
      const canvas = layer.getCanvas();

      this.cy.on('render cyCanvas.resize', function() {
        const ctx = canvas.getContext('2d');
        layer.resetTransform(ctx);
        layer.clear(ctx);

        layer.setTransform(ctx);
        // Draw model elements
        this.nodes().forEach( (node) => {
          const pos = node.position();
          layer.setTransform(ctx);
          const colors = ['#cf1322', '#40a9ff'];
          const nodeSla = node.data('sla');
          let sla = 100;
          if (nodeSla !== undefined) {
            sla = nodeSla;
          }

          let outRadius = outRadiusDef;
          if (sla !== 100) {
              outRadius = outRadiusDef + borderWidth / 2;
          }
          const arc = d3.arc()
            .outerRadius(outRadius)
            .innerRadius(inRadiusDef)
            .context(ctx);

          const pie = d3.pie()
            .sort(null);

          ctx.translate(pos.x, pos.y);

          const arcs = pie([100 - sla, sla]);

          arcs.forEach((d, i) => {
            ctx.beginPath();
            arc(d);
            ctx.fillStyle = colors[i];
            ctx.fill();
          });
        });
      });

      this.cy.on('click', 'node', this.onClickNode);

      this.cy.on('click', 'edge', this.onClickEdge);

      this.cy.on('click', this.onClick);

      if (layoutDirDef === 'TB') {
        this.cy.on('mouseover', 'node', this.onMouseOverNode);
        this.cy.on('mouseout', 'node', this.onMouseOutNode);
      }
    },
    onClick(evt) {
      const evtTarget = evt.target;
      if (evtTarget === this.cy) {
        this.$store.commit('rocketTopo/SET_NODE', {id: '', name: '', host: ''});
        return;
      }
    },
    onClickNode(evt) {
      const node = evt.target;
      if (node.data('type') === 'USER') {
        this.$store.commit('rocketTopo/SET_NODE', {id: '', name: '', host: ''});
        return;
      }
      for (const i in this.chartElements.nodes) {
        if (node.data('id') === this.chartElements.nodes[i].data.id) {
          this.$store.commit('rocketTopo/SET_NODE', this.chartElements.nodes[i].data);
          break;
        }
      }
      this.$store.commit('rocketTopo/SET_TOPO_DETAIL_SHOW', true);
      this.$store.commit('rocketTopo/SET_TOPO_EDIT_SHOW', false);
    },
    onMouseOverNode(evt) {
      const node = evt.target;
      node.style('min-zoomed-font-size', '0px');
    },
    onMouseOutNode(evt) {
      const node = evt.target;
      node.style('min-zoomed-font-size', '100px');
    },
    onClickEdge(evt) {
      const edge = evt.target;
      for (const i in this.datas.calls) {
        if (edge.data('id') === this.datas.calls[i].id) {
          this.$store.commit('rocketTopo/SET_NODE', this.datas.calls[i]);
          // if (edge.data('detectPoint') === 'CLIENT') {
          //   this.$store.commit('rocketTopo/SET_MODE', false);
          // } else {
          //   this.$store.commit('rocketTopo/SET_MODE', true);
          // }
          // this.$store.dispatch(this.$store.state.rocketTopo.mode ?
          //   'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO',
          //   {id: edge.data('id'), duration: this.$store.getters.durationTime});
          // this.$store.commit('rocketTopo/SET_CALLBACK', function() {
          //   this.$store.dispatch(this.$store.state.rocketTopo.mode ?
          //     'rocketTopo/GET_TOPO_SERVICE_INFO' : 'rocketTopo/GET_TOPO_CLIENT_INFO',
          //     {id: edge.data('id'), duration: this.$store.getters.durationTime});
          // });
          break;
        }
      }
      this.$store.commit('rocketTopo/SET_TOPO_DETAIL_SHOW', true);
    },
    transformData() {
      const elements =  {
        nodes: this.datas.nodes.map((node) => ({ data: node })),
        edges: this.datas.calls.filter((call) => (this.datas.nodes.findIndex((node) => node.id === call.source) > -1
          && this.datas.nodes.findIndex((node) => node.id === call.target) > -1))
          .map((call) => ({ data: { ...call } })),
      };
      const nodeWithHost = this.formatDefNodeData(this.formatNodeData(elements.nodes));
      return {
        edges: elements.edges,
        nodes: nodeWithHost,
      };
      /*const eleWithNewUsers = this.supplyUserNode(elements.edges);*/
      /*return {
        edges: elements.edges.filter((_) => !_.data || !(_.data.source === '8' || _.data.target === '8')),
        nodes: nodeWithHost.filter((_) => !_.data || _.data.id !== '8'),
      };*/
      /*return elements;*/
    },
    formatNodeData(nodes) {
      return nodes.map((_) => {
        const nodeName = _.data.name.split('@');
        _.data.displayName = _.data.name;
        if (_.data.host === 'null') {
          _.data.host = '';
        }
        // if (_.data.userDefName) {
        //   const nodeDefName = _.data.userDefName.split('@');
        //   _.data.displayName = _.data.userDefName;
        //   if (nodeDefName.length === 2) {
        //       _.data.displayName = nodeDefName[0];
        //       // _.data.userDefHost = nodeDefName[1];
        //   } else {
        //       // _.data.userDefHost = '';
        //   }
        // }
        if (nodeName.length === 2) {
            _.data.displayName = nodeName[0];
        }
        //   _.data.name = nodeName[0];
        //   // _.data.host = nodeName[1];
        //   return {
        //       data: {
        //           ..._.data,
        //           // host: nodeName[1],
        //       },
        //   };
        // }
        // _.data.host = '';
        return {
          data: {
            ..._.data,
            // host: nodeName[1],
          },
        };
      });
    },
    formatDefNodeData(nodes) {
      return nodes.map((_) => {
        if (_.data.userDefName !== undefined && _.data.userDefName !== '') {
          _.data.displayName = _.data.userDefName;
        }
        // if ((_.data.host === undefined || _.data.host === '' )
        //     &&  _.data.userDefHost !== undefined && _.data.userDefHost !== '') {
        //   _.data.host = _.data.userDefHost;
        // }
        if (_.data.userDefNodeType !== undefined && _.data.userDefNodeType !== '') {
          _.data.type = _.data.userDefNodeType;
        }
        return _;
      });
    },
    supplyUserNode(edges) {
      const nodes = [];
      return {
        nodes,
        edges: edges.map((_) => {
          if (_.data.source !== '1') {
            return {
              data: {
                ..._.data,
                dataId: _.data.id,
              },
            };
          }
          const newId = `USER-${_.data.target}`;
          nodes.push({
            data: {
              id: newId,
              name: 'User',
              type: 'USER',
              isReal: false,
            },
          });
          return {
            data: {
              ..._.data,
              source: newId,
              dataId: _.data.id,
              id: `${newId}-${_.data.target}`,
            },
          };
        }),
      };
    },
    cpmFunc(edge) {
      if (this.datas.calls.length < 1) {
        return this.maxLineWidth;
      }
      const valueData = this.datas.calls.map((_) => _.cpm);
      const max = Math.max(...valueData);
      const min = Math.min(...valueData);
      const range = max - min;

      if (range < 1) {
        return this.minLineWidth;
      }
      const value = edge.data('cpm');
      let v = min;
      if (value) {
        v = value;
      }
      const r = Math.round((v - min) * (this.maxLineWidth - this.minLineWidth) / range + this.minLineWidth);
      if (r < this.minLineWidth) {
        return this.minLineWidth;
      }
      return r;
    },
    getNodeImg(node) {
      if (this.topoLevel === 'wrappedBs') {
        return 'url(' + this.BS + ')';
      }
      if (this.topoLevel === 'wrappedTs' || this.topoLevel === 'wrappedNode') {
        const type = node.data('type').split('_');
        if (type[0] === 'DB') {
          if (type[1] === 'ORA') {
            return 'url(' + this.ORACLE + ')';
          }
          if (type[1] === 'DCL') {
            return 'url(' + this.DBCLUSTER + ')';
          }
          if (type[1] === 'MON') {
            return 'url(' + this.MONGODB + ')';
          }
          if (type[1] === 'DB2') {
            return 'url(' + this.DB2 + ')';
          }
          if (type[1] === 'MYS') {
            return 'url(' + this.MYSQL + ')';
          }
          if (type[1] === 'SQL') {
            return 'url(' + this.SQLSERVER + ')';
          }
        }
        if (type[0] === 'AP') {
          if (type[1] === 'CLS') {
            return 'url(' + this.APPCLUSTER + ')';
          }
          if (type[1] === 'TOM') {
            return 'url(' + this.TOMCAT + ')';
          }
          if (type[1] === 'WAS') {
            return 'url(' + this.WEBSPHERE + ')';
          }
          if (type[1] === 'WLS') {
            return 'url(' + this.WEBLOGIC + ')';
          }
        }
        if (this.topoLevel === 'wrappedTs') {
          return 'url(' + this.TS + ')';
        }
        if (this.topoLevel === 'wrappedNode') {
          return 'url(' + this.NODE + ')';
        }
      }
      return 'url(' + this.UNKNOWN + ')';
    },
    lineColor(edge, colorRange) {
      const value = edge.data('latency');
      if (!value) {
        return '#339933';
      }
      const range = colorRange.find((_) => value >= _.range[0] && value < _.range[1]);
      return range ? range.color : '#339933';
    },
    changeLineColor() {
      this.drawLine();
    },
    highlightNode(applicationId) {
      const highlightNode = this.cy.nodes().filter('[id="' + applicationId + '"]');
      const borderWidthCur = this.borderWidthDef;
      const minZoomedFontSizeCur = this.minZoomedFontSizeDef;
      this.cy.center(highlightNode);
      highlightNode.style({'min-zoomed-font-size': '0px'});
      highlightNode.animate({
        style: { borderColor: 'red', borderWidth: borderWidthCur * 3 },
        duration: 1000,
        complete() {
          highlightNode.style({
            borderColor: '#40a9ff',
            borderWidth: 0,
          });
        },
      });
      highlightNode.animate({
        style: { borderColor: 'red', borderWidth: borderWidthCur * 3 },
        duration: 1000,
        complete() {
          highlightNode.style({
            borderColor: '#40a9ff',
            borderWidth: 0,
          });
        },
      });
      highlightNode.animate({
        style: { borderColor: 'red', borderWidth: borderWidthCur * 3 },
        duration: 1000,
        complete() {
          highlightNode.style({
            borderColor: '#40a9ff',
            borderWidth: 0,
            'min-zoomed-font-size': minZoomedFontSizeCur,
          });
        },
      });
    },
    drawLine() {
      const latencyRange = this.coloringThreshold.split(',');
      const range = [0, ...latencyRange];
      const colorRange = range.map((_, i) => {
        const begin = _;
        let end = 99999;
        if (range.length > i + 1) {
          end = range[i + 1];
        }
        return {
          range: [begin, end],
          color: this.LATENCY_COLOR_RANGE[i],
        };
      });
      this.cy.style().selector('edge')
        .css({
          'width': (ele) => this.cpmFunc(ele),
          'line-color': (ele) => this.lineColor(ele, colorRange),
          'target-arrow-color': (ele) => this.lineColor(ele, colorRange),
          'curve-style': 'bezier',
          // 'control-point-step-size': 100,
          'target-arrow-shape': 'triangle',
          'arrow-scale': 1.2,
          'opacity': 0.666,
          'text-wrap': 'wrap',
          'text-rotation': 'autorotate',
        })
        .update();
    },
  },
};
</script>
<style lang="scss">
.micro-rollup-topo-chart{
  /*height: 100%;*/
  width: 100%;
  /*padding-bottom: 80px;*/
  .node-name {
    cursor: move;
    font-size:14px;
    fill: #ddd;
  }
  .link {
    stroke-linecap: round;
    stroke-width: 1.3px;
    fill: none;
    animation: dash 1s linear infinite;
  }
  @keyframes dash {
    from {
      stroke-dashoffset: 20;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  .node-text{
    font-family: "Lato","Source Han Sans CN", "Microsoft YaHei", sans-serif;
    fill: #ddd;
    font-size:11px;
    opacity: 0.8;
  }
  .link-text {
    font-family: "Lato","Source Han Sans CN", "Microsoft YaHei", sans-serif;
    fill: #ddd;
    font-size:11px;
    opacity: 0.8;
  }
  .node {
    cursor: move;
    fill: #333840;
    stroke-width: 0;
  }
  .link-node{
    stroke-width: 6px;
    stroke: rgba(255, 255, 255, 0);
  }
}
</style>
