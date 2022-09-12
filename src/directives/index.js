import permission from './permission'
import copy from './copy'

export default (app) => {
  app.directive('permission', permission)
  app.directive('copy', copy)
}
