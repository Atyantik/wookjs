import Wook from "./api.class";
import WookApiInstance from "./api.func";
export const {
  add_action,
  add_filter,
  remove_action,
  remove_filter,
  remove_all_actions,
  remove_all_filters,
  has_action,
  has_filter,
  apply_filters,
  do_action,
} = WookApiInstance;

export default Wook;