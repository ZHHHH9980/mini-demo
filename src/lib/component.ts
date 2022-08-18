/**
 * @file types
 * @author zipple
 */

import React from 'react';

export interface List {
  text: string;
  checked: boolean;
  disabled: boolean;
  children?: List[];
  [index: string]: any;
}

export interface Column {
  name: string;
  needFilter: boolean;
}

export interface IProps {
  dataSource: List[];
  baseCellHeight?: number;
  mode?: 'view'|'edit';
  columns?: Column[];
  onChange?: (...args: any) => any;
  renderDisabledCellTips?: (node: Node) => React.ReactNode;
  renderItem?: (node: Node) => React.ReactNode;
  onlyReturnLeafNodes?: boolean;
  showOperatorBtn?: boolean;
  onCancel?: (...args: any) => any;
  onSave?: (changedNodes: Node[]) => any;
  style?: object;
  emptyText?: string;
  okText?: string;
  cancelText?: string;
  onNodeChange?: (...args) => void;
}

export interface Node {
  nodeId: string;
  text: string;
  checked: boolean;
  indeterminate: boolean;
  level: number;
  disabled: boolean;
  children?: Node[];
  parent?: Node;
  isEmptyNode: boolean;
  [index: string]: any;
}

export interface IAction {
  type: 'init'|'checked'|'uncheck'|'filter';
  payload?: Node|IState|string[];
}

export interface IState {
  // 列
  columns: Column[];
  // 全部数据
  rawTree: Node;
  // 当前渲染的数据
  tree: Node;
  // 触发onChange的节点
  changedNodes: Node[];
  // 选中的过滤节点
  filterNodes: string[];
  // 是否只保留叶子变更节点
  onlyReturnLeafNodes: boolean;
  // 当前点击的节点
  currentClickedNode: Node|null;
}