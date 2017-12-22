import { defaultPriority } from "./util";
import Wook from "./wook.class";

export default class WookApi {

  wook = new Wook();

  constructor() {
    this.apply_filters = this.apply_filters.bind(this);

    this.do_action = this.do_action.bind(this);

    this.add_filter = this.add_filter.bind(this);

    this.add_action = this.add_action.bind(this);

    this.remove_filter = this.remove_filter.bind(this);

    this.remove_action = this.remove_action.bind(this);

    this.has_filter = this.has_filter.bind(this);

    this.has_action = this.has_action.bind(this);

    this.remove_all_filters = this.remove_all_filters.bind(this);

    this.remove_all_actions = this.remove_all_actions.bind(this);
  }

  apply_filters(...args) {
    return this.wook.apply_filters(...args);
  }

  do_action(...args) {
    this.wook.do_action(...args);
  }

  add_filter (tag, func, priority = defaultPriority) {
    return this.wook.add_hook(tag, func, priority);
  }

  add_action (tag, func, priority = defaultPriority) {
    return this.wook.add_hook(tag, func, priority, "actions");
  }

  remove_filter (tag, func, priority) {
    return this.wook.remove_hook(tag, func, priority);
  }

  remove_action (tag, func, priority) {
    return this.wook.remove_hook(tag, func, priority, "actions");
  }

  has_filter (tag, func) {
    return this.wook.has_hook(tag, func);
  }

  has_action (tag, func) {
    return this.wook.has_hook(tag, func, "actions");
  }

  remove_all_filters (tag, priority) {
    return this.wook.remove_all_hooks(tag, priority);
  }

  remove_all_actions = (tag, priority) => {
    return this.wook.remove_all_hooks(tag, priority, "actions");
  }
}