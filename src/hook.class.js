import _ from "lodash";
import {
  defaultPriority,
  sanitizeFunction,
  sanitizePriority,
  sanitizeTag,
  generateHash
} from "./util";

export default class Hook {
  /**
   * Hook Callbacks
   */
  callbacks = {};
  sync = false;
  tag = "";
  
  constructor(tag = "", {async = true}) {
    tag = sanitizeTag(tag);
    this.tag = tag;
    this.sync = Boolean(async);
  }
  
  add_hook(func, priority = defaultPriority) {
    
    func = sanitizeFunction(func);
    priority = sanitizePriority(priority);
    
    // If no for priority found then create an object of callbacks for specified priority
    if (typeof this.callbacks[priority] === "undefined") {
      this.callbacks[priority] = {};
    }
    const id = generateHash(func);
    
    _.set(this.callbacks, `${priority}.${id}`, {
      callback: func,
    });
  }
  
  has_hook(func = false) {
    if (false === func) {
      return this.has_hooks();
    }
    func = sanitizeFunction(func);
    let id = generateHash(func);
    let detectedPriority = false;
    _.each(this.callbacks, (callable, priority) => {
      if (!_.isBoolean(detectedPriority)) return;
      detectedPriority = _.get(callable, `${id}`, false) ? priority : false;
    });
    if (!detectedPriority) return false;

    return parseInt(`${detectedPriority}`, 10);
  }
  
  has_hooks() {
    _.each(this.callbacks, callable => {
      if (!_.isEmpty(callable)) {
        return false;
      }
    });
    return true;
  }
  
  remove_hook(func, priority = defaultPriority) {
    func = sanitizeFunction(func);
    priority = sanitizePriority(priority);
    
    let detectedPriority = this.has_hook(func);
    
    if (detectedPriority) {
      let id = generateHash(func);
      _.unset(this.callbacks, `${priority}.${id}`);
      return true;
    }
    return false;
  }
  
  remove_all_hooks(priority) {
    if (typeof priority === "undefined") {
      this.callbacks = {};
      return true;
    }
    priority = sanitizePriority(priority);
    _.set(this.callbacks, `${priority}`, {});
    return true;
  }
  
  apply_hooks(value, ...args) {
    
    if (!this.sync) {
      this.apply_hooks_async(value, ...args);
      return;
    }
    return this.apply_hooks_sync(value, ...args);
  }
  
  apply_hooks_async(value, ...args) {
    _.each(_.sortBy(_.keys(this.callbacks)), key => {
      _.each(this.callbacks[key], callable => {
        callable.callback(value, ...args);
      });
    });
  }
  
  async apply_hooks_sync(value, ...originalArgs) {
    let returnValue = value;
    let allCallables = [];
    const loopPromiseSync = async (index) => {
      if (index === allCallables.length) return returnValue;
      returnValue = await allCallables[index].callback(returnValue, ...originalArgs);
      await loopPromiseSync(index + 1);
    };
    _.each(_.sortBy(_.keys(this.callbacks)), key => {
      _.each(this.callbacks[key], callable => {
        allCallables.push(callable);
      });
    });
    // Loop through 0th index
    await loopPromiseSync(0);
    return returnValue;
  }
}