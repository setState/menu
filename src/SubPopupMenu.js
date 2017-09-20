import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import MenuMixin from './MenuMixin';
import Animate from 'rc-animate';

const SubPopupMenu = createReactClass({
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
    children: PropTypes.any,
  },

  mixins: [MenuMixin],

  onDeselect(selectInfo) {
    this.props.onDeselect(selectInfo);
  },

  onSelect(selectInfo) {
    this.props.onSelect(selectInfo);
  },

  onClick(e) {
    this.props.onClick(e);
  },

  onOpenChange(e) {
    this.props.onOpenChange(e);
  },

  onDestroy(key) {
    this.props.onDestroy(key);
  },

  onItemHover(e) {
    let { openChanges = [] } = e;
    openChanges = openChanges.concat(this.getOpenChangesOnItemHover(e));
    if (openChanges.length) {
      this.onOpenChange(openChanges);
    }
  },

  getOpenTransitionName() {
    return this.props.openTransitionName;
  },

  renderMenuItem(c, i, subIndex) {
    if (!c) {
      return null;
    }
    const props = this.props;
    const extraProps = {
      openKeys: props.openKeys,
      selectedKeys: props.selectedKeys,
      openSubMenuOnMouseEnter: true,
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },

  getMenuOffset() {
    const { count, children } = this.props;

    const menuHeight = 42;

    const realHeight = menuHeight * (count + children.length);

    // 用来判断是否被遮挡住
    const hiddenHeight = realHeight - document.body.clientHeight;

    // 采用bottom定位方式，计算相对于当前定位的偏移量，66实际为头部高度61+5
    const bottomOffset = document.body.clientHeight - menuHeight * (count) - 66;

    return {
      top: hiddenHeight > 0 ? 'auto' : 0,
      bottom: hiddenHeight > 0 ? -bottomOffset : 'auto',
    };
  },

  render() {
    const renderFirst = this.renderFirst;
    this.renderFirst = 1;
    this.haveOpened = this.haveOpened || this.props.visible;
    if (!this.haveOpened) {
      return null;
    }
    let transitionAppear = true;
    if (!renderFirst && this.props.visible) {
      transitionAppear = false;
    }
    const props = { ...this.props };
    props.className += ` ${props.prefixCls}-sub`;
    const animProps = {};
    if (props.openTransitionName) {
      animProps.transitionName = props.openTransitionName;
    } else if (typeof props.openAnimation === 'object') {
      animProps.animation = { ...props.openAnimation };
      if (!transitionAppear) {
        delete animProps.animation.appear;
      }
    }

    // 添加偏移量
    const offset = this.getMenuOffset();

    const style = {
      ...props.style,
      ...offset,
    };

    props.style = style;

    return (<Animate
      {...animProps}
      showProp="visible"
      component=""
      transitionAppear={transitionAppear}
    >
      {this.renderRoot(props)}
    </Animate>);
  },
});

export default SubPopupMenu;
