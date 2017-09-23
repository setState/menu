var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import MenuMixin from './MenuMixin';
import Animate from 'rc-animate';

var SubPopupMenu = createReactClass({
  displayName: 'SubPopupMenu',

  propTypes: {
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onDeselect: PropTypes.func,
    onOpenChange: PropTypes.func,
    onDestroy: PropTypes.func,
    openTransitionName: PropTypes.string,
    openAnimation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    closeSubMenuOnMouseLeave: PropTypes.bool,
    visible: PropTypes.bool,
    children: PropTypes.any
  },

  mixins: [MenuMixin],

  onDeselect: function onDeselect(selectInfo) {
    this.props.onDeselect(selectInfo);
  },
  onSelect: function onSelect(selectInfo) {
    this.props.onSelect(selectInfo);
  },
  onClick: function onClick(e) {
    this.props.onClick(e);
  },
  onOpenChange: function onOpenChange(e) {
    this.props.onOpenChange(e);
  },
  onDestroy: function onDestroy(key) {
    this.props.onDestroy(key);
  },
  onItemHover: function onItemHover(e) {
    var _e$openChanges = e.openChanges,
        openChanges = _e$openChanges === undefined ? [] : _e$openChanges;

    openChanges = openChanges.concat(this.getOpenChangesOnItemHover(e));
    if (openChanges.length) {
      this.onOpenChange(openChanges);
    }
  },
  getOpenTransitionName: function getOpenTransitionName() {
    return this.props.openTransitionName;
  },
  renderMenuItem: function renderMenuItem(c, i, subIndex) {
    if (!c) {
      return null;
    }
    var props = this.props;
    var extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      openSubMenuOnMouseEnter: true
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },
  getMenuOffset: function getMenuOffset() {
    var _props = this.props,
        count = _props.count,
        children = _props.children;


    var menuHeight = 42;

    var realHeight = menuHeight * (count + children.length);

    // 用来判断是否被遮挡住
    var hiddenHeight = realHeight - document.body.clientHeight;

    // 采用bottom定位方式，计算相对于当前定位的偏移量，66实际为头部高度61+5
    var bottomOffset = document.body.clientHeight - menuHeight * count - 66;

    return {
      top: hiddenHeight > 0 ? 'auto' : 0,
      bottom: hiddenHeight > 0 ? -bottomOffset : 'auto'
    };
  },
  render: function render() {
    var renderFirst = this.renderFirst;
    this.renderFirst = 1;
    this.haveOpened = this.haveOpened || this.props.visible;
    if (!this.haveOpened) {
      return null;
    }
    var transitionAppear = true;
    if (!renderFirst && this.props.visible) {
      transitionAppear = false;
    }
    var props = _extends({}, this.props);
    props.className += ' ' + props.prefixCls + '-sub';
    var animProps = {};
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName;
    } else if (_typeof(props.openAnimation) === 'object') {
      animProps.animation = _extends({}, props.openAnimation);
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }

    // 添加偏移量
    var offset = this.getMenuOffset();

    var style = _extends({}, props.style, offset);

    props.style = style;

    return React.createElement(
      Animate,
      _extends({}, animProps, {
        showProp: 'visible',
        component: '',
        transitionAppear: transitionAppear
      }),
      this.renderRoot(props)
    );
  }
});

export default SubPopupMenu;