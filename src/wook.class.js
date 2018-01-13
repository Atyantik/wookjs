import _ from "lodash";
import {defaultPriority, sanitizeFunction, sanitizePriority, sanitizeTag} from "./util";
import Hook from "./hook.class";

export default class Wook {
  actions = {};
  filters = {};

  constructor() {
    this.getTargetObject = this.getTargetObject.bind(this);
    this.add_hook = this.add_hook.bind(this);
    this.remove_hook = this.remove_hook.bind(this);
    this.has_hook = this.has_hook.bind(this);
    this.remove_all_hooks = this.remove_all_hooks.bind(this);
    this.apply_filters = this.apply_filters.bind(this);
    this.do_action = this.do_action.bind(this);
  }

  getTargetObject(target = "filters") {
    return target === "filters"? this.filters: this.actions;
  }

  add_hook (tag, func, priority = defaultPriority, target= "filters") {
    tag = sanitizeTag(tag);
    func = sanitizeFunction(func);
    priority = sanitizePriority(priority);
    const targetObject = this.getTargetObject(target);
    if (typeof targetObject[tag] === "undefined") {
      targetObject[tag] = new Hook(tag, {async: target === "filters"});
    }
    targetObject[tag].add_hook(func, priority);
    return true;
  }

  remove_hook (tag, func, priority, target="filters") {
    tag = sanitizeTag(tag);
    func = sanitizeFunction(func);
    const targetObject = this.getTargetObject(target);
    let r = false;
    if (typeof targetObject[tag] !== "undefined") {
      r = targetObject[tag].remove_hook(func, priority);
      if (_.isEmpty(targetObject[tag].callbacks) ) {
        _.unset(targetObject, tag);
      }
    }
    return r;
  }

  has_hook (tag, func, target = "filters") {
    tag = sanitizeTag(tag);
    func = sanitizeFunction(func);
    const targetObject = this.getTargetObject(target);
    if (typeof targetObject[tag] === "undefined") {
      return false;
    }
    return targetObject[tag].has_hook(tag, func);
  }

  remove_all_hooks(tag, priority, target = "filters") {
    tag = sanitizeTag(tag);
    const targetObject = this.getTargetObject(target);
    if ( typeof targetObject[tag] !== "undefined" ) {
      targetObject[tag].remove_all_hooks(priority);
      if ( targetObject[tag].has_hooks() ) {
        _.unset(targetObject, tag);
      }
    }
    return true;
  }

  async apply_filters (tag, value, ...otherArgs) {
    tag = sanitizeTag(tag);
    if (typeof this.filters[tag] !== "undefined") {
      value = await this.filters[tag].apply_hooks(value, ...otherArgs);
    }
    return value;
  }

  do_action (tag, ...args) {
    tag = sanitizeTag(tag);
    if (typeof this.actions[tag] !== "undefined") {
      this.actions[tag].apply_hooks(...args);
    }
  }
}
